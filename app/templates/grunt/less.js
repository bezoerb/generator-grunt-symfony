'use strict';
module.exports = {
    dist: {
        options: {
            paths: [
                '<%%= paths.app %>/styles',
                'bower_components'
            ]
        },
        src: '<%%= paths.app %>/styles/main.less',
        dest: '.tmp/less/main.css'
    }
}
