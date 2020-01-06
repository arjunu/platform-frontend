const path = require("path");
const paths = require("../webpack/paths");
const devConfig = require("../webpack/webpack.config.dev");

module.exports = ({ config }) => {
  config.module.rules = [
    {
      oneOf: [
        {
          test: /\.module.scss$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                importLoaders: 3,
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                },
                localsConvention: "dashesOnly",
              },
            },
            {
              loader: "postcss-loader",
              options: { config: { path: path.join(__dirname, "postcss.config.js") } },
            },
            {
              loader: "sass-loader",
            },
            {
              loader: "sass-resources-loader",
              options: {
                resources: [path.join(__dirname, "../app/styles/neufund-theme.scss")],
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
              },
            },
            {
              loader: "postcss-loader",
              options: { config: { path: path.join(__dirname, "postcss.config.js") } },
            },
            { loader: "sass-loader" },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
          ],
        },
        {
          test: /\.(tsx?)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: "tsconfig.json",
                transpileOnly: true,
                experimentalWatchApi: true,
              },
            },
          ],
          include: [paths.app, path.join(__dirname, "../test")],
        },
        {
          test: /\.(jpg|png|svg|gif|webm|mp4)$/,
          loader: "url-loader",
          exclude: paths.inlineIcons,
          options: {
            limit: 25000,
            publicPath: "/",
          },
        },
        {
          test: /\.(svg)$/,
          loader: "raw-loader",
          include: paths.inlineIcons,
        },
        {
          test: /\.(woff2|woff|ttf|eot|otf)$/,
          loader: "file-loader",
          options: {
            name: "fonts/[hash].[ext]",
          },
        },
      ],
    },
  ];

  config.resolve.extensions = devConfig.resolve.extensions;

  return config;
};
