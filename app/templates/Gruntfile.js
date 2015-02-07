// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    var LessPluginAutoPrefix = require('less-plugin-autoprefix');
    var parseurl = require('parseurl');
    var path = require('path');
    var php = require('php-proxy-middleware');


    var appConfig = {
        app: 'app/Resources/public',
        dist: 'web'
    };

    var phpMiddleware = php({
        address: '127.0.0.1', // which interface to bind to
        ini: {max_execution_time: 60, variables_order: 'EGPCS'},
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
         */
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
                dest: ".tmp/styles/all.css"
            }
        },
        cssmin: {
            dist: {
                src: '<%%= less.dist.dest %>',
                dest: 'web/styles/all.css'
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
                        pattern: /\/all\.[\w\d]+\.css/,
                        replacement: '/all.css'
                    }, {
                        pattern: /\/all\.[\w\d]+\.js/,
                        replacement: '/all.js'
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
                files: ['<%%= config.app %>/styles/{,*/}*.less'],
                tasks: ['less']
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
        },
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
                    out: '<%%= config.dist %>/scripts/all.js',
                    mainConfigFile: '<%%= config.app %>/scripts/config.js',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true,
                    optimize: 'uglify2',
                    generateSourceMaps: true
                }
            }
        },

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
                            function (req, res, next) {
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
        'browserSync:dist', // Using the php middleware
        'watch'             // Any other watch tasks you want to run
    ]);

    grunt.registerTask('css', ['clean:css', 'less', 'cssmin']);
    grunt.registerTask('js', ['clean:js', 'jshint', 'bowerRequirejs', 'requirejs']);
    grunt.registerTask('rev', ['string-replace', 'filerev', 'usemin']);

    grunt.registerTask('assets', ['js', 'css', 'rev', 'exec:sfcl']);

    grunt.registerTask('build', ['assets', 'exec:sfcl']);


};
