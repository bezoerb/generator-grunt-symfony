// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    var _ = require('lodash');
    var fs = require('fs');
    var path = require('path');<% if (useLess) { %>
    var LessPluginAutoPrefix = require('less-plugin-autoprefix');<% } %>
    var parseurl = require('parseurl');
    var php = require('php-proxy-middleware');
    var env = fs.existsSync('.envrc') && grunt.file.readJSON('.envrc') || {
        port: parseInt(grunt.option('port'),10) || 8000,
    };


    var appConfig = {
        app: 'app/Resources/public',
        dist: 'web'
    };

    // just a helper to prevent double config
    function bsOptions() {
        return {
            server: {
                baseDir: Array.prototype.slice.call(arguments),
                middleware: [
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
                tasks: ['<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass','autoprefixer<% } else if (noPreprocessor) { %>concat:css','autoprefixer<% } %>']
            },
            scripts: {
                files: ['<%%= config.app %>/scripts/**/*.js'],
                tasks: ['jshint']
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
                dest: '.tmp/styles/main.css'
            }
        },<% } if (useSass) { %>
        sass: {
            options: {<% if (includeLibSass) { %>
                loadPath: ['bower_components']<% } else { %>
                loadPath: 'bower_components'<% } %>
            },
            all: {
                files: {
                    '.tmp/styles/main.css': '<%%= config.app %>/styles/main.scss'
                }
            }
        },<% } if (noPreprocessor || useSass) { %>
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
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },<% } if (useLess) { %>
        less: {
            dist: {
                options: {
                    paths: [
                        '<%%= config.app %>/styles',
                        'bower_components'
                    ],
                    plugins: [
                        new LessPluginAutoPrefix({browsers: ['> 5%', 'last 2 versions', 'ie 9']})
                    ]
                },
                src: "<%%= config.app %>/styles/main.less",
                dest: ".tmp/styles/main.css"
            }
        },<% } else if (useStylus) { %>
        stylus: {
            compile: {
                files: {
                    '.tmp/styles/main.css': '<%%= config.app %>/styles/main.styl'
                },
                options: {
                    paths: ['bower_components'],
                    'include css':true,
                    use: [
                        require('nib'),
                        function() { return require('autoprefixer-stylus')({
                            browsers: ['> 5%', 'last 2 versions', 'ie 9']
                        }); }
                    ],
                    dest: '.tmp'
                }
            }
        },<% } %>
        cssmin: {
            dist: {
                src: '.tmp/styles/main.css',
                dest: 'web/styles/main.css'
            }
        },<% if (useCritical) { %>

        // Implementation of critical css processing
        // Relevant pages are fetched processed afterwards by the critical task
        // Generated critical path css is stored in 'app/Resources/public/styles/critical'
        // and inlined in the corresponding twig template.
        // See: app/Resources/views/Controller/default/index.html.twig
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
        },

        critical: {
            options: {
                base: '.tmp',
                    minify: true,
                    css: ['.tmp/styles/main.css']
            },
            index: {
                src: '<%%= http.index.dest %>',
                dest: '<%%= config.app %>/styles/critical/index.css'
            }
        },<% } %>

        filerev: {
            dist: {
                src: [
                    '<%%= config.dist %>/img/**/*.{jpg,jpeg,gif,png,webp}',
                    '<%%= config.dist %>/styles/main.css',
                    '<%%= config.dist %>/scripts/main.js'
                ]
            }
        },

        usemin: {
            css: ['<%%= config.dist %>/styles/**/*.css'],
            js: ['<%%= config.dist %>/scripts/**/*.js'],
            html: 'app/Resources/views/**/*.html.twig',
            options: {
                assetsDirs: ['<%%= config.dist %>'],
                patterns: {
                    html: [[
                        /asset\(['"]([^'"]+(?:css|js|jpg|jpeg|gif|png|webp))['"]\)/gm,
                        'Update references to reved assets',
                        function (m) {
                            var matched = _.chain(grunt.config.get('usemin.options.assetsDirs')).reduce(function(dirs,dir){
                                return _.map([
                                    /\.[\w\d]{8}\.(css|js|jpg|jpeg|gif|png|webp)/m,
                                    /\.(?:[\w\d]{8}\.)+(css|js|jpg|jpeg|gif|png|webp)/m
                                ],function(r){
                                    return path.join(dir,m.replace(r,'.$1'));
                                }).concat(dirs);
                            },[]).uniq().intersection(_.keys(grunt.filerev.summary)).first().value();
                            return matched ? grunt.filerev.summary[matched] : m;
                        },

                        function (m) {
                            return m.replace(new RegExp('^(' + grunt.config.get('usemin.options.assetsDirs').join('|') + ')/'),'');
                        }
                    ]]
                }
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
                exclude: ['modernizr', 'requirejs', 'almond'],
                baseUrl: 'bower_components'
            },
            dist: {
                rjsConfig: '<%%= config.app %>/scripts/config.js'
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
            sfcl: 'php app/console cache:clear -e prod'<% if (useJspm && globalJspm) { %>,
            jspm: 'jspm bundle-sfx scripts/main .tmp/scripts/main.js'<% } else if (useJspm && !globalJspm) { %>,
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
        },
        // Server
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        appConfig.app + '/scripts/**/*.js',
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
        }

    });


    grunt.registerTask('serve', function(target) {
        // clean tmp
        grunt.task.run(['clean:tmp']);

        if (target === 'dist') {
            grunt.task.run(['build']);
        } else {
            target = 'dev';
            grunt.task.run(['<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass','autoprefixer<% } else if (noPreprocessor) { %>concat:css','autoprefixer<% } %>']);
        }

        // start php middleware
        grunt.bsMiddleware = getMiddleware(target);

        grunt.task.run([
            'browserSync:'+ target, // Using the php middleware
            'watch'                 // Any other watch tasks you want to run
        ]);
    });
    <% if (useCritical) { %>
    grunt.registerTask('criticalcss',function(){
        grunt.connectMiddleware = getMiddleware();
        grunt.task.run(['connect','http','critical']);
    });
    <% } %>


    grunt.registerTask('css', ['clean:css','<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass','autoprefixer<% } else if (noPreprocessor) { %>concat:css','autoprefixer<% } %>', 'cssmin'<% if (useCritical) { %>, 'criticalcss'<% } %>]);
    grunt.registerTask('js', ['clean:js', 'jshint', '<% if (useRequirejs) { %>bowerRequirejs', 'requirejs<% } else if (useJspm) { %>exec:jspm', 'uglify:dist<% } %>']);
    grunt.registerTask('img', ['clean:img','imagemin','svgmin']);
    grunt.registerTask('rev', ['filerev', 'usemin']);
    grunt.registerTask('assets', ['js', 'css', 'img', 'rev', 'copy','clean:tmp']);
    grunt.registerTask('build', ['assets','exec:sfcl']);
};
