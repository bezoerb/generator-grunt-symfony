'use strict';
/*jshint expr: true*/
var path = require('path');
var helpers = require('yeoman-generator').test;
var _ = require('lodash');
var files = require('./helper/fileHelper');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs-extra');
var exec = require('child_process').exec;


// All params
// continue (true)
// symfonyStandard (true)
// framework (noframework|bootstrap|pure|foundation)
// preprocessor (nopreprocessor|less|sass|stylus)
// libsass (true|false)
// useCritical (true|false)
// loader (requirejs|jspm)
//

function linkDeps() {
    fs.copy(__dirname + '/fixtures/node_modules', __dirname + '/temp/node_modules');
    fs.copy(__dirname + '/fixtures/bower_components', __dirname + '/temp/bower_components');
    fs.copy(__dirname + '/fixtures/vendor', __dirname + '/temp/vendor');
}

function withComposer(cb) {
    if (!cb) {
        cb = function () {
        };
    }
    exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', function () {
        fs.copySync(__dirname + '/temp/app/config/parameters.yml.dist', __dirname + '/temp/app/config/parameters.yml');
        exec('php composer.phar install', function (error, stdout) {
            cb(error, stdout);
        });
    });
}



describe('grunt-symfony generator', function () {

    var defaultOptions = {
        symfonyStandard: true,
        continue: true,
        framework: 'noframework',
        preprocessor: 'nopreprocessor',
        useCritical: false,
        loader: 'requirejs'
    };

    function testConfiguration(config) {
        return function () {
            before(function (done) {
                this.timeout(60000);
                helpers.run(path.join(__dirname, '../app'))
                    .inDir(__dirname + '/temp')
                    .withOptions({'skip-install': true})
                    .withPrompts(_.assign(defaultOptions, config || {}))
                    .on('ready', linkDeps)
                    .on('end', done);
            });

            it('should create files', function (done) {
                helpers.assertFile(files(__dirname + '/temp').addLess().addRequirejs().done());
                done();
            });

            it('should pass jshint', function (done) {
                exec('grunt jshint', function (error, stdout) {
                    expect(stdout).to.contain('Done, without errors.');
                    done();
                });
            });

            it('should build assets', function (done) {
                this.timeout(100000);
                //withComposer(function (error) {
                //    expect(error).to.be.null;
                    exec('grunt assets', function (error, stdout) {
                        expect(stdout).to.contain('Done, without errors.');
                        done();
                    });
                //});

            });
        };
    }

    describe('running app with requirejs and without preprocessor,framework ', testConfiguration());
    describe('running app with requirejs, less and without framework ', testConfiguration({preprocessor:'less'}));
    describe('running app with requirejs, sass (ruby) and without framework ', testConfiguration({preprocessor:'sass',libsass: false}));
    describe('running app with requirejs, sass (node) and without framework ', testConfiguration({preprocessor:'sass',libsass: true}));
    describe('running app with requirejs, stylus and without framework ', testConfiguration({preprocessor:'stylus'}));

    describe('running app with requirejs, uikit and without preprocessor ', testConfiguration());
    describe('running app with requirejs, less and uikit ', testConfiguration({preprocessor:'less', framework:'uikit'}));
    describe('running app with requirejs, sass (ruby) and uikit ', testConfiguration({preprocessor:'sass',libsass: false, framework:'uikit'}));
    describe('running app with requirejs, sass (node) and uikit ', testConfiguration({preprocessor:'sass',libsass: true, framework:'uikit'}));
    describe('running app with requirejs, stylus and uikit ', testConfiguration({preprocessor:'stylus', framework:'uikit'}));

    describe('running app with requirejs, bootstrap and without preprocessor ', testConfiguration());
    describe('running app with requirejs, less and bootstrap ', testConfiguration({preprocessor:'less', framework:'bootstrap'}));
    describe('running app with requirejs, sass (ruby) and bootstrap ', testConfiguration({preprocessor:'sass',libsass: false, framework:'bootstrap'}));
    describe('running app with requirejs, sass (node) and bootstrap ', testConfiguration({preprocessor:'sass',libsass: true, framework:'bootstrap'}));
    describe('running app with requirejs, stylus and bootstrap ', testConfiguration({preprocessor:'stylus', framework:'bootstrap'}));

    describe('running app with requirejs, foundation and without preprocessor ', testConfiguration());
    describe('running app with requirejs, less and foundation ', testConfiguration({preprocessor:'less', framework:'foundation'}));
    describe('running app with requirejs, sass (ruby) and foundation ', testConfiguration({preprocessor:'sass',libsass: false, framework:'foundation'}));
    describe('running app with requirejs, sass (node) and foundation ', testConfiguration({preprocessor:'sass',libsass: true, framework:'foundation'}));
    describe('running app with requirejs, stylus and foundation ', testConfiguration({preprocessor:'stylus', framework:'foundation'}));

    describe('running app with requirejs, pure and without preprocessor ', testConfiguration());
    describe('running app with requirejs, less and pure ', testConfiguration({preprocessor:'less', framework:'pure'}));
    describe('running app with requirejs, sass (ruby) and pure ', testConfiguration({preprocessor:'sass',libsass: false, framework:'pure'}));
    describe('running app with requirejs, sass (node) and pure ', testConfiguration({preprocessor:'sass',libsass: true, framework:'pure'}));
    describe('running app with requirejs, stylus and pure ', testConfiguration({preprocessor:'stylus', framework:'pure'}));



});
