'use strict';
module.exports = {
    options: {
        exclude: ['modernizr', 'requirejs', 'almond'],
        baseUrl: 'bower_components'
    },
    dist: {
        rjsConfig: '<%%= paths.app %>/scripts/config.js'
    }
}
