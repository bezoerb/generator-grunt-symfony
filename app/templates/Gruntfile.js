// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    var _ = require('lodash');
    var fs = require('fs-extra');
    var path = require('path');
    var chalk = require('chalk');
    var parseurl = require('parseurl');
    var php = require('php-proxy-middleware');
    var env = _.defaults(fs.existsSync('.envrc') && grunt.file.readJSON('.envrc') || {},{
        port: parseInt(grunt.option('port'), 10) || 8000
    });


    var cache, appConfig = {
        app: 'app/Resources/public',
        dist: 'web'
    };

    // just a helper to prevent double config
    function bsOptions() {
        if (cache) {
            return cache;
        }
        <% if (useWebpack) { %>
        var webpack = require('webpack');
        var webpackDevMiddleware = require('webpack-dev-middleware');
        var webpackHotMiddleware = require('webpack-hot-middleware');
        var webpackConfig = require('./webpack.config').dev;
        var bundler = webpack(webpackConfig);<% } %>

        cache = {
            server: {
                baseDir: Array.prototype.slice.call(arguments),
                middleware: [<% if (useWebpack) { %>
                    webpackDevMiddleware(bundler, {
                        publicPath: webpackConfig.output.publicPath,
                        noInfo: true,
                        stats: {colors: true}

                        // for other settings see
                        // http://webpack.github.io/docs/webpack-dev-middleware.html
                    }),

                    // bundler should be the same as above
                    webpackHotMiddleware(bundler),
                    <% } %>
                    function(req, res, next) {
                        var obj = parseurl(req);
                        if (!/\.\w{2,}$/.test(obj.pathname) || /\.php/.test(obj.pathname)) {
                            grunt.bsMiddleware(req, res, next);
                        } else {
                            next();
                        }
                    }
                ]
            },
            port: parseInt(env.port,10),
            watchTask: true,
            notify: true,
            open: true,
            ghostMode: {
                clicks: true,
                scroll: true,
                links: true,
                forms: true
            }
        };

        return cache;
    }

    // helper
    function getMiddleware(target){
        if (target === 'dist') {
            process.env['SYMFONY_ENV'] = 'prod';
            process.env['SYMFONY_DEBUG'] = 0;
        } else {
            process.env['SYMFONY_ENV'] = 'node';
            process.env['SYMFONY_DEBUG'] = 1;
        }
        return php({
            address: '127.0.0.1', // which interface to bind to
            ini: {max_execution_time: 60, variables_order:'EGPCS'},
            root: appConfig.dist,
            router: path.join(appConfig.dist, 'app.php')
        });
    }

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: appConfig,
        clean: {
            css: ['<%%= config.dist %>/styles'],
            js: ['<%%= config.dist %>/scripts'],
            img: ['<%%= config.dist %>/img'],
            tmp: ['.tmp']
        },

        watch: {
            styles: {
                files: ['<%%= config.app %>/styles/{,*/}*.<% if (useLess) { %>less<% } else if (useStylus) { %>styl<% } else if (useSass) { %>{scss,sass}<% } else if (noPreprocessor) { %>css<% } %>'],
                tasks: ['<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass<% } else if (noPreprocessor) { %>concat:css<% } %>','autoprefixer']
            },
            scripts: {
                files: ['<%%= config.app %>/scripts/**/*.js'],
                tasks: ['jshint']
            }
        },

        availabletasks: {
            tasks: {
                options: {
                    hideUngrouped: true,
                    sort: ['default', 'serve','assets','test','js','css','img','copy','rev','jshint','karma','phpunit'],
                    descriptions: {
                        default: 'Show help',
                        serve: 'Start development server. Use ' + chalk.cyan('serve:dist') + ' for production environment',
                        assets: 'Build & install all assets to public web directory ' + chalk.green('[test, js, css, img, rev, copy]'),
                        test: 'Run tests ' + chalk.green('[jshint, karma, phpunit]'),
                        js: 'Build & install scripts',
                        css: 'Build & install styles',
                        img: 'Build & install images',
                        rev: 'Rev assets',
                        copy: 'Copy non preprocessed assets like fonts to public web directory',
                        jshint: 'Check javascript files with jshint',
                        karma: 'Start karma test runner'
                    },
                    groups: {
                        'Main:': ['default','serve','assets','test'],
                        'Assets': ['js','css','img','copy','rev'],
                        'Tests': ['jshint', 'karma', 'phpunit']
                    }
                }
            }
        },

        /**
         * CSS
         */<% if (noPreprocessor) { %>
        concat: {
            css: {
                src: [<% if (useBootstrap) { %>
                    'bower_components/bootstrap/dist/css/bootstrap.css',<% } else if (useUikit) { %>
                    'bower_components/uikit/css/uikit.almost-flat.css',<% } else { %>
                    'bower_components/sass-bootstrap-glyphicons/css/bootstrap-glyphicons.css',<% } if (useFoundation) { %>
                    'bower_components/foundation/css/foundation.css',<% } if (usePure) { %>
                    'bower_components/pure/pure.css',
                    'bower_components/suit-utils-layout/lib/layout.css',<% } %>
                    '<%%= config.app %>/styles/{,*/}*.css'
                ],
                dest: '.tmp/concat/main.css'
            }
        },<% } else if (useSass) { %>
        sass: {
            options: {<% if (includeLibSass) { %>
                includePaths: ['bower_components']<% } else { %>
                loadPath: 'bower_components'<% } %>
            },
            all: {
                files: {
                    '.tmp/sass/main.css': '<%%= config.app %>/styles/main.scss'
                }
            }
        },<% } else if (useLess) { %>
        less: {
            dist: {
                options: {
                    paths: [
                        '<%%= config.app %>/styles',
                        'bower_components'
                    ]
                },
                src: '<%%= config.app %>/styles/main.less',
                dest: '.tmp/less/main.css'
            }
        },<% } else if (useStylus) { %>
        stylus: {
            compile: {
                files: {
                    '.tmp/stylus/main.css': '<%%= config.app %>/styles/main.styl'
                },
                options: {
                    paths: ['bower_components'],
                        'include css':true,
                        use: [require('nib')],
                        dest: '.tmp'
                }
            }
        },<% } %>
        autoprefixer: {
            options: {
                browsers: ['> 5%', 'last 2 versions', 'ie 9'],
                map: {
                    prev: '.tmp/styles/'
                }
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/<% if (noPreprocessor) {%>concat<% } else if (useLess) {%>less<% } else if (useSass) { %>sass<% } else if (useStylus) { %>stylus<% } %>/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        cssmin: {
            dist: {
                src: '.tmp/styles/main.css',
                dest: 'web/styles/main.css'
            }
        },<% if (useCritical || useUncss) { %>
        connect: {
            fetch: {
                options: {
                    port: env.port + 1000,
                    hostname: '127.0.0.1',
                    base: '<%%= config.dist %>',
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
        },

        http: {
            index: {
                options: {
                    url: 'http://<%%= connect.fetch.options.hostname %>:<%%= connect.fetch.options.port %>/'
                },
                dest: '.tmp/index.html'
            }
        },<% } if (useUncss) { %>
        uncss: {
            dist: {
                options: {
                    stylesheets: ['../.tmp/styles/main.css'],
                        ignore: [
                        /* ignore classes which are not present at dom load */<% if (useBootstrap) { %>
                        /\.fade/,
                            /\.collapse/,
                            /\.collapsing/,
                            /\.modal/,
                            /\.alert/,
                            /\.open/,
                        /\.in/<% } else if (useFoundation) { %>
                        /meta\..+/,
                            /\.move-/,
                            /\.fixed/,
                            /\.modal/,
                        /open/<% } else if (useUikit) { %>
                        /\.uk-open/,
                            /\.uk-notify/,
                            /\.uk-nestable/,
                            /\.uk-sortable/,
                        /\.uk-active/<% } %>
                ]
                },
                files: {
                    '.tmp/styles/main.css': ['.tmp/*.html']
                }
            }
        },<% } if (useCritical) { %>
        // Implementation of critical css processing
        // Relevant pages are fetched processed afterwards by the critical task
        // Generated critical path css is stored in 'app/Resources/public/styles/critical'
        // and inlined in the corresponding twig template.
        // See: app/Resources/views/Controller/default/index.html.twig
        critical: {
            options: {
                base: '<%%= config.dist %>',
                    minify: true,
                    css: ['<%%= config.dist %>/styles/main.css']
            },
            index: {
                src: '<%%= http.index.dest %>',
                dest: '<%%= config.app %>/styles/critical/index.css'
            }
        },<% } %>

        filerev: {
            dist: {
                src: [
                    '<%%= paths.dist %>/img/**/*.{jpg,jpeg,gif,png,webp}',
                    '<%%= config.dist %>/styles/main.css',
                    '<%%= config.dist %>/scripts/main.js'
                ]
            }
        },

        usemin: {
            css: ['<%%= config.dist %>/styles/**/*.css'],
            js: ['<%%= config.dist %>/scripts/**/*.js'],
            options: {
                assetsDirs: ['<%%= config.dist %>']
            }
        },

        // JS
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%%= config.app %>/scripts/**/*.js'
            ]
        },<% if (useRequirejs) { %>
        bowerRequirejs: {
            options: {
                exclude: ['modernizr', 'requirejs', 'almond'<% if (useBootstrap && useSass) { %>, 'bootstrap-sass-official'<% } %>],
                baseUrl: 'bower_components'
            },
            dist: {
                rjsConfig: '<%%= config.app %>/scripts/config.js'
            },
            test: {
                rjsConfig: 'test/test-main.js'
            }
        },
        requirejs: {
            dist: {
                options: {
                    baseUrl: 'bower_components',
                    name: 'almond/almond',
                    include: 'main',
                    out: '<%%= config.dist %>/scripts/main.js',
                    mainConfigFile: '<%%= config.app %>/scripts/config.js',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    optimize: 'uglify2',
                    generateSourceMaps: false
                }
            }
        },<% } else if (useBrowserify) { %>
        browserify: {
            options: {
                browserifyOptions: {
                    standalone: 'main'
                },
                preBundleCB: function (b) {
                    b.plugin(remapify, [
                        {
                            src: './**/*.js',
                            expose: 'modules',
                            cwd: __dirname + '/' + appConfig.app + '/scripts/modules'
                        },
                        {
                            src: './**/*.js',
                            expose: 'component',
                            cwd: __dirname + '/' + appConfig.app + '/scripts/component'
                        },
                        {
                            src: './**/*.js',
                            expose: 'library',
                            cwd: __dirname + '/' + appConfig.app + '/scripts/library'
                        }
                    ]);
                },
                transform: ['6to5ify','debowerify', 'deglobalify', 'deamdify']
            },
            dist: {
                src: '<%%= config.app %>/scripts/app.js',
                    dest: '.tmp/browserify/main.js'
            },
            dev: {
                src: '<%%= config.app %>/scripts/app.js',
                    dest: '.tmp/scripts/main.js',
                    options: {
                    watch: true,
                        browserifyOptions: {
                        standalone: 'main',
                            debug: true
                    }
                }
            }
        },<% } %>
        exec: {
            sfcl: 'php app/console cache:clear'<% if (useJspm) { %>,
            jspm: 'node_modules/.bin/jspm bundle-sfx scripts/main .tmp/scripts/main.js'<% } %>
        },<% if (useJspm) { %>
        uglify: {
            dist: {
                files: {
                    '<%%= config.dist %>/scripts/main.js': ['.tmp/scripts/main.js']
                }
            }
        },<% } %>
        // image optimization
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= config.app %>/img',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%%= config.dist %>/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= config.app %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%%= config.dist %>/img'
                }]
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= config.app %>',
                    dest: '<%%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'img/{,*/}*.webp',
                        'fonts/{,*/}*.*'
                    ]
                }]
            }
        },<% if (useWebpack) { %>
        webpack: {
            options: require('./webpack.config').dist,
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
        },<% } %>
        // Server
        browserSync: {
            dev: {
                bsFiles: {
                    src: [<% if (!useWebpack) { %>
                        appConfig.app + '/scripts/**/*.js',<% } %>
                        appConfig.app + '/images/**/*.{jpg,jpeg,gif,png,webp}',
                        'app/Resources/views/**/*.html.twig',
                        '.tmp/styles/*.css'
                    ]
                },
                options: bsOptions('.tmp', appConfig.app, './', 'bower_components', appConfig.dist)
            },
            dist: {
                bsFiles: { src: [] },
                options: bsOptions(appConfig.dist)
            }
        },
        // Testing
        phpunit: {
            app: {
                options: {
                    configuration: 'app/phpunit.xml.dist',
                    bin: 'bin/phpunit',
                    followOutput: true,
                    color: true
                }
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                    singleRun: true
            }
        }<% if (useRequirejs) { %>,
        wiredep: {
            test: {
                src: 'test/karma.conf.js',
                    devDependencies: false,
                    ignorePath: '../',
                    fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '{pattern: \'{{filePath}}\', included: false},'
                        }
                    }
                },
                exclude: []
            }
        }<% } %>

    });

    grunt.registerTask('default',['availabletasks']);
    grunt.registerTask('serve', function(target) {
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
    });
    <% if (useCritical || useUncss) { %>
    grunt.registerTask('fetch',function(){
        grunt.connectMiddleware = getMiddleware();
        grunt.task.run(['connect', 'http']);
    });
    <% } %>
    grunt.registerTask('revdump', function(){
        var file = 'app/config/filerev.json';
        fs.outputJsonSync(file, _.reduce(grunt.filerev.summary, function(acc,val,key){
        acc[key.replace('web','')] = val.replace('web','');
            return acc;
        },{}));
    });
    grunt.registerTask('test', ['jshint',<% if (useRequirejs) { %>'wiredep:test','bowerRequirejs:test',<% } %>'karma','phpunit']);
    grunt.registerTask('css', ['clean:css','<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass<% } else if (noPreprocessor) { %>concat:css<% } %>','autoprefixer', <% if (useCritical || useUncss) { %>'fetch',<% } if (useUncss) { %> 'uncss', <% } %> 'cssmin'<% if (useCritical) { %>, 'critical'<% } %>]);
    grunt.registerTask('js', ['clean:js', 'test', '<% if (useRequirejs) { %>bowerRequirejs', 'requirejs<% } else if (useJspm) { %>exec:jspm', 'uglify:dist<% } %>']);
    grunt.registerTask('img', ['clean:img','imagemin','svgmin']);
    grunt.registerTask('rev', ['filerev', 'revdump', 'usemin']);
    grunt.registerTask('assets', ['js', 'css', 'img', 'rev', 'copy','clean:tmp']);
    grunt.registerTask('build', ['assets','exec:sfcl']);
};
