const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CURRENT_WORKING_DIR = process.cwd();

const config = {
  mode: "production",
  entry: [path.join(CURRENT_WORKING_DIR, "client/main.js")],
  output: {
    path: path.join(CURRENT_WORKING_DIR, "/dist"),
    filename: "bundle.js",
    publicPath: "/dist/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(ttf|eot|svg|gif|jpg|png|ico)(\?[\s\S]+)?$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: `./client/assets/images/favicon.ico`,
    }),
  ],
};

module.exports = config;
