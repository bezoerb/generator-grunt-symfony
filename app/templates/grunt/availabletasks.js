'use strict';
module.exports = function (grunt) {
    var chalk = require('chalk');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-phpunit');

    return {
        tasks: {
            options: {
                hideUngrouped: true,
                sort: ['default', 'serve', 'build', 'assets', 'test', 'js', 'css', 'img', 'copy', 'rev', 'jshint', 'karma', 'phpunit'],
                descriptions: {
                    default: 'Show help',
                    serve: 'Start development server. Use ' + chalk.cyan('serve:dist') + ' for production environment',
                    assets: 'Build & install all assets to public web directory ' + chalk.green('[test, js, css, img, rev, copy]'),
                    build: 'Runs ' + chalk.cyan('assets') + ' and clears symfony cache',
                    test: 'Run tests ' + chalk.green('[jshint, karma, phpunit]'),
                    js: 'Build & install scripts',
                    css: 'Build & install styles',
                    img: 'Build & install images',
                    rev: 'Rev assets',
                    copy: 'Copy non preprocessed assets like fonts to public web directory',
                    jshint: 'Check javascript files with jshint',
                    karma: 'Start karma test runner'
                },
                groups: {
                    'Main:': ['default', 'serve', 'build', 'assets', 'test'],
                    'Assets': ['js', 'css', 'img', 'copy', 'rev'],
                    'Tests': ['jshint', 'karma', 'phpunit']
                }
            }
        }
    };
};
