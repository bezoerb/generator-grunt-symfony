'use strict';
module.exports =  {
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    },
    all: [
        '<%%= paths.app %>/scripts/**/*.js'
    ]
};
