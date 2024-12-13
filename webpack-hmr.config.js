const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [
          /\.js$/,
          /\.d\.ts$/,
          /prisma\//,
          /script/,
          /temp/,
          /test|__tests__/,
          /views/,
          /\.json$/,
          /\.md$/,
        ],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false,
      }),
    ],
  };
};

/*
  ### hmr 참조
  https://docs.nestjs.com/recipes/hot-reload
*/
