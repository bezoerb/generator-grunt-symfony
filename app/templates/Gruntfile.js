// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
module.exports = function(grunt) {
    require('jit-grunt')(grunt);
    var phpMiddleware;
    <% if (useLess) { %>
    var LessPluginAutoPrefix = require('less-plugin-autoprefix');<% } %>
    var parseurl = require('parseurl');
    var path = require('path');
    var php = require('php-proxy-middleware');


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
                        if (!/\.\w{2,4}$/.test(obj.pathname) || /\.php/.test(obj.pathname)) {
                            phpMiddleware(req, res, next);
                        } else {
                            next();
                        }
                    }
                ]
            },
            port: 8000,
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
                    'bower_components/bootstrap/dist/css/bootstrap.css',<% } else { %>
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
                includePaths: ['bower_components']<% } else { %>
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
        },
        // revert rev before revving to prevent revrev
        replace: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/Resources/views/',
                    src: '**/*.html.twig',
                    dest: 'app/Resources/views/'
                }],
                options: {
                    replacements: [{
                        match: /\.[\w\d]{8}\.(css|js|jpg|jpeg|gif|png|webp)/,
                        replacement: '.$1'
                    }]
                }
            }
        },
        filerev: {
            dist: {
                src: [
                    'web/img/**/*.{jpg,jpeg,gif,png,webp}',
                    'web/styles/main.css',
                    'web/scripts/main.js'
                ]
            }
        },

        usemin: {
            css: ['web/styles/**/*.css'],
            js: ['web/scripts/**/*.js'],
            html: 'app/Resources/views/**/*.html.twig',
            options: {
                assetsDirs: ['web']
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
            grunt.task.run(['assets']);

            // Set env to prod in symfony
            process.env['SYMFONY_ENV'] = 'prod';
            process.env['SYMFONY_DEBUG'] = 0;
        } else {
            target = 'dev';
            grunt.task.run(['<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass','autoprefixer<% } else if (noPreprocessor) { %>concat:css','autoprefixer<% } %>']);

            // Set env to node in symfony for browsersync webserver
            process.env['SYMFONY_ENV'] = 'node';
            process.env['SYMFONY_DEBUG'] = 1;
        }

        // start php middleware
        phpMiddleware = php({
            address: '127.0.0.1', // which interface to bind to
            ini: {max_execution_time: 60, variables_order:'EGPCS'},
            root: appConfig.dist,
            router: path.join(appConfig.dist, 'app.php')
        });

        grunt.task.run([
            'browserSync:'+ target, // Using the php middleware
            'watch'                 // Any other watch tasks you want to run
        ]);
    });

    grunt.registerTask('css', ['clean:css','<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass','autoprefixer<% } else if (noPreprocessor) { %>concat:css','autoprefixer<% } %>', 'cssmin']);
    grunt.registerTask('js', ['clean:js', 'jshint', '<% if (useRequirejs) { %>bowerRequirejs', 'requirejs<% } else if (useJspm) { %>exec:jspm', 'uglify:dist<% } %>']);
    grunt.registerTask('img', ['clean:img','imagemin','svgmin']);
    grunt.registerTask('rev', ['replace', 'filerev', 'usemin']);
    grunt.registerTask('assets', ['js', 'css', 'img', 'rev', 'copy','exec:sfcl']);
    grunt.registerTask('build', ['assets','clean:tmp']);
};
