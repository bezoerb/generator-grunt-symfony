'use strict';
module.exports = {
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%%= paths.app %>',
            dest: '<%%= paths.dist %>',
            src: [
                '*.{ico,png,txt}',
                'img/{,*/}*.webp',
                'fonts/{,*/}*.*'
            ]
        }]
    }
};
