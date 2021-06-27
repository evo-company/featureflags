let merge = require('webpack-merge');
let base = require('./webpack.base.js');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(base, {
    output: {
        filename: 'code.[chunkhash:12].js',
    },
    plugins: [
        new ExtractTextPlugin('style.[contenthash:12].css'),
        new HtmlWebpackPlugin({
            template: __dirname + '/server/featureflags/server/web/cs/index.html',
            filename: 'index.html',
            hash: false
        }),
        new UglifyJsPlugin()
    ]
});
