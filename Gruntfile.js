'use strict';
var shell = require('shelljs');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var path = require('path');
var debug = require('debug')('yeoman:generator-grunt-symfony');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                'Gruntfile.js',
                'app/index.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },
        clean: {
            test: [
                'test/fixtures/node_modules',
                'test/fixtures/bower_components',
                'test/fixtures/jspm_packages',
                'test/fixtures/composer.phar',
                'test/fixtures/app/bootstrap.php.cache',
                'test/fixtures/app/check.php',
                'test/fixtures/app/SymfonyRequirements.php',
                'test/fixtures/vendor'
            ]
        },
        simplemocha: {
            all: ['test/*.js'],
            options: {
                reporter: 'spec',
                timeout: 600000,
                ui: 'bdd'
            }
        }
    });

    grunt.registerTask('updateFixtures', 'updates package and bower fixtures', function () {
        var done = this.async();
        var packageJson = fs.readFileSync(path.resolve('app/templates/_package.json'), 'utf8');
        var bowerJson = fs.readFileSync(path.resolve('app/templates/_bower.json'), 'utf8');
        var jspmConfig = fs.readFileSync(path.resolve('app/templates/scripts/jspm/config.js'), 'utf8');

        // remove all ejs conditionals
        packageJson = packageJson.replace(/"name": "<%(.*)%>"/g, '"name": "tempApp"');
        packageJson = packageJson.replace(/<%(.*)%>/g, '');

        bowerJson = bowerJson.replace(/"name": "<%(.*)%>"/g, '"name": "tempApp"');
        bowerJson = bowerJson.replace(/<%(.*)%>/g, '');

        jspmConfig = jspmConfig.replace(/<%(.*)%>/g, '');

        // save files
        fs.outputFile(path.resolve(__dirname + '/test/fixtures/package.json'), packageJson, function () {
            fs.outputFile(path.resolve(__dirname + '/test/fixtures/bower.json'), bowerJson, function () {
                fs.outputFile(path.resolve(__dirname + '/test/fixtures/app/Resources/public/scripts/config.js'), jspmConfig, function () {
                    done();
                });
            });
        });
    });


    grunt.registerTask('installNpmFixtures', 'install npm packages', function () {
        var done = this.async();

        shell.cd('test/fixtures');
        grunt.log.ok('installing npm dependencies for generated app');
        exec('npm install', {cwd: '../fixtures'}, function () {
            shell.cd('../../');
            done();
        }).stdout.on('data', function(data) {
            console.log(data);
        });
    });

    grunt.registerTask('installBowerFixtures', 'install bower packages', function () {
        var done = this.async();

        shell.cd('test/fixtures');
        grunt.log.ok('installing bower dependencies for generated app');
        exec('bower install', {cwd: '../fixtures'}, function () {
            shell.cd('../../');
            done();
        }).stdout.on('data', function(data) {
            console.log(data);
        });
    });

    grunt.registerTask('installJspmFixtures', 'install jspm packages', function () {
        var done = this.async();

        shell.cd('test/fixtures');
        grunt.log.ok('installing jspm dependencies for generated app');
        exec('npm install --save jspm', {cwd: '../fixtures'}, function () {
            exec('node_modules/.bin/jspm install', {cwd: '../fixtures'}, function () {
                shell.cd('../../');
                done();
            }).stdout.on('data', function(data) {
                console.log(data);
            });
        }).stdout.on('data', function(data) {
            console.log(data);
        });
    });

    grunt.registerTask('installComposerFixtures', 'install Composer fixtures', function () {
        var done = this.async();

        shell.cd('test/fixtures');
        grunt.log.ok('fetching local composer');
        exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', function() {
            grunt.log.ok('installing composer dependencies for generated app');
            exec('php composer.phar update --prefer-source --no-interaction --dev ', {cwd: '../fixtures'}, function (error, stdout, stderr) {
                debug('stdout: jspm config -> ', stdout);
                debug('stderr: jspm config -> ', stderr);

                if (error) {
                    debug('stderr: jspm config -> ', stderr);
                }
                exec('php composer.phar run-script post-update-cmd --no-interaction ', {cwd: '../fixtures'}, function (error, stdout, stderr) {
                    debug('stdout: jspm config -> ', stdout);
                    debug('stderr: jspm config -> ', stderr);

                    if (error) {
                        debug('stderr: jspm config -> ', stderr);
                    }
                    shell.cd('../../');
                    done();
                }).stdout.on('data', function(data) {
                    console.log(data);
                });
            }).stdout.on('data', function(data) {
                console.log(data);
            });
        }).stdout.on('data', function(data) {
            console.log(data);
        });


    });


    grunt.registerTask('installFixtures', 'install package and bower fixtures', function () {
        var done = this.async();

        shell.cd('test/fixtures');
        grunt.log.ok('installing jspm dependencies for generated app');

        exec('jspm install', {cwd: '../fixtures'}, function (err) {
            if (err) {
                grunt.log.error(err.message || err);
            }
            grunt.log.ok('installing bower dependencies for generated app');
            exec('bower install', {cwd: '../fixtures'}, function () {
                grunt.log.ok('installing npm dependencies for generated app');
                exec('npm install', {cwd: '../fixtures'}, function () {

                    grunt.log.ok('installing comnposer dependencies for generated app');
                    exec('composer install --no-interaction', {cwd: '../fixtures'}, function () {

                        shell.cd('../../');
                        done();
                    });
                });
            });
        });
    });

    grunt.registerTask('test', [
        'clean:test',
        'updateFixtures',
        'installJspmFixtures',
        'installNpmFixtures',
        'installBowerFixtures',
        'installComposerFixtures',
        'simplemocha'
    ]);
};
