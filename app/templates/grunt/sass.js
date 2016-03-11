'use strict';
module.exports = {
    options: {<% if (includeLibSass) { %>
        includePaths: ['bower_components'<% if (useBrowserify || useWebpack) { %>, 'node_modules'<% } %>]<% } else { %>
        loadPath: 'bower_components'<% if (useBrowserify || useWebpack) { %>, 'node_modules'<% } %><% } %>
    },
    all: {
        files: {
            '.tmp/sass/main.css': '<%%= paths.app %>/styles/main.scss'
        }
    }
};
