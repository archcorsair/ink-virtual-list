import { defineConfig } from "bunup";

export default defineConfig({
  entry: "src/index.ts",
  format: "esm",
  dts: true,
  external: ["ink", "react"],
  sourcemap: "linked",
});
