module.exports = {
  // webpack folder's entry js - excluded from jekll's build process.
  entry: "./webpack/application.js",
  output: {
    // we're going to put the generated file in the assets folder so jekyll will grab it.
      path: 'src/js/',
      filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2016']
        }
      }
    ]
  }
};