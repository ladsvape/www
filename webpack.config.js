const path = require('path')
var webpack = require('webpack')

module.exports = {
    // webpack folder's entry js - excluded from jekll's build process.
    entry: './src_js/application.js',
    output: {
        // we're going to put the generated file in the assets folder so jekyll will grab it.
        path: path.resolve(__dirname, 'src/js/'),
        filename: 'bundle.js'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: true
          }
      })
    ],
    module: {
        loaders: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, 'src_js')],
                options: {
                    presets: ['env', {
                        'targets': {
                            'ios': 10,
                            'safari': 10,
                            'edge': 14,
                            'firefox': 50,
                            'browsers': ['last 2 versions', '> 5%', 'not ie < 12']
                        },
                        'exclude': ['syntax-trailing-function-commas', 'transform-exponentiation-operator'],
                        'modules': false,
                        'debug': false,
                        'useBuiltIns': true
                    }]
                }
            }
        ],
        rules: [
            {
                test: /\.(js)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: [path.resolve(__dirname, 'webpack.config.js')],
                include: [path.resolve(__dirname, 'src_js')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            }
        ]
    }
}
