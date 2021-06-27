let merge = require('webpack-merge');
let base = require('./webpack.base.js');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(base, {
    plugins: [
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            template: __dirname + '/server/featureflags/server/web/cs/index.html',
            filename: 'index.html',
            hash: true
        })
    ]
});
