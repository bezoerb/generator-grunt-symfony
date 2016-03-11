'use strict';
module.exports = {
    compile: {
        files: {
            '.tmp/stylus/main.css': '<%%= paths.app %>/styles/main.styl'
        },
        options: {
            paths: ['bower_components'<% if (useBrowserify || useWebpack) { %>, 'node_modules'<% } %>],
            'include css':true,
            use: [require('nib')],
            dest: '.tmp'
        }
    }
}
