const path = require("path");
const { NODE_ENV = "production" } = process.env;
const nodeExternals = require("webpack-node-externals");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

module.exports = {
  entry: "./bin/www.ts",
  mode: NODE_ENV,
  target: "node",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
  },
  resolve: {
    alias: {
      "@constants": path.resolve(__dirname, "constants"),
      "@interfaces": path.resolve(__dirname, "interfaces"),
      "@controllers": path.resolve(__dirname, "controllers"),
      "@middlewares": path.resolve(__dirname, "middlewares"),
      "@utils": path.resolve(__dirname, "utils"),
      "@services": path.resolve(__dirname, "services"),
      "@models": path.resolve(__dirname, "models"),
      "@validates": path.resolve(__dirname, "validates"),
      "@outputs": path.resolve(__dirname, "outputs"),
      "@dao": path.resolve(__dirname, "dao"),
      "@routes": path.resolve(__dirname, "routes"),
      "@validators": path.resolve(__dirname, "validators"),
      "@config": path.resolve(__dirname, "config"),
    },
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  externals: [nodeExternals()],
  watch: NODE_ENV === "development",
  plugins: [
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['echo "===> Starting packing with WEBPACK 5"'],
        blocking: true,
        parallel: false,
      },
      onBuildEnd: {
        scripts: ["yarn run:dev"],
        blocking: false,
        parallel: true,
      },
    }),
  ],
};
