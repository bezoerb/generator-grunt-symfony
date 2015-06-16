'use strict';
module.exports = function(grunt) {
    return {
        css: ['<%%= paths.dist %>/styles/**/*.css'],
        js: ['<%%= paths.dist %>/scripts/**/*.js'],
        options: {
            assetsDirs: ['<%%= paths.dist %>']
        }
    };
};
