import path from "path";

import { type CompilerOptions } from "typescript";
import { type CreateWebpackConfigArgs } from "gatsby";

import { compilerOptions } from "../../tsconfig.json";

interface WebpackPlugin {
  constructor: {
    name: string;
  };
}

const onCreateWebpackConfig = (
  (options: Pick<CompilerOptions, "paths">) =>
  ({ actions, getConfig }: CreateWebpackConfigArgs) => {
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
      (plugin: WebpackPlugin) => plugin.constructor.name === "MiniCssExtractPlugin",
    );

    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }

    actions.replaceWebpackConfig(config);

    actions.setWebpackConfig({
      resolve: {
        alias: Object.entries(options.paths || []).reduce(
          (aliases, [name, [target]]) => ({
            ...aliases,
            [name.replace("/*", "")]: path.resolve(target.replace("/*", "")),
          }),
          {},
        ),
      },
    });
  }
)(compilerOptions);

export { onCreateWebpackConfig };
