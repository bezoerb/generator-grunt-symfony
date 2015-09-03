'use strict';
module.exports = {
    sfcl: 'php app/console cache:clear'<% if (useJspm) { %>,
    jspm: 'node_modules/.bin/jspm bundle-sfx scripts/main .tmp/scripts/main.js'<% } %>
};
