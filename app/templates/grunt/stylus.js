'use strict';
module.exports = {
    compile: {
        files: {
            '.tmp/stylus/main.css': '<%%= paths.app %>/styles/main.styl'
        },
        options: {
            paths: ['bower_components'],
            'include css':true,
            use: [require('nib')],
            dest: '.tmp'
        }
    }
}
