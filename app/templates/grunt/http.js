'use strict';
module.exports = {
    index: {
        options: {
            url: 'http://<%%= connect.fetch.options.hostname %>:<%%= connect.fetch.options.port %>/'
        },
        dest: '.tmp/index.html'
    }
};
