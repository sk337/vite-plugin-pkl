import { Parser } from "@sk337/pkl";
import { createFilter } from "@rollup/pluginutils";
import toSource from "tosource";

import type { Plugin } from "vite";
import type { FilterPattern } from "@rollup/pluginutils";

export type PluginOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
};

const pklExtension = /\.pkl$/;

export default (options: PluginOptions = {}): Plugin => ({
  name: "vite:transform-pkl",

  async transform(code: string, id: string) {
    if (pklExtension.test(id)) {
      const filter = createFilter(options.include, options.exclude);

      if (!filter(id)) {
        return null;
      }
      const parser = new Parser(code);
      const result = await parser.parse();
      return {
        code: `export default ${toSource(result)};`,
      };
    }
    return null;
  },
});
