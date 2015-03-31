'use strict';
module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%%= paths.app %>/img',
            src: '{,*/}*.svg',
            dest: '<%%= paths.dist %>/img'
        }]
    }
};
