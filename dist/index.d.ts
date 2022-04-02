import { TailwindTheme } from 'tailwindcss/tailwind-config';

declare type StyleSheet = Record<string, string | number>;
interface Config {
    theme: TailwindTheme;
}
declare function createTw(config?: Config): (input: string) => StyleSheet;

export { createTw as default };
