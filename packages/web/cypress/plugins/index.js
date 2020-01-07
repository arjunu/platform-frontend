const util = require("util");
const fs = require("fs");
const path = require("path");

const webpack = require("@cypress/webpack-preprocessor");

// load .env file
require("dotenv").config();

module.exports = on => {
  const options = {
    webpackOptions: require("../../webpack/webpack.config.cypress"),
  };
  on("file:preprocessor", webpack(options));

  /**
   * After taking screenshot move it to the root directory
   */
  on("after:screenshot", details => {
    const rename = util.promisify(fs.rename);
    const fileName = path.basename(details.path);

    return rename(details.path, path.join(process.cwd(), "cypress/screenshots", fileName));
  });
};
