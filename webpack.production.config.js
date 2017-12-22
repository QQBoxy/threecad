var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var productionConfig = [{
    entry: {
        example1: './client/example1',
        example2: './client/example2',
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public'),
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
        }, {
            test: /\.(png|jpg)$/,
            use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.(css|scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
            })
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['public']),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            filename: './[name]/bundle.js'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            comments: false
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin({
            filename: './[name]/index.css',
            allChunks: true
        })
    ]
}];

module.exports = productionConfig;
