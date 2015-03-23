'use strict';
var shell = require('shelljs');
var process = require('child_process');
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
        simplemocha: {
            all: ['test/*.js'],
            options: {
                reporter: 'spec',
                ui: 'bdd'
            }
        }
    });

    grunt.registerTask('updateFixtures', 'updates package and bower fixtures', function () {
        var done = this.async();
        var packageJson = fs.readFileSync(path.resolve('app/templates/_package.json'), 'utf8');
        var bowerJson = fs.readFileSync(path.resolve('app/templates/_bower.json'), 'utf8');

        // replace package name
        packageJson = packageJson.replace(/"name": "<%(.*)%>"/g, '"name": "tempApp"');
        packageJson = packageJson.replace(/<%(.*)%>/g, '');

        // remove all ejs conditionals
        bowerJson = bowerJson.replace(/"name": "<%(.*)%>"/g, '"name": "tempApp"');
        bowerJson = bowerJson.replace(/<%(.*)%>/g, '');

        // save files
        fs.writeFile(path.resolve(__dirname + '/test/fixtures/package.json'), packageJson, function () {
            fs.writeFile(path.resolve(__dirname + '/test/fixtures/bower.json'), bowerJson, function () {
                done();
            });
        });
    });


    grunt.registerTask('installFixtures', 'install package and bower fixtures', function () {
        var done = this.async();

        shell.cd('test/fixtures');
        grunt.log.ok('installing npm dependencies for generated app');
        process.exec('npm install --quiet', {cwd: '../fixtures'}, function () {

            grunt.log.ok('installing bower dependencies for generated app');
            process.exec('bower install --quiet', {cwd: '../fixtures'}, function () {

                grunt.log.ok('installing composer dependencies for generated app');
                process.exec('composer install --quiet', {cwd: '../fixtures'}, function () {
                    shell.cd('../../');
                    done();
                });
            });
        });
    });

    grunt.registerTask('test', ['updateFixtures','installFixtures','simplemocha'
    ]);
};
