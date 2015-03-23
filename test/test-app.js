'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
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
    fs.symlinkSync(__dirname + '/fixtures/node_modules', __dirname + '/temp/node_modules');
    fs.symlinkSync(__dirname + '/fixtures/bower_components', __dirname + '/temp/bower_components');
    fs.symlinkSync(__dirname + '/fixtures/vendor', __dirname + '/temp/vendor');
    fs.copySync(__dirname + '/temp/app/config/parameters.yml.dist',__dirname + '/temp/app/config/parameters.yml');
}

function withComposer(cb) {
    if (!cb) {
        cb = function(){};
    }
    exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', function (error, stdout) {
        exec('php composer.phar install', function (error, stdout) {
            cb(error,stdout);
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

    describe('running app with default options', function () {

        before(function (done) {
            this.timeout(60000);
            helpers.run(path.join(__dirname, '../app'))
                .inDir(__dirname + '/temp')
                .withOptions({'skip-install': true})
                .withPrompts(defaultOptions)
                .on('ready', linkDeps)
                .on('end', done);
        });

        it('should create files', function (done) {
            helpers.assertFile(files(__dirname + '/temp').done());
            done();
        });

        it('should pass jshint', function (done) {
            exec('grunt jshint', function (error, stdout) {
                expect(stdout).to.contain('Done, without errors.');
                done();
            });
        });

        it('should build assets', function (done) {
            this.timeout(60000);
            withComposer(function(error){
                expect(error).to.be.null;
                exec('grunt assets', function (error, stdout) {
                    expect(stdout).to.contain('Done, without errors.');
                    done();
                });
            });

        });

    });

    //describe('no framework no preprocessor', function(){
    //
    //
    //    before(function (done) {
    //        helpers.run(path.join(__dirname, '../app'))
    //            .inDir(path.join(os.tmpdir(), './temp-test'))
    //            .withOptions({'skip-install': true})
    //            .withPrompts({
    //                symfonyStandard: true,
    //                continue: true,
    //                framework: 'noframework',
    //                preprocessor: 'nopreprocessor',
    //                useCritical: false,
    //                loader: 'requirejs'
    //            }).on('end', done);
    //    });
    //
    //    it('creates files', function () {
    //        assert.file(files().addNop().addRequirejs().done());
    //    });
    //
    //});
    //
    //describe('no framework less', function(){
    //
    //    before(function (done) {
    //        helpers.run(path.join(__dirname, '../app'))
    //            .inDir(path.join(os.tmpdir(), './temp-test'))
    //            .withOptions({'skip-install': true})
    //            .withPrompts({
    //                symfonyStandard: true,
    //                continue: true,
    //                framework: 'noframework',
    //                preprocessor: 'nopreprocessor',
    //                useCritical: false,
    //                loader: 'requirejs'
    //            }).on('end', done);
    //    });
    //
    //    it('creates files', function () {
    //        assert.file(files().addLess().addRequirejs().done());
    //    });
    //});
    //
    //describe('no framework sass', function(){
    //
    //    before(function (done) {
    //        helpers.run(path.join(__dirname, '../app'))
    //            .inDir(path.join(os.tmpdir(), './temp-test'))
    //            .withOptions({'skip-install': true})
    //            .withPrompts({
    //                symfonyStandard: true,
    //                continue: true,
    //                framework: 'noframework',
    //                preprocessor: 'nopreprocessor',
    //                useCritical: false,
    //                loader: 'requirejs'
    //            }).on('end', done);
    //    });
    //
    //    it('creates files', function () {
    //        assert.file(files().addSass().addRequirejs().done());
    //    });
    //});
    //
    //describe('no framework stylus', function(){
    //
    //    before(function (done) {
    //        helpers.run(path.join(__dirname, '../app'))
    //            .inDir(path.join(os.tmpdir(), './temp-test'))
    //            .withOptions({'skip-install': true})
    //            .withPrompts({
    //                symfonyStandard: true,
    //                continue: true,
    //                framework: 'noframework',
    //                preprocessor: 'nopreprocessor',
    //                useCritical: false,
    //                loader: 'requirejs'
    //            }).on('end', done);
    //    });
    //
    //    it('creates files', function () {
    //        assert.file(files().addStylus().addRequirejs().done());
    //    });
    //});


});
