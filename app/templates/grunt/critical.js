'use strict';
module.exports = {
    options: {
        base: '.tmp',
        minify: true,
        css: ['.tmp/styles/main.css']
    },
    index: {
        src: '<%%= http.index.dest %>',
        dest: '<%%= paths.app %>/styles/critical/index.css'
    }
};
