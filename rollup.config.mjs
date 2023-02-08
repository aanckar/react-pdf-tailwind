import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const name = "dist/index";

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: ["@react-pdf/renderer", "tailwindcss", "tailwindcss/resolveConfig"],
});

export default [
  bundle({
    plugins: [
      esbuild({
        include: /\.ts?$/,
        target: "es2017",
      }),
    ],
    output: [
      {
        file: `${name}.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
];
