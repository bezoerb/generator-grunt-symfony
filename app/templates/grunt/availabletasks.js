'use strict';
module.exports = function (grunt) {
    var chalk = require('chalk');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-phpunit');

    return {
        tasks: {
            options: {
                hideUngrouped: true,
                sort: ['default', 'serve', 'build', 'assets', 'test', 'js', 'css', 'img', 'copy', 'rev', 'eslint', 'karma', 'phpunit'],
                descriptions: {
                    default: 'Show help',
                    serve: 'Start development server. Use ' + chalk.cyan('serve:dist') + ' for production environment',
                    assets: 'Copy assets without optimization to public web directory',
                    build: 'Build & install all assets to public web directory ' + chalk.green('[test, js, css, img, rev, copy]'),
                    test: 'Run tests ' + chalk.green('[eslint, karma, phpunit]'),
                    js: 'Build & install scripts',
                    css: 'Build & install styles',
                    img: 'Build & install images',
                    rev: 'Rev assets',
                    copy: 'Copy non preprocessed assets like fonts to public web directory',
                    eslint: 'Check javascript files with eslint',
                    karma: 'Start karma test runner'
                },
                groups: {
                    'Main:': ['default', 'serve', 'build', 'assets', 'test'],
                    'Assets': ['js', 'css', 'img', 'copy', 'rev'],
                    'Tests': ['eslint', 'karma', 'phpunit']
                }
            }
        }
    };
};
