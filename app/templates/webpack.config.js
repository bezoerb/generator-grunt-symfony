'use strict';
var path = require('path');
var webpack = require('webpack');
var assign = require('lodash/assign');

var resolveNpmPath = function (componentPath) {
    return path.resolve(path.join(__dirname, 'node_modules', componentPath));
};

var aliases = {
    'jquery': resolveNpmPath('jquery/dist/jquery')
};

module.exports.dev = {
    debug: true,
    devtool: '#cheap-module-source-map',

    context: path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),
    resolve: {
        root: [
            __dirname,
            path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),
            path.join(__dirname, 'test')
        ],
        modulesDirectories: [
            path.join('app', 'Resources', 'public', 'scripts'),
            'test',
            'node_modules',
            'bower_components'
        ],
        alias: aliases
    },

    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './main'
    ],

    output: {
        path: path.join(__dirname, '.tmp', 'scripts'),
        publicPath: '/scripts/',
        filename: 'main.js'
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),

        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    module: {
        loaders: [
            {test: /.js$/, exclude: /node_modules/, loaders: ['monkey-hot', 'babel']}
        ]
    }
};

module.exports.dist = {
    context: path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),
    resolve: {
        root: [
            __dirname,
            path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),
            path.join(__dirname, 'test')
        ],
        modulesDirectories: [
            path.join('app', 'Resources', 'public', 'scripts'),
            'test',
            'node_modules',
            'bower_components'
        ],
        alias: aliases
    },

    entry: [
        './main'
    ],

    output: {
        path: path.join(__dirname, 'web', 'scripts'),
        publicPath: '/scripts/',
        filename: 'main.js'
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({sourceMap: false}),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),

        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    module: {
        loaders: [
            {test: /.js$/, exclude: /node_modules/, loaders: [ 'babel']}
        ]
    }
};
