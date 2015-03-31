'use strict';
module.exports = {
    options: {<% if (includeLibSass) { %>
        includePaths: ['bower_components']<% } else { %>
        loadPath: 'bower_components'<% } %>
    },
    all: {
        files: {
            '.tmp/sass/main.css': '<%%= paths.app %>/styles/main.scss'
        }
    }
};
