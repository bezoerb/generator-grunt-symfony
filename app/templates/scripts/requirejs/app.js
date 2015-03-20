/**
 *
 * @author Ben Zörb @bezoerb https://github.com/bezoerb
 * @copyright Copyright (c) 2015 Ben Zörb
 *
 * Licensed under the MIT license.
 * http://bezoerb.mit-license.org/
 * All rights reserved.
 */
define(function(require, exports) {
    'use strict';
    var $ = require('jquery');
    var log = require('loglevel');<% if (useUikit) { %>
    var UI = require('uikit');<% } else if (useFoundation) { %>
    var Foundation = require('foundation/core'); <% } else if (useBootstrap) { %>
    require('bootstrap');
    <% } %>


    exports.init = function init() {
        log.setLevel(0);
        log.debug('\'Allo \'Allo');
        log.debug('Running jQuery:', $().jquery);<% if (useBootstrap) { %>
        log.debug('Running Bootstrap:',!!$.fn.scrollspy? '~3.3.0' : false);<% } else if (useUikit) { %>
        log.debug('Running UIkit:', UI.version);<% } else if (useFoundation) { %>
        log.debug('Running Foundation:', Foundation.version);<% } %>
    };
});
