'use strict';
module.exports = {
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%%= paths.app %>',
            dest: '<%%= paths.dist %>',
            src: [
                '*.{ico,png,txt,json,webapp,xml}',
                'img/**/*.webp',
                'fonts/**/*'
            ]
        }]
    },<% if (useJspm || useBrowserify) { %>
    // copy unminified js because optimization is skipped when using grunt assets
    'assets-js': {
        files: [
            {expand: true, dot: true, cwd: '.tmp', dest: '<%%= paths.dist %>', src: ['scripts/*.js']}
        ]
    },<% } %>
    // copy autoprefixed css because optimization is skipped when using grunt assets
    'assets-css': {
        files: [
            {expand: true, dot: true, cwd: '.tmp', dest: '<%%= paths.dist %>', src: ['styles/*.css']}
        ]
    },
    // copy unoptimized images because optimization is skipped when using grunt assets
    'assets-img': {
        files: [
            {expand: true, dot: true, cwd: '<%%= paths.app %>', dest: '<%%= paths.dist %>', src: ['img/**/*', '!img/**/*.webp']}
        ]
    },
    'sw-scripts': {
        files: [
            // includes files within path
            {expand: true, flatten: true, src: ['node_modules/sw-toolbox/sw-toolbox.js'], dest: '<%%= paths.dist %>/scripts/sw/', filter: 'isFile'},
            {expand: true, flatten: true, src: ['<%%= paths.app %>/scripts/sw/runtime-caching.js'], dest: '<%%= paths.dist %>/scripts/sw/', filter: 'isFile'},
            {expand: true, flatten: true, src: ['node_modules/appcache-nanny/appcache-loader.html'], dest: '<%%= paths.dist %>/', filter: 'isFile'}
        ]
    }
};
