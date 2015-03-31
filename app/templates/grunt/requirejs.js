'use strict';
module.exports = {
    dist: {
        options: {
            baseUrl: 'bower_components',
            name: 'almond/almond',
            include: 'main',
            out: '<%%= paths.dist %>/scripts/main.js',
            mainConfigFile: '<%%= paths.app %>/scripts/config.js',
            preserveLicenseComments: false,
            useStrict: true,
            wrap: true,
            optimize: 'uglify2',
            generateSourceMaps: false
        }
    }
}
