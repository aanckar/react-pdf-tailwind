import { TailwindConfig } from 'tailwindcss/tailwind-config';

declare type StyleSheet = Record<string, string | number>;
declare function createTw(userConfig?: TailwindConfig): (input: string) => StyleSheet;

export { createTw as default };
