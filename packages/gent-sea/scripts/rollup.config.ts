import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { RollupOptions } from "rollup";

const config: RollupOptions = {
  input: "src/index.js",
  plugins: [
    // @ts-ignore avoid ts2349 error because of that esm has been treated as commonjs incorrectly.
    nodeResolve(),
    // @ts-ignore avoid ts2349 error because of that esm has been treated as commonjs incorrectly.
    commonjs(),
  ],
  output: {
    file: "dist/gent.js",
    format: "cjs",
  },
};

export default config;
