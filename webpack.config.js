const path = require('path')
var webpack = require('webpack')
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
    // webpack folder's entry js - excluded from jekll's build process.
    entry: './src_js/application.js',
    output: {
        // we're going to put the generated file in the assets folder so jekyll will grab it.
        path: path.resolve(__dirname, 'src/js/'),
        filename: 'bundle.js'
    },
    plugins: [
      new BabiliPlugin({"presets": [["babili", {}]]}, {
            comments: false
      })
    ],
    module: {
        loaders: [
            {
                test: /\.(eof|woff|woff2|ttf|svg)$/,
                include: [path.resolve(__dirname, 'node_modules/material-design-icons-iconfont/dist')],
                loader: 'file?name=fonts/[name].[ext]'
            },
            {
                test: /src_js\/\.(js)$/,
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
                    formatter: require('eslint-friendly-formatter'),
                    failOnWarning: true
                }
            }
        ]
    }
}
