module.exports = {
    entry: [__dirname + '/server/featureflags/server/web/cs/app.ts'],
    output: {
        path: __dirname + '/server/featureflags/server/web/static',
        filename: 'code.js',
        publicPath: '/static'
    },
    resolve: {
        extensions: ['.js', '.ts', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true,
                }
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(ttf|eot|woff|woff2|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            }
        ]
    }
};
