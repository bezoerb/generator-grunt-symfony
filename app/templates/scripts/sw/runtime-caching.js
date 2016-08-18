/* eslint-env worker */
// global.toolbox is defined in sw-toolbox.js, which is part of the https://github.com/GoogleChrome/sw-toolbox project.
// That sw-toolbox.js script must be executed first, so it needs to be listed before this in the
// importScripts() call that the parent service worker makes.
(function (global) {
    'use strict';

    // Activate to see debug messages of your service worker
    // See https://github.com/GoogleChrome/sw-toolbox/blob/master/README.md#options for more options
    // global.toolbox.options.debug = true;

    var assets = [
        'woff', 'woff2', 'ttf', 'eot',
        'svg', 'gif', 'png', 'jpg',
        'js', 'css'
    ];

    // See https://github.com/GoogleChrome/sw-toolbox/blob/master/README.md#toolboxfastest
    // for more details on how this handler is defined and what the toolbox.fastest strategy does.
    global.toolbox.router.get('.*.(' + assets.join('|') + ')', global.toolbox.fastest);

    // store google fonts
    global.toolbox.router.get('/(.*)', global.toolbox.fastest, {
        origin: /\.(?:googleapis|gstatic)\.com$/
    });

    // default
    global.toolbox.router.default = global.toolbox.networkFirst;
})(self);
