module.exports = function (grunt, options) {
    var _ = require('lodash');
    var fs = require('fs-extra');
    var path = require('path');
    var slash = require('slash');
    var php = require('php-proxy-middleware');<% if (useCritical || useUncss) { %>
    var getPort = require('get-port');
    <% } %>

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
            'availabletasks'
        ],
        css: function (target) {
            grunt.task.run([
                'clean:css',<% if (useLess) { %>
                'less',<% } else if (useStylus) { %>
                'stylus',<% } else if (useSass) { %>
                'sass',<% } else if (noPreprocessor) { %>
                'concat:css',<% } %>
                'autoprefixer'
            ]);
            if (target === 'dist') {
                grunt.task.run([<% if (useUncss || useCritical) { %>
                    'fetch',<% } if (useUncss) { %>
                    'uncss',<% } %>
                    'cssmin'<% if (useCritical) { %>,
                    'critical'<% } %>
                ]);
            } else {
                grunt.task.run(['copy:assets-css']);
            }
        },
        js: function (<% if (useRequirejs || useJspm) { %>target<% } %>) {
            grunt.task.run([
                'clean:js'<% if (useRequirejs) { %>,
                'bowerRequirejs:dist'<% } else if (useWebpack) { %>,
                'webpack'<% } else if (useJspm) { %>,
                'exec:jspm'<% } %>
            ]);<% if (useRequirejs || useJspm) { %>
            if (target === 'dist') {
                grunt.task.run([<% if (useRequirejs) { %>'requirejs:dist'<% } else { %>'uglify:dist'<% } %>]);
            } else {
                grunt.task.run([<% if (useRequirejs) { %>'requirejs:assets'<% } else { %>'copy:assets-js'<% } %>]);
            }<% } %>
        },
        img: function (target) {
            grunt.task.run(['clean:img']);
            if (target === 'dist') {
                grunt.task.run([
                    'imagemin',
                    'svgmin'
                ]);
            } else {
                grunt.task.run(['copy:assets-img']);
            }
        },
        rev: [
            'filerev',
            'revdump',
            'usemin'
        ],
        'generate-service-worker': [
            'copy:sw-scripts',
            'sw-precache:dist',
            // fallback for browsers not supporting service workers
            'appcache'
        ],
        assets: [
            'js:assets',
            'css:assets',
            'img:assets',
            'copy:sw-scripts',
            'rev',
            'copy:dist',
            'clean:tmp',
            'generate-service-worker'
        ],
        build: [
            'test',
            'js:dist',
            'css:dist',
            'img:dist',
            'copy:sw-scripts',
            'rev',
            'copy:dist',
            'clean:tmp',
            'generate-service-worker'
        ],
        test: [
            'eslint',<% if (useRequirejs) { %>'wiredep:test','bowerRequirejs:test',<% } %>'karma','phpunit'
        ],<% if (useCritical || useUncss) { %>
        fetch: function(){
            var done = this.async();

            getPort().then(function(port){
                grunt.connectMiddleware = getMiddleware();
                grunt.config.set('connect.fetch.options.port', port);
                grunt.task.run(['connect', 'http']);
                done();
            });
        },<% } %>
        revdump: function(){
            var file = 'app/config/filerev.json';
            fs.outputJsonSync(file, _.reduce(grunt.filerev.summary, function(acc,val,key){
                acc[slash(key.replace('web',''))] = slash(val.replace('web',''));
                return acc;
            },{}));
        },
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
