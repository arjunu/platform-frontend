const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const paths = require("./paths");
const loadAppEnv = require("./loadAppEnv");

const applicationEnv = loadAppEnv(process.env);

module.exports = {
  entry: ["babel-regenerator-runtime", "./app/index.tsx"],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    path: paths.dist,
    publicPath: "/",
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./app/external/*", to: "./external/", flatten: true }]),
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      favicon: paths.favicon,
    }),
    new webpack.DefinePlugin({
      "process.env": applicationEnv,
    }),
    // import only `en-gb` locale from moment (which is a default one)
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/),
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(jpg|png|svg|gif)$/,
            loader: "url-loader",
            exclude: paths.inlineIcons,
            options: {
              limit: 5000,
              name: "images/[hash:8].[ext]",
            },
          },
          {
            test: /\.(mp4|webm)$/,
            loader: "url-loader",
            exclude: paths.inlineIcons,
            options: {
              limit: 5000,
              name: "videos/[hash:8].[ext]",
            },
          },
          // raw-loader for svg is used inside `paths.inlineIcons` directory only
          {
            test: /\.(svg)$/,
            loader: "raw-loader",
            include: paths.inlineIcons,
          },
          {
            test: /\.(woff2|woff|ttf|eot|otf)$/,
            loader: "file-loader",
            options: {
              name: "fonts/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
};
