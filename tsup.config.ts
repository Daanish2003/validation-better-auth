import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    yup: "src/core/adapters/yup-adapter.ts",
  },
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "es2020",
  treeshake: true,
});
