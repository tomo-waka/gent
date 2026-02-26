import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { RollupOptions } from "rollup";

const config: RollupOptions = {
  input: "src/index.js",
  plugins: [nodeResolve(), commonjs()],
  output: {
    file: "dist/gent.js",
    format: "cjs",
  },
};

export default config;
