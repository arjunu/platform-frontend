const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const generateProxyConfig = require("./proxy-urls");
const configCommon = require("./webpack.config.common");
const paths = require("./paths");
const loadAppEnv = require("./loadAppEnv");

const applicationEnv = loadAppEnv(process.env);

if (process.env.NF_VM_CONNECT) {
  console.assert(
    applicationEnv.NF_VM_ADDRESS && JSON.parse(applicationEnv.NF_VM_ADDRESS) !== "",
    "Missing or empty NF_VM_ADDRESS env variable. Add it to your .env file",
  );

  console.log("Remote backend url set to:", JSON.parse(applicationEnv.NF_VM_ADDRESS));
}

const targetAddress = process.env.NF_VM_CONNECT
  ? JSON.parse(applicationEnv.NF_VM_ADDRESS)
  : "localhost";

module.exports = merge.smart(configCommon, {
  mode: "development",
  devServer: {
    contentBase: paths.dist,
    host: "localhost",
    port: 9090,
    https: true,
    hot: true,
    overlay: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-eval' www.google-analytics.com/analytics.js " +
        "'unsafe-inline' *; frame-src *; " + // this should be only enabled for twitter-iframe.html
        "style-src blob: fonts.googleapis.com 'self' 'unsafe-inline' " +
        "*; " + // this should be only enabled for twitter-iframe.html
        "font-src 'self' fonts.gstatic.com; " +
        "img-src 'self' blob: data: documents.neufund.io documents.neufund.net www.google-analytics.com stats.g.doubleclick.net " +
        "*; " + // this should be only enabled for twitter-iframe.html
        "connect-src 'self' https://*.neufund.io wss://localhost:9090 https://api.onfido.com", // needed for hot reload
    },
    proxy: generateProxyConfig(
      `http://${targetAddress}`,
      `http://${targetAddress}:8545`,
      targetAddress,
    ),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({ tsconfig: "tsconfig.json" }),
  ],
  module: {
    rules: [
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
                  modules: true,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
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
              "react-hot-loader/webpack",
              {
                loader: "ts-loader",
                options: {
                  configFile: "tsconfig.json",
                  transpileOnly: true,
                  experimentalWatchApi: true,
                },
              },
            ],
            include: paths.app,
          },
        ],
      },
    ],
  },
});
