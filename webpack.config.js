const path = require('path');

module.exports = {
 mode: "production",
 entry: "./lib/index.js",
 output: {
  path: path.resolve(__dirname, "dist"),
  filename: 'gif-capture.min.js',
  libraryTarget: "umd"
 }
}