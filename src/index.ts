import resolveConfig from "tailwindcss/resolveConfig";
import type { Config as TailwindConfig } from "tailwindcss";
import type { Style } from "@react-pdf/types";
import { capitalize, isNumeric, px, rem } from "./utils";
import {
  type ScaledProperty,
  isNegativeProperty,
  isScaledProperty,
  exactUtilities,
  utilityPatterns,
} from "./properties";

export type Theme = Record<
  ScaledProperty,
  Record<string, string | [string, Style] | undefined>
> & {
  colors: Record<
    string,
    Record<string, string | undefined> | string | undefined
  >;
};

type Config = Omit<TailwindConfig, "content">;

interface ResolvedConfig {
  theme: Theme;
}

export function createTw(config: Config) {
  // We're using a stricter subset of Tailwind, so we can cast the config to a narrower type
  const resolvedConfig = resolveConfig({
    // Disable Tailwind content warning
    content: ["./dummy/path.js"],
    theme: config.theme ?? {},
  }) as unknown as ResolvedConfig;

  const theme = resolvedConfig.theme;

  const cache: Record<string, Style> = {};

  function transformValue(
    value: string | number | undefined,
    property?: string,
    isNegative?: boolean
  ) {
    if (value === undefined) {
      return undefined;
    }

    const sign = isNegative ? -1 : 1;

    if (typeof value === "number") {
      return sign * value;
    }

    switch (property) {
      case "lineHeight":
        // react-pdf only supports unitless line-heights
        // https://github.com/diegomura/react-pdf/issues/912
        if (value.endsWith("rem")) {
          return sign * Number(value.replace("rem", ""));
        }
        return sign * Number(value);

      default:
        if (value.endsWith("px")) {
          return px(sign * Number(value.replace("px", "")));
        }
        if (value.endsWith("rem")) {
          return rem(sign * Number(value.replace("rem", "")));
        }
        if (value.endsWith("em")) {
          return rem(sign * Number(value.replace("em", "")));
        }
        if (isNegative && property && isNegativeProperty(property)) {
          const suffix = ["deg", "%"].find((i) => value.endsWith(i));
          if (suffix) {
            return `${sign * Number(value.replace(suffix, ""))}${suffix}`;
          }
        }
        if (isNumeric(value)) {
          return sign * Number(value);
        }
        return value;
    }
  }

  function getCustomValue(value: string) {
    if (value.startsWith("[") && value.endsWith("]")) {
      return value.slice(1, value.length - 1).replaceAll("_", " ");
    }
    return undefined;
  }

  interface Value {
    value: string | number | undefined;
    type?: "color" | "unit" | "numeric" | "other";
    isCustom?: boolean;
    additionalProperties?: Style;
  }

  function parseValue(
    value: string,
    property?: string,
    isNegative?: boolean
  ): Value {
    const valueParts = value.split("-");

    // Custom value
    const customValue = getCustomValue(value);
    if (customValue) {
      // Color
      if (
        ["#", "rgb", "hsl"].some((prefix) => customValue.startsWith(prefix))
      ) {
        return {
          value: customValue,
          type: "color",
          isCustom: true,
        };
      }
      // Unit
      if (["px", "rem"].some((suffix) => customValue.endsWith(suffix))) {
        return {
          value: transformValue(customValue, property, isNegative),
          type: "unit",
          isCustom: true,
        };
      }
      // Other
      return {
        value: transformValue(customValue, property, isNegative),
        type: "other",
        isCustom: true,
      };
    }

    // Color
    // Exception for "font-weight: black" (not a color)
    if (valueParts[0] in theme.colors && property !== "fontWeight") {
      // TODO alpha colors like gray-500/50 etc
      const color = theme.colors[valueParts[0]];
      return {
        value: typeof color === "string" ? color : color?.[valueParts[1]],
        type: "color" as const,
        isCustom: false,
        additionalProperties: undefined,
      };
    }

    if (valueParts.length === 0 || !property) {
      return {
        value: undefined,
      };
    }

    // Scaled properties
    const maybeScaledProperty = ["top", "right", "bottom", "left"].includes(
      property
    )
      ? "inset"
      : property;

    if (isScaledProperty(maybeScaledProperty)) {
      const result = theme[maybeScaledProperty][value];

      // Some utilities may set multiple properties
      // eg: text-2xl => ["1.5rem", { lineHeight: "2rem"}]
      if (Array.isArray(result)) {
        const additionalProperties =
          result[1] && result[1] !== null && typeof result[1] === "object"
            ? Object.fromEntries(
                Object.entries(result[1]).map(([key, value]) => [
                  key,
                  transformValue(value, key),
                ])
              )
            : null;

        return {
          value: transformValue(result[0], property, isNegative),
          type: "unit",
          isCustom: false,
          ...(additionalProperties ? { additionalProperties } : null),
        };
      }

      return {
        value: transformValue(result, property, isNegative),
        type: "unit",
        isCustom: false,
      };
    }

    // No match
    return {
      value: undefined,
    };
  }

  function parseUtility(
    className: string
  ): Style | Record<string, string | number | undefined> | undefined {
    const modifierParts = className.split(":");
    const utilityStr = modifierParts[modifierParts.length - 1];

    // Exact utilities
    if (utilityStr in exactUtilities) {
      return exactUtilities[utilityStr];
    }

    // Utility patterns
    const isNegative = utilityStr.startsWith("-");
    const utilityParts = utilityStr.slice(isNegative ? 1 : 0).split("-");

    const matchingUtilityPatternKey = Object.keys(utilityPatterns).find(
      (key) => {
        const keyParts = key.split("-");
        const comparisonKey = utilityParts.slice(0, keyParts.length).join("-");
        return key === comparisonKey;
      }
    );

    if (matchingUtilityPatternKey) {
      const rawValue = className.split(`${matchingUtilityPatternKey}-`)[1];
      const pattern = utilityPatterns[matchingUtilityPatternKey];
      const property = Array.isArray(pattern) ? pattern[0] : pattern;
      const mappedProperties = Array.isArray(pattern)
        ? Array.isArray(pattern[1])
          ? pattern[1]
          : [pattern[1]]
        : [pattern];

      if (isNegative && !isNegativeProperty(property)) {
        return undefined;
      }

      const { value, additionalProperties } = parseValue(
        rawValue,
        property,
        isNegative
      );

      return {
        ...Object.fromEntries(mappedProperties.map((prop) => [prop, value])),
        ...(additionalProperties ?? null),
      };
    }

    // Special utilities
    switch (utilityParts[0]) {
      case "inset": {
        const direction = ["x", "y"].find((i) => i === utilityParts[1]);
        const valueStr = utilityParts.slice(direction ? 2 : 1).join("-");
        const { value } = parseValue(valueStr, "inset", isNegative);
        switch (direction) {
          case "x":
            return {
              left: value,
              right: value,
            };
          case "y":
            return {
              top: value,
              bottom: value,
            };
          default:
            return {
              top: value,
              right: value,
              bottom: value,
              left: value,
            };
        }
      }

      case "font": {
        const valueStr = utilityParts.slice(1).join("-");
        const customValue = getCustomValue(valueStr);
        if (customValue) {
          if (isNumeric(customValue)) {
            return {
              fontWeight: parseInt(customValue),
            };
          }
          return {
            fontFamily: customValue,
          };
        }
        if (theme.fontFamily && valueStr in theme.fontFamily) {
          const { value } = parseValue(valueStr, "fontFamily");
          return {
            fontFamily: value,
          };
        }
        const { value } = parseValue(valueStr, "fontWeight");
        return {
          fontWeight: value,
        };
      }

      case "text": {
        const valueStr = utilityParts.slice(1).join("-");
        const { value, additionalProperties, type } = parseValue(
          valueStr,
          "fontSize"
        );
        if (type === "color") {
          return { color: value };
        }
        return { fontSize: value, ...additionalProperties };
      }

      case "decoration": {
        const valueStr = utilityParts.slice(1).join("-");
        const { value, type } = parseValue(valueStr, "textDecorationColor");
        if (type === "color") {
          return {
            textDecorationColor: value,
          };
        }
        // Only decoration color (not thickness) supported for now
        return undefined;
      }

      case "rounded": {
        const direction = ["t", "r", "b", "l", "tl", "tr", "br", "bl"].find(
          (i) => i === utilityParts[1]
        );
        const valueStr = utilityParts.slice(direction ? 2 : 1).join("-");
        // console.log("get real val");
        const { value } = parseValue(valueStr || "DEFAULT", "borderRadius");
        switch (direction) {
          case "t":
            return {
              borderTopLeftRadius: value,
              borderTopRightRadius: value,
            };
          case "r":
            return {
              borderTopRightRadius: value,
              borderBottomRightRadius: value,
            };
          case "b":
            return {
              borderBottomRightRadius: value,
              borderBottomLeftRadius: value,
            };
          case "l":
            return {
              borderBottomLeftRadius: value,
              borderTopLeftRadius: value,
            };
          case "tl":
            return {
              borderTopLeftRadius: value,
            };
          case "tr":
            return {
              borderTopRightRadius: value,
            };
          case "br":
            return {
              borderBottomRightRadius: value,
            };
          case "bl":
            return {
              borderBottomLeftRadius: value,
            };
          default:
            return {
              borderRadius: value,
            };
        }
      }

      case "border": {
        // Border width or color
        const direction = ["x", "y", "t", "r", "b", "l"].find(
          (i) => i === utilityParts[1]
        );
        const valueStr = utilityParts.slice(direction ? 2 : 1).join("-");
        const { value, type } = parseValue(
          valueStr || "DEFAULT",
          "borderWidth"
        );
        const propertySuffix = capitalize(type === "color" ? "color" : "width");
        switch (direction) {
          case "x":
            return {
              [`borderLeft${propertySuffix}`]: value,
              [`borderRight${propertySuffix}`]: value,
            };
          case "y":
            return {
              [`borderTop${propertySuffix}`]: value,
              [`borderBottom${propertySuffix}`]: value,
            };
          case "t":
            return { [`borderTop${propertySuffix}`]: value };
          case "r":
            return { [`borderRight${propertySuffix}`]: value };
          case "b":
            return { [`borderBottom${propertySuffix}`]: value };
          case "l":
            return { [`borderLeft${propertySuffix}`]: value };
          default:
            return {
              [`border${propertySuffix}`]: value,
            };
        }
      }

      case "scale": {
        const direction = ["x", "y"].find((i) => i === utilityParts[1]);
        const valueStr = utilityParts.slice(direction ? 2 : 1).join("-");
        const { value } = parseValue(valueStr, "scale", isNegative);
        switch (direction) {
          case "x":
            return {
              transform: `scaleX(${value})`,
            };
          case "y":
            return {
              transform: `scaleY(${value})`,
            };
          default:
            return {
              transform: `scale(${value})`,
            };
        }
      }

      case "rotate": {
        const { value } = parseValue(
          utilityParts.slice(1).join("-"),
          "rotate",
          isNegative
        );
        return {
          transform: `rotate(${value})`,
        };
      }

      case "translate": {
        const direction = ["x", "y"].find((i) => i === utilityParts[1]);
        const valueStr = utilityParts.slice(direction ? 2 : 1).join("-");
        const { value } = parseValue(valueStr, "translate", isNegative);
        switch (direction) {
          case "x":
            return {
              transform: `translateX(${value})`,
            };
          case "y":
            return {
              transform: `translateY(${value})`,
            };
          default:
            return {
              transform: `translate(${value})`,
            };
        }
      }
    }

    // No match
    return undefined;
  }

  function handleInvalidClassName(className: string) {
    console.warn(`Invalid class: "${className}"`);
  }

  return function (input: string) {
    const classNames = input.split(" ").map((i) => i.trim());
    return classNames
      .map((className) => {
        if (className in cache) {
          return cache[className];
        }
        const parsed = parseUtility(className);
        if (
          parsed &&
          Object.values(parsed).every((v) => typeof v !== "undefined")
        ) {
          cache[className] = parsed;
          return parsed;
        } else {
          handleInvalidClassName(className);
        }
        return undefined;
      })
      .reduce<Style>((acc, val) => {
        if (!val) {
          return acc;
        }
        if ("transform" in val) {
          const { transform, ...rest } = val;
          return {
            ...acc,
            ...(transform
              ? { transform: [acc.transform ?? "", transform].join(" ").trim() }
              : null),
            ...rest,
          };
        }
        return { ...acc, ...val };
      }, {});
  };
}
