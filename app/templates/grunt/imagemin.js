'use strict';
module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%%= paths.app %>/img',
            src: ['**/*.{png,jpg,gif}'],
            dest: '<%%= paths.dist %>/img'
        }]
    }
};
