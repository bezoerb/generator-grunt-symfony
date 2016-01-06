'use strict';
module.exports = function(grunt, options) {
    <% if (useWebpack) { %>var path = require('path');
    <% } %>var parseurl = require('parseurl');

    // just a helper to prevent double config
    function bsOptions() {
        <% if (useWebpack) { %>
        var webpack = require('webpack');
        var webpackDevMiddleware = require('webpack-dev-middleware');
        var webpackHotMiddleware = require('webpack-hot-middleware');
        var webpackConfig = require('../webpack.config').dev;
        var bundler = webpack(webpackConfig);<% } %>

        return {
            server: {
                baseDir: Array.prototype.slice.call(arguments),
                middleware: [<% if (useWebpack) { %>
                    webpackDevMiddleware(bundler, {
                        publicPath: webpackConfig.output.publicPath,
                        noInfo: true,
                        stats: {colors: true}

                        // for other settings see
                        // http://webpack.github.io/docs/webpack-dev-middleware.html
                    }),

                    // bundler should be the same as above
                    webpackHotMiddleware(bundler),
                    <% } %>
                    // use php proxy 
                    function(req, res, next) {
                        var obj = parseurl(req);
                        if (!/\.\w{2,}$/.test(obj.pathname) || /\.php/.test(obj.pathname)) {
                            grunt.bsMiddleware(req, res, next);
                        } else {
                            next();
                        }
                    }
                ]
            },
            port: parseInt(options.env.port, 10),
            watchTask: true,
            notify: true,
            open: true,
            ghostMode: {
                clicks: true,
                scroll: true,
                links: true,
                forms: true
            }
        };
    }

    return {
        dev: {
            bsFiles: {
                src: [
                    <% if (!useWebpack) { %>'<%%= paths.app %>/scripts/**/*.js',
                    <% } %>'<%%= paths.app %>/images/**/*.{jpg,jpeg,gif,png,webp}',
                    'app/Resources/views/**/*.html.twig',
                    '.tmp/styles/*.css'
                ]
            },
            options: bsOptions('.tmp', '<%%= paths.app %>', './', 'bower_components', '<%%= paths.dist %>')
        },
        dist: {
            bsFiles: {src: []},
            options: bsOptions('<%%= paths.dist %>')
        }
    };
};
