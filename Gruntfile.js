'use strict';
var shell = require('shelljs');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var path = require('path');

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
            test: ['test/fixtures/node_modules','test/fixtures/bower_components','test/fixtures/jspm_packages']
        },
        simplemocha: {
            all: ['test/*.js'],
            options: {
                reporter: 'spec',
                timeout: 100000,
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



    grunt.registerTask('installFixtures', 'install package and bower fixtures', function () {
        var done = this.async();

        shell.cd('test/fixtures');
        grunt.log.ok('installing jspm dependencies for generated app');

        exec('node node_modules/.bin/jspm install', {cwd: '../fixtures'}, function (err) {
            if (err) {
                grunt.log.error(err.message || err);
            }
            grunt.log.ok('installing bower dependencies for generated app');
            exec('bower install', {cwd: '../fixtures'}, function () {
                grunt.log.ok('installing npm dependencies for generated app');
                exec('npm install', {cwd: '../fixtures'}, function () {

                    shell.cd('../../');
                    done();
                });
            });
        }).stdout.pipe(process.stdout);
    });

    grunt.registerTask('test', ['clean:test','updateFixtures','installFixtures','simplemocha']);
};
