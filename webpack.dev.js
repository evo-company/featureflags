let merge = require('webpack-merge');
let base = require('./webpack.base.js');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = merge(base, {
    mode: 'development',
    plugins: [
        new VueLoaderPlugin(),
        new ExtractTextPlugin({
            filename: 'styles.css'
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/server/featureflags/server/web/cs/index.html',
            filename: 'index.html',
            hash: true
        }),
    ]
});
