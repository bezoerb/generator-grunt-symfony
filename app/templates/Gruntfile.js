// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
module.exports = function(grunt) {
    require('jit-grunt')(grunt);
    <% if (useLess) { %>
    var LessPluginAutoPrefix = require('less-plugin-autoprefix');<% } %>
    var parseurl = require('parseurl');
    var path = require('path');
    var php = require('php-proxy-middleware');


    var appConfig = {
        app: 'app/Resources/public',
        dist: 'web'
    };

    var phpMiddleware = php({
        address: '0.0.0.0', // which interface to bind to
        ini: {max_execution_time: 60, error_log: '...'},
        root: appConfig.dist,
        router: path.join(appConfig.dist, 'app_dev.php')
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: appConfig,
        clean: {
            css: ['web/styles'],
            js: ['web/scripts']
        },

        exec: {
            sfcl: 'php app/console cache:clear -e prod'
        },

        /**
         * CSS
         */<% if (useSass) { %>
        sass: {
            options: {
                includePaths: ['bower_components']
            },
            all: {
                files: {
                    '.tmp/styles/main.css': '<%%= config.app %>/styles/main.scss'
                }
            }
        },
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
        },<% } else if (useLess) { %>
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
                    use: [
                        require('nib'),      //  that is compiled. These might be findable based on values you gave
                        function() { return require('autoprefixer-stylus')({
                            browsers: ['> 5%', 'last 2 versions', 'ie 9']
                        }); }
                    ],
                    dest: '.tmp' // Grunt ignores this, but it's required to produce the
                    // correct relative paths, see stylus issue #1669
                }
            }
        },<% } %>
        cssmin: {
            dist: {
                src: '.tmp/styles/main.css',
                dest: 'web/styles/main.css'
            }
        },

        'string-replace': {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/Resources/views/',
                    src: '**/*.html.twig',
                    dest: 'app/Resources/views/'
                }],
                options: {
                    replacements: [{
                        pattern: /\/main\.[\w\d]+\.css/,
                        replacement: '/main.css'
                    },{
                        pattern: /\/main\.[\w\d]+\.js/,
                        replacement: '/main.js'
                    }]
                }
            }
        },

        filerev: {
            dist: {
                src: [
                    'web/img/**/*.{jpg,jpeg,gif,png,webp}',
                    'web/styles/*.css',
                    'web/scripts/*.js'
                ]
            }
        },

        usemin: {
            css: ['web/styles/**/*.css'],
            js: ['web/scripts/**/*.js'],
            html: 'app/Resources/views/base.html.twig',
            options: {
                assetsDirs: ['web']
            }
        },

        watch: {
            styles: {
                files: ['<%%= config.app %>/styles/{,*/}*.<% if (useLess) { %>less<% } else if (useStylus) { %>styl<% } else if (useSass) { %>{scss,sass}<% } %>'],
                tasks: ['<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass','autoprefixer<% } %>']
            },
            scripts: {
                files: ['<%%= config.app %>/scripts/**/*.js'],
                tasks: ['jshint']
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
                    include: 'config',
                    out: '<%%= config.dist %>/scripts/main.js',
                    mainConfigFile: '<%%= config.app %>/scripts/config.js',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    optimize: 'uglify2',
                    generateSourceMaps: true
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

        // Server
        browserSync: {
            dist: {
                bsFiles: {
                    src: [
                        appConfig.app + '/scripts/**/*.js',
                        appConfig.app + '/images/**/*.{jpg,jpeg,gif,png,webp}',
                        'app/Resources/views/**/*.html.twig',
                        '.tmp/styles/*.css'
                    ]
                },
                options: {
                    server: {
                        baseDir: ['.tmp', appConfig.app, './', appConfig.dist],
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
                }
            }
        }

    });

    grunt.registerTask('serve', [
        '<% if (useLess) { %>less<% } else if (useStylus) { %>stylus<% } else if (useSass) { %>sass','autoprefixer<% } %>',
        'browserSync:dist', // Using the php middleware
        'watch'             // Any other watch tasks you want to run
    ]);

    grunt.registerTask('css', ['clean:css', 'less', 'cssmin']);
    grunt.registerTask('js', ['clean:js', 'jshint', 'bowerRequirejs', 'requirejs']);
    grunt.registerTask('rev', ['string-replace', 'filerev', 'usemin']);

    grunt.registerTask('assets', ['js', 'css', 'rev', 'exec:sfcl']);

    grunt.registerTask('build', ['assets', 'exec:sfcl']);




};
