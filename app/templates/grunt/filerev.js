'use strict';
module.exports = {
    dist: {
        src: [
            '<%%= paths.dist %>/img/**/*.{jpg,jpeg,gif,png,webp}',
            '<%%= paths.dist %>/styles/main.css',
            '<%%= paths.dist %>/scripts/main.js'
        ]
    }
};
