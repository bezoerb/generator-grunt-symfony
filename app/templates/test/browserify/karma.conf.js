// Karma configuration
// Generated on Thu May 07 2015 20:08:12 GMT+0200 (CEST)
'use strict';
module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../',
        plugins: [
            'karma-browserify',
            'karma-mocha',
            'karma-chai',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher'
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'mocha', 'chai'],

        files: [
            'tests/Frontend/**/*Spec.js'
        ],

        preprocessors: {
            // add browserify as preprocessor
            'tests/Frontend/**/*Spec.js': ['browserify']
        },

        // add additional browserify configuration properties here
        // such as transform and/or debug=true to generate source maps
        browserify: {
            debug: true,
            transform: [
                ['babelify', {presets: ['es2015'], ignore: /(node_modules|bower_components)/}],
                ['debowerify', {preferNPM: true}],
                ['deamdify']
            ],
            paths: [require('path').join(__dirname,'../../app/Resources/public/scripts')]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
