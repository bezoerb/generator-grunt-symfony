'use strict';
module.exports = {
    app: {
        options: {
            configuration: '<% if (sfVersion < 3) { %>app/<% } %>phpunit.xml.dist',
            bin: '<% if (sfVersion >= 3) { %>vendor/<% } %>bin/phpunit',
            followOutput: true,
            color: true
        }
    }
};