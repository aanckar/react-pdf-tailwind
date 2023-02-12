import resolveConfig from 'tailwindcss/resolveConfig';

const PT_PER_PX = 1;
const PT_PER_REM = 12;
function round(value) {
  return Math.round(value * 1e6) / 1e6;
}
function isNumeric(value) {
  if (value.startsWith(".")) {
    value = `0${value}`;
  }
  return Number(value).toString() === value;
}
function capitalize(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
}
function rem(value) {
  return round(PT_PER_REM * value);
}
function px(value) {
  return round(PT_PER_PX * value);
}

const negativeProperties = [
  "zIndex",
  "top",
  "right",
  "bottom",
  "left",
  "translate",
  "scale",
  "rotate",
  "order",
  "margin"
];
function isNegativeProperty(key) {
  return typeof key === "string" && negativeProperties.includes(key);
}
const scaledProperties = [
  "borderRadius",
  "borderWidth",
  "flexBasis",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "gap",
  "height",
  "inset",
  "letterSpacing",
  "lineHeight",
  "margin",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "objectPosition",
  "opacity",
  "order",
  "padding",
  "rotate",
  "scale",
  "textIndent",
  "transformOrigin",
  "translate",
  "width",
  "zIndex"
];
function isScaledProperty(key) {
  return typeof key === "string" && scaledProperties.includes(key);
}
const exactUtilities = {
  // Layout
  flex: { display: "flex" },
  hidden: { display: "none" },
  "object-contain": { objectFit: "contain" },
  "object-cover": { objectFit: "cover" },
  "object-fill": { objectFit: "fill" },
  "object-none": { objectFit: "none" },
  "object-scale-down": { objectFit: "scale-down" },
  "overflow-hidden": { overflow: "hidden" },
  absolute: { position: "absolute" },
  relative: { position: "relative" },
  // Flexbox
  "flex-row": { flexDirection: "row" },
  "flex-row-reverse": { flexDirection: "row-reverse" },
  "flex-col": { flexDirection: "column" },
  "flex-col-reverse": { flexDirection: "column-reverse" },
  "flex-wrap": { flexWrap: "wrap" },
  "flex-wrap-reverse": { flexWrap: "wrap-reverse" },
  "flex-nowrap": { flexWrap: "nowrap" },
  "flex-1": { flex: "1 1 0%" },
  "flex-auto": { flex: "1 1 auto" },
  "flex-initial": { flex: "0 1 auto" },
  "flex-none": { flex: "none" },
  grow: { flexGrow: 1 },
  "grow-0": { flexGrow: 0 },
  shrink: { flexShrink: 1 },
  "shrink-0": { flexShrink: 0 },
  "justify-start": { justifyContent: "flex-start" },
  "justify-end": { justifyContent: "flex-end" },
  "justify-center": { justifyContent: "center" },
  "justify-between": { justifyContent: "space-between" },
  "justify-around": { justifyContent: "space-around" },
  "justify-evenly": { justifyContent: "space-evenly" },
  "content-start": { alignContent: "flex-start" },
  "content-end": { alignContent: "flex-end" },
  "content-center": { alignContent: "center" },
  "content-between": { alignContent: "space-between" },
  "content-around": { alignContent: "space-around" },
  "items-start": { alignItems: "flex-start" },
  "items-end": { alignItems: "flex-end" },
  "items-center": { alignItems: "center" },
  "items-baseline": { alignItems: "baseline" },
  "items-stretch": { alignItems: "stretch" },
  "self-auto": { alignSelf: "auto" },
  "self-start": { alignSelf: "flex-start" },
  "self-end": { alignSelf: "flex-end" },
  "self-center": { alignSelf: "center" },
  "self-baseline": { alignSelf: "baseline" },
  "self-stretch": { alignSelf: "stretch" },
  // Typography
  italic: { fontStyle: "italic" },
  "not-italic": { fontStyle: "normal" },
  "text-left": { textAlign: "left" },
  "text-center": { textAlign: "center" },
  "text-right": { textAlign: "right" },
  "text-justify": { textAlign: "justify" },
  underline: { textDecoration: "underline" },
  "decoration-solid": { textDecorationStyle: "solid" },
  "decoration-double": { textDecorationStyle: "double" },
  "decoration-dotted": { textDecorationStyle: "dotted" },
  "decoration-dashed": { textDecorationStyle: "dashed" },
  "decoration-wavy": { textDecorationStyle: "wavy" },
  "line-through": { textDecoration: "line-through" },
  "no-underline": { textDecoration: "none" },
  uppercase: { textTransform: "uppercase" },
  lowercase: { textTransform: "lowercase" },
  capitalize: { textTransform: "capitalize" },
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  "text-ellipsis": { textOverflow: "ellipsis" },
  // Backgrounds
  "bg-inherit": { backgroundColor: "inherit" },
  "bg-current": { backgroundColor: "currentColor" },
  "bg-transparent": { backgroundColor: "transparent" },
  // Borders
  "border-solid": { borderStyle: "solid" },
  "border-dashed": { borderStyle: "dashed" },
  "border-dotted": { borderStyle: "dotted" }
};
const utilityPatterns = {
  // Layout
  object: "objectPosition",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  z: "zIndex",
  // Flexbox
  basis: "flexBasis",
  flex: "flex",
  "gap-x": ["gap", "columnGap"],
  "gap-y": ["gap", "rowGap"],
  gap: "gap",
  grow: "flexGrow",
  shrink: "flexShrink",
  order: "order",
  // Spacing
  m: "margin",
  mx: ["margin", ["marginLeft", "marginRight"]],
  my: ["margin", ["marginTop", "marginBottom"]],
  ml: ["margin", "marginLeft"],
  mr: ["margin", "marginRight"],
  mt: ["margin", "marginTop"],
  mb: ["margin", "marginBottom"],
  p: "padding",
  px: ["padding", ["paddingLeft", "paddingRight"]],
  py: ["padding", ["paddingTop", "paddingBottom"]],
  pl: ["padding", "paddingLeft"],
  pr: ["padding", "paddingRight"],
  pt: ["padding", "paddingTop"],
  pb: ["padding", "paddingBottom"],
  // Sizing
  w: "width",
  "min-w": "minWidth",
  "max-w": "maxWidth",
  h: "height",
  "min-h": "minHeight",
  "max-h": "maxHeight",
  // Typography
  leading: "lineHeight",
  tracking: "letterSpacing",
  indent: "textIndent",
  // Backgrounds
  bg: "backgroundColor",
  // Effects
  opacity: "opacity",
  // Transforms
  origin: "transformOrigin"
};

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function createTw(config) {
  var _a;
  const resolvedConfig = resolveConfig({
    // Disable Tailwind content warning
    content: ["./dummy/path.js"],
    theme: (_a = config.theme) != null ? _a : {}
  });
  const theme = resolvedConfig.theme;
  const cache = {};
  function transformValue(value, property, isNegative) {
    if (value === void 0) {
      return void 0;
    }
    const sign = isNegative ? -1 : 1;
    if (typeof value === "number") {
      return sign * value;
    }
    switch (property) {
      case "lineHeight":
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
  function getCustomValue(value) {
    if (value.startsWith("[") && value.endsWith("]")) {
      return value.slice(1, value.length - 1).replaceAll("_", " ");
    }
    return void 0;
  }
  function parseValue(value, property, isNegative) {
    const valueParts = value.split("-");
    const customValue = getCustomValue(value);
    if (customValue) {
      if (["#", "rgb", "hsl"].some((prefix) => customValue.startsWith(prefix))) {
        return {
          value: customValue,
          type: "color",
          isCustom: true
        };
      }
      if (["px", "rem"].some((suffix) => customValue.endsWith(suffix))) {
        return {
          value: transformValue(customValue, property, isNegative),
          type: "unit",
          isCustom: true
        };
      }
      return {
        value: transformValue(customValue, property, isNegative),
        type: "other",
        isCustom: true
      };
    }
    if (valueParts[0] in theme.colors && property !== "fontWeight") {
      const color = theme.colors[valueParts[0]];
      return {
        value: typeof color === "string" ? color : color == null ? void 0 : color[valueParts[1]],
        type: "color",
        isCustom: false,
        additionalProperties: void 0
      };
    }
    if (valueParts.length === 0 || !property) {
      return {
        value: void 0
      };
    }
    const maybeScaledProperty = ["top", "right", "bottom", "left"].includes(
      property
    ) ? "inset" : property;
    if (isScaledProperty(maybeScaledProperty)) {
      const result = theme[maybeScaledProperty][value];
      if (Array.isArray(result)) {
        const additionalProperties = result[1] && result[1] !== null && typeof result[1] === "object" ? Object.fromEntries(
          Object.entries(result[1]).map(([key, value2]) => [
            key,
            transformValue(value2, key)
          ])
        ) : null;
        return __spreadValues({
          value: transformValue(result[0], property, isNegative),
          type: "unit",
          isCustom: false
        }, additionalProperties ? { additionalProperties } : null);
      }
      return {
        value: transformValue(result, property, isNegative),
        type: "unit",
        isCustom: false
      };
    }
    return {
      value: void 0
    };
  }
  function parseUtility(className) {
    const modifierParts = className.split(":");
    const utilityStr = modifierParts[modifierParts.length - 1];
    if (utilityStr in exactUtilities) {
      return exactUtilities[utilityStr];
    }
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
      const mappedProperties = Array.isArray(pattern) ? Array.isArray(pattern[1]) ? pattern[1] : [pattern[1]] : [pattern];
      if (isNegative && !isNegativeProperty(property)) {
        return void 0;
      }
      const { value, additionalProperties } = parseValue(
        rawValue,
        property,
        isNegative
      );
      return __spreadValues(__spreadValues({}, Object.fromEntries(mappedProperties.map((prop) => [prop, value]))), additionalProperties != null ? additionalProperties : null);
    }
    switch (utilityParts[0]) {
      case "inset": {
        const direction = ["x", "y"].find((i) => i === utilityParts[1]);
        const valueStr = utilityParts.slice(direction ? 2 : 1).join("-");
        const { value } = parseValue(valueStr, "inset", isNegative);
        switch (direction) {
          case "x":
            return {
              left: value,
              right: value
            };
          case "y":
            return {
              top: value,
              bottom: value
            };
          default:
            return {
              top: value,
              right: value,
              bottom: value,
              left: value
            };
        }
      }
      case "font": {
        const valueStr = utilityParts.slice(1).join("-");
        const customValue = getCustomValue(valueStr);
        if (customValue) {
          if (isNumeric(customValue)) {
            return {
              fontWeight: parseInt(customValue)
            };
          }
          return {
            fontFamily: customValue
          };
        }
        if (theme.fontFamily && valueStr in theme.fontFamily) {
          const { value: value2 } = parseValue(valueStr, "fontFamily");
          return {
            fontFamily: value2
          };
        }
        const { value } = parseValue(valueStr, "fontWeight");
        return {
          fontWeight: value
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
        return __spreadValues({ fontSize: value }, additionalProperties);
      }
      case "decoration": {
        const valueStr = utilityParts.slice(1).join("-");
        const { value, type } = parseValue(valueStr, "textDecorationColor");
        if (type === "color") {
          return {
            textDecorationColor: value
          };
        }
        return void 0;
      }
      case "rounded": {
        const direction = ["t", "r", "b", "l", "tl", "tr", "br", "bl"].find(
          (i) => i === utilityParts[1]
        );
        const valueStr = utilityParts.slice(direction ? 2 : 1).join("-");
        const { value } = parseValue(valueStr || "DEFAULT", "borderRadius");
        switch (direction) {
          case "t":
            return {
              borderTopLeftRadius: value,
              borderTopRightRadius: value
            };
          case "r":
            return {
              borderTopRightRadius: value,
              borderBottomRightRadius: value
            };
          case "b":
            return {
              borderBottomRightRadius: value,
              borderBottomLeftRadius: value
            };
          case "l":
            return {
              borderBottomLeftRadius: value,
              borderTopLeftRadius: value
            };
          case "tl":
            return {
              borderTopLeftRadius: value
            };
          case "tr":
            return {
              borderTopRightRadius: value
            };
          case "br":
            return {
              borderBottomRightRadius: value
            };
          case "bl":
            return {
              borderBottomLeftRadius: value
            };
          default:
            return {
              borderRadius: value
            };
        }
      }
      case "border": {
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
              [`borderRight${propertySuffix}`]: value
            };
          case "y":
            return {
              [`borderTop${propertySuffix}`]: value,
              [`borderBottom${propertySuffix}`]: value
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
              [`border${propertySuffix}`]: value
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
              transform: `scaleX(${value})`
            };
          case "y":
            return {
              transform: `scaleY(${value})`
            };
          default:
            return {
              transform: `scale(${value})`
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
          transform: `rotate(${value})`
        };
      }
      case "translate": {
        const direction = ["x", "y"].find((i) => i === utilityParts[1]);
        const valueStr = utilityParts.slice(direction ? 2 : 1).join("-");
        const { value } = parseValue(valueStr, "translate", isNegative);
        switch (direction) {
          case "x":
            return {
              transform: `translateX(${value})`
            };
          case "y":
            return {
              transform: `translateY(${value})`
            };
          default:
            return {
              transform: `translate(${value})`
            };
        }
      }
    }
    return void 0;
  }
  function handleInvalidClassName(className) {
    console.warn(`react-pdf-tailwind: Invalid class "${className}"`);
  }
  return function(input) {
    const classNames = input.split(" ").map((i) => i.trim());
    return classNames.map((className) => {
      if (className in cache) {
        return cache[className];
      }
      const parsed = parseUtility(className);
      if (parsed && Object.values(parsed).every((v) => typeof v !== "undefined")) {
        cache[className] = parsed;
        return parsed;
      } else {
        handleInvalidClassName(className);
      }
      return void 0;
    }).reduce((acc, val) => {
      var _b;
      if (!val) {
        return acc;
      }
      if ("transform" in val) {
        const _a2 = val, { transform } = _a2, rest = __objRest(_a2, ["transform"]);
        return __spreadValues(__spreadValues(__spreadValues({}, acc), transform ? { transform: [(_b = acc.transform) != null ? _b : "", transform].join(" ").trim() } : null), rest);
      }
      return __spreadValues(__spreadValues({}, acc), val);
    }, {});
  };
}

export { createTw };
//# sourceMappingURL=index.mjs.map
