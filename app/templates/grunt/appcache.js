'use strict';
module.exports = {
    options: {
        basePath: '<%%= paths.dist %>',
        preferOnline: true
    },
    all: {
        dest: '<%%= paths.dist %>/manifest.appcache',
        cache: {
            patterns: [
                '<%%= paths.dist %>/styles/**/*.css',
                '<%%= paths.dist %>/fonts/**/*.{woff,woff2,ttf,svg,eot}',
                '<%%= paths.dist %>/img/**/*.{gif,png,jpg,svg}',
                '<%%= paths.dist %>/scripts/**/*.js'
            ]
        },
        network: ['*']
    }
};