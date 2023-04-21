import { Style } from "@react-pdf/types";

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
  "margin",
] as const;

export function isNegativeProperty(
  key: unknown
): key is typeof negativeProperties[number] {
  return typeof key === "string" && negativeProperties.includes(key as any);
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
  "zIndex",
] as const;

export type ScaledProperty = typeof scaledProperties[number];

export function isScaledProperty(key: unknown): key is ScaledProperty {
  return typeof key === "string" && scaledProperties.includes(key as any);
}

export const exactUtilities: Record<string, Style> = {
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
  "justify-normal": { justifyContent: "normal" },
  "justify-start": { justifyContent: "flex-start" },
  "justify-end": { justifyContent: "flex-end" },
  "justify-center": { justifyContent: "center" },
  "justify-between": { justifyContent: "space-between" },
  "justify-around": { justifyContent: "space-around" },
  "justify-evenly": { justifyContent: "space-evenly" },
  "justify-stretch": { justifyContent: "stretch" },
  "content-normal": { alignContent: "normal" },
  "content-start": { alignContent: "flex-start" },
  "content-end": { alignContent: "flex-end" },
  "content-center": { alignContent: "center" },
  "content-between": { alignContent: "space-between" },
  "content-around": { alignContent: "space-around" },
  "content-evenly": { alignContent: "space-evenly" },
  "content-baseline": { alignContent: "baseline" },
  "content-stretch": { alignContent: "stretch" },
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
    textOverflow: "ellipsis",
  },
  "text-ellipsis": { textOverflow: "ellipsis" },
  // Backgrounds
  "bg-inherit": { backgroundColor: "inherit" },
  "bg-current": { backgroundColor: "currentColor" },
  "bg-transparent": { backgroundColor: "transparent" },
  // Borders
  "border-solid": { borderStyle: "solid" },
  "border-dashed": { borderStyle: "dashed" },
  "border-dotted": { borderStyle: "dotted" },
};

export const utilityPatterns: Record<
  string,
  string | [string, string | string[]]
> = {
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
  origin: "transformOrigin",
};
