/* Webpack build script. Builds everything in src_js, ES6 enabled.
   Usage: node build.js
*/
var webpack = require('webpack')
var path = require('path')
var webpackConfig = require('./webpack.config.js')
webpack(webpackConfig, function (err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log('  Build complete.\n')
  })