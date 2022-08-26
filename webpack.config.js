const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{ test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
			{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
		}),
		new MiniCssExtractPlugin(),
	],
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dev'),
		clean: true,
	},
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
};
