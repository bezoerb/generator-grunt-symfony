'use strict';
module.exports = {
    styles: {
        files: ['<%%= paths.app %>/styles/{,*/}*.<% if (useLess) { %>less<% } else if (useStylus) { %>styl<% } else if (useSass) { %>{scss,sass}<% } else if (noPreprocessor) { %>css<% } %>'],
        tasks: ['<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass<% } else if (noPreprocessor) { %>concat:css<% } %>','autoprefixer']
    },
    scripts: {
        files: ['<%%= paths.app %>/scripts/**/*.js'],
        tasks: ['eslint']
    }
};
