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
    },
    'sw-scripts': {
        files: [
            // includes files within path
            {expand: true, flatten: true, src: ['node_modules/sw-toolbox/sw-toolbox.js'], dest: '<%%= paths.dist %>/scripts/sw/', filter: 'isFile'},
            {expand: true, flatten: true, src: ['<%%= paths.app %>/scripts/sw/runtime-caching.js'], dest: '<%%= paths.dist %>/scripts/sw/', filter: 'isFile'}
        ]
    }
};
