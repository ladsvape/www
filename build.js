/* Webpack build script.
  Builds everything in src_js, ES6 enabled.
   Usage: node build.js
   Use with watching file changes: node build.js watch
*/
var webpack = require('webpack')
var path = require('path')
var webpackConfig = require('./webpack.config.js')
var compiler = webpack(webpackConfig, function (err, stats) {
    if (err) throw err
    if (!process.argv.includes('watch')) {
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: true,
        chunkModules: true
      }) + '\n\n')

      console.log('  Build complete.\n')
    }
  })

if (process.argv.includes('watch')) {
  compiler.watch({ // watch options:
      aggregateTimeout: 300, // wait so long for more changes
      poll: 1000, // use polling instead of native watchers
      ignored: /node_modules/
  }, function(err, stats) {
      process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log(' Watching.\n')
  })
}