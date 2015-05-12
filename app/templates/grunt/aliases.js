module.exports = function (grunt, options) {
    var path = require('path');
    var php = require('php-proxy-middleware');

    // helper
    function getMiddleware(target) {
        if (target === 'dist') {
            process.env['SYMFONY_ENV'] = 'prod';
            process.env['SYMFONY_DEBUG'] = 0;
        } else {
            process.env['SYMFONY_ENV'] = 'node';
            process.env['SYMFONY_DEBUG'] = 1;
        }
        return php({
            address: '127.0.0.1', // which interface to bind to
            ini: {max_execution_time: 60, variables_order: 'EGPCS'},
            root: options.paths.dist,
            router: path.join(options.paths.dist, 'app.php')
        });
    }

    return {
        default: [
            'serve'
        ],
        css: [
            'clean:css',<% if (useLess) { %>
            'less',<% } else if (useStylus) { %>
            'stylus',<% } else if (useSass) { %>
            'sass',<% } else if (noPreprocessor) { %>
            'concat:css',<% } %>
            'autoprefixer',<% if (useUncss || useCritical) { %>
            'fetch',<% } if (useUncss) { %>
            'uncss',<% } %>
            'cssmin'<% if (useCritical) { %>,
            'critical'<% } %>
        ],
        js: [
            'clean:js', <% if (useRequirejs) { %>
            'bowerRequirejs:dist',
            'requirejs'<% } else if (useJspm) { %>
            'exec:jspm',
            'uglify:dist'<% } %>
        ],
        img: [
            'clean:img',
            'imagemin',
            'svgmin'
        ],
        rev: [
            'filerev',
            'usemin'
        ],
        assets: [
            'test',
            'js',
            'css',
            'img',
            'rev',
            'copy',
            'clean:tmp'
        ],
        build: [
            'assets',
            'exec:sfcl'
        ],
        test: [
            'jshint',<% if (useRequirejs) { %>'wiredep:test','bowerRequirejs:test',<% } %>'karma','phpunit'
        ],<% if (useCritical || useUncss) { %>
        fetch: function(){
            grunt.connectMiddleware = getMiddleware();
            grunt.task.run(['connect', 'http']);
        },<% } %>
        serve: function(target) {
            // clean tmp
            grunt.task.run(['clean:tmp']);

            if (target === 'dist') {
                grunt.task.run(['build']);
            } else {
                target = 'dev';
                grunt.task.run(['<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass<% } else if (noPreprocessor) { %>concat:css<% } %>','autoprefixer']);
            }

            // start php middleware
            grunt.bsMiddleware = getMiddleware(target);

            grunt.task.run([
                'browserSync:'+ target, // Using the php middleware
                'watch'                 // Any other watch tasks you want to run
            ]);
        }
    };
};
