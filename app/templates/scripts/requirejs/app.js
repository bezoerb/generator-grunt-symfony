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
    var log = require('loglevel');


    exports.init = function init() {
        log.setLevel(0);
        log.debug('Running jQuery: ', $().jquery);
        log.debug('\'Allo \'Allo');
    };
});