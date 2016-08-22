var path = require('path');
var webpack = require('webpack');

// Third party plugins.
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');

// Development asset host, asset location and build output path.
var publicHost = 'http://localhost:2992';
var rootAssetPath = './assets';
var buildOutputPath = './build/public';

module.exports = {


    entry: {
        // Chunks (files) that will get written out for JS and CSS files.
        app_js: [
            'webpack/hot/dev-server',
            rootAssetPath + '/scripts/index'
        ],
        app_css: [
            rootAssetPath + '/styles/main'
        ]
    },
    output: {
        // Where and how will the files be formatted when they are output.
        path: buildOutputPath,
        publicPath: publicHost + '/assets/',
        filename: 'app.js',
        chunkFilename: 'app.js'
    },
    resolve: {

        // Avoid having to require files with an extension if they are here.
        extensions: ['', '.js', '.jsx', '.css']
    },
    module: {
        // Various loaders to pre-process files of specific types.
        // If you wanted to SASS for example, you'd want to install this:
        //   https://github.com/jtangelder/sass-loader
        loaders: [
            {
                test: /\.jsx$/i, loaders: ['react-hot-loader', 'babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },// Font Definitions
        // Font Definitions
   {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            }
    ]
    },
    plugins: [
        // Stop modules with syntax errors from being emitted.
        new webpack.NoErrorsPlugin(),
        // Ensure CSS chunks get written to their own file.
        new ExtractTextPlugin('main.css'),
        // Create the manifest file that Flask and other frameworks use.
        new ManifestRevisionPlugin(path.join('build', 'manifest.json'), {
            rootAssetPath: rootAssetPath,
            ignorePaths: ['/styles', '/scripts']
        })
    ]
};
