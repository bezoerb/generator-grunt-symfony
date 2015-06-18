'use strict';
module.exports = {
    sfcl: 'php app/console cache:clear'<% if (useJspm && globalJspm) { %>,
    jspm: 'jspm bundle-sfx scripts/main .tmp/scripts/main.js'<% } else if (useJspm && !globalJspm) { %>,
    jspm: 'node_modules/.bin/jspm bundle-sfx scripts/main .tmp/scripts/main.js'<% } %>
};
