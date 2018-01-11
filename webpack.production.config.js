var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var productionConfig = [{
    entry: {
        home: './client/home',
        example1: './client/example1',
        example2: './client/example2',
        example3: './client/example3',
        example4: './client/example4',
        example5: './client/example5',
        example6: './client/example6',
        example7: './client/example7',
        example8: './client/example8',
        example9: './client/example9',
        example10: './client/example10',
        example11: './client/example11',
        example12: './client/example12',
        example13: './client/example13',
        example14: './client/example14',
        example15: './client/example15',
        example16: './client/example16',
        example17: './client/example17',
        example18: './client/example18',
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
