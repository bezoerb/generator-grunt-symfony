'use strict';
module.exports = {
    options: {
        browsers: ['> 5%', 'last 2 versions', 'ie 9'],
        map: {
            prev: '.tmp/styles/'
        }
    },
    dist: {
        files: [{
            expand: true,
            cwd: '.tmp/<% if (noPreprocessor) {%>concat<% } else if (useLess) {%>less<% } else if (useSass) { %>sass<% } else if (useStylus) { %>stylus<% } %>/',
            src: '{,*/}*.css',
            dest: '.tmp/styles/'
        }]
    }
};
