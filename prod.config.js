const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    module: {
        rules: [
            { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
            { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'MyWordle',
            template: 'src/index.html'
        }),
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'docs'),
        clean: true
    }
};