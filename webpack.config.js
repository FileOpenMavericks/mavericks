'use strict'

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: [
        'babel-polyfill',
        './src/main.js'
    ],
    output: {
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new ExtractTextPlugin("mavericks.css"),
        new HtmlWebpackPlugin({
            title: 'Mavericks',
            template: './build/index.html',
            minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    html5: true,
                    minifyCSS: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
            },
            hash: true
        }),
        new CopyWebpackPlugin([
            {
                from: 'static'
            }
        ])
    ]
}
