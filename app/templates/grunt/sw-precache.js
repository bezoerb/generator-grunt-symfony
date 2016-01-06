'use strict';
var pkg = require('../package.json');

module.exports = {
    options: {
        cacheId: pkg.name || 'grunt-symfony',
        verbose: true,
        baseDir: '<%%= paths.dist %>',
        importScripts: [
            'scripts/sw/sw-toolbox.js',
            'scripts/sw/runtime-caching.js'
        ],
        staticFileGlobs: [
            'styles/**/*.css',
            'fonts/**/*.{woff,woff2,ttf,svg,eot}',
            'img/**/*.{gif,png,jpg,svg}',
            'scripts/**/*.js'
        ]
    },
    dist: {
        handleFetch: true
    }
};
