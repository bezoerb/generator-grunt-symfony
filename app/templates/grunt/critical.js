'use strict';
module.exports = {
    options: {
        base: '<%%= paths.dist %>',
        minify: true,
        css: ['<%%= paths.dist %>/styles/main.css']
    },
    index: {
        src: '<%%= http.index.dest %>',
        dest: '<%%= paths.app %>/styles/critical/index.css'
    }
};
