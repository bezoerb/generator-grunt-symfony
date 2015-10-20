'use strict';
module.exports = {
    options: require('../webpack.config').dist,
    build: {
        stats: {
            // Configure the console output
            colors: true,
            modules: true,
            reasons: true,
            errorDetails: true
        },

        keepalive: false
    }
};
