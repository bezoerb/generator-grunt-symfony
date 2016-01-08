// Implementation of critical css processing
// Relevant pages are fetched processed afterwards by the critical task
// Generated critical path css is stored in 'app/Resources/public/styles/critical'
// and inlined in the corresponding twig template.
// See: app/Resources/views/Controller/default/index.html.twig
'use strict';
module.exports = function(grunt, options) {
    var parseurl = require('parseurl');
    return {
        fetch: {
            options: {
                port: options.env.port + 1000,
                hostname: '127.0.0.1',
                base: '<%%= paths.dist %>',
                middleware: [
                    function(req, res, next) {
                        var obj = parseurl(req);
                        if (!/\.\w{2,}$/.test(obj.pathname) || /\.php/.test(obj.pathname)) {
                            grunt.connectMiddleware(req, res, next);
                        } else {
                            next();
                        }
                    }
                ]
            }
        }
    };
};
