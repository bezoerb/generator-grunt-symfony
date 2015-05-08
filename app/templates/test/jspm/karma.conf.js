// Karma configuration
// Generated on Thu May 07 2015 20:08:12 GMT+0200 (CEST)
'use strict';
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',

        plugins: [
            'karma-systemjs',
            'karma-mocha',
            'karma-chai',
            'karma-phantomjs-launcher',
            'karma-mocha-reporter'
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['systemjs','mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: [
           {pattern: 'jspm_packages/npm/**/*.js', included: false},
           {pattern: 'jspm_packages/github/**/*.js', included: false},
           {pattern: 'app/Resources/public/scripts/**/*.js', included: false},
           {pattern: 'test/**/*Spec.js', included: false}
        ],

        systemjs: {
            // Path to your SystemJS configuration file
            configFile: 'app/Resources/public/scripts/config.js',

            // File patterns for your application code, dependencies, and test suites
            files: [
                'app/Resources/public/scripts/modules/**/*.js',
                'test/**/*Spec.js'
            ],

            // SystemJS configuration specifically for tests, added after your config file.
            // Good for adding test libraries and mock modules
            config: {
                paths: {
                    '*': 'app/Resources/public/scripts/*.js',
                    'test\/*': 'test/*.js',
                    'github:*': 'jspm_packages/github/*.js',
                    'npm:*': 'jspm_packages/npm/*.js'
                },
                transpiler: 'babel'
            },

            // Specify the suffix used for test suite file names.  Defaults to .test.js, .spec.js, _test.js, and _spec.js
            testFileSuffix: 'Spec.js'
        },

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},

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
        logLevel: config.LOG_INFO,

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
