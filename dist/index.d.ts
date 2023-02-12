import { Config as Config$1 } from 'tailwindcss';
import { Style } from '@react-pdf/types';

declare const scaledProperties: readonly ["borderRadius", "borderWidth", "flexBasis", "fontFamily", "fontSize", "fontWeight", "gap", "height", "inset", "letterSpacing", "lineHeight", "margin", "maxHeight", "maxWidth", "minHeight", "minWidth", "objectPosition", "opacity", "order", "padding", "rotate", "scale", "textIndent", "transformOrigin", "translate", "width", "zIndex"];
type ScaledProperty = typeof scaledProperties[number];

type Theme = Record<ScaledProperty, Record<string, string | [string, Style] | undefined>> & {
    colors: Record<string, Record<string, string | undefined> | string | undefined>;
};
type Config = Omit<Config$1, "content">;
declare function createTw(config: Config): (input: string) => Style;

export { Theme, createTw };
