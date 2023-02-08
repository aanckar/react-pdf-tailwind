import { Config as Config$1 } from 'tailwindcss/types';

type StyleSheet = Record<string, string | number>;
type Config = Omit<Config$1, "content">;
declare function createTw(config?: Config): (input: string) => StyleSheet;

export { createTw as default };
