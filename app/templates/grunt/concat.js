'use strict';
module.exports = {
    css: {
        src: [<% if (useBootstrap) { %>
            'bower_components/bootstrap/dist/css/bootstrap.css',<% } else if (useUikit) { %>
            'bower_components/uikit/css/uikit.almost-flat.css',<% } else { %>
            'bower_components/sass-bootstrap-glyphicons/css/bootstrap-glyphicons.css',<% } if (useFoundation) { %>
            'bower_components/foundation/css/foundation.css',<% } if (usePure) { %>
            'bower_components/pure/pure.css',
            'bower_components/suit-utils-layout/lib/layout.css',<% } %>
           '<%%= paths.app %>/styles/{,*/}*.css'
        ],
        dest: '.tmp/concat/main.css'
    }
};
