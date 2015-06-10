'use strict';
module.exports = {
    dist: {
        src: [
            // enable if you need it. Can cause some conflicts when dynamically creating filenames via twig
            //'<%%= paths.dist %>/img/**/*.{jpg,jpeg,gif,png,webp}',

            '<%%= paths.dist %>/styles/main.css',
            '<%%= paths.dist %>/scripts/main.js'
        ]
    }
};
