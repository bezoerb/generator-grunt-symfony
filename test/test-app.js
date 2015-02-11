'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var files = require('./helper/fileHelper');

// All params
// continue (true)
// symfonyStandard (true)
// framework (noframework|bootstrap|pure|foundation)
// preprocessor (nopreprocessor|less|sass|stylus)
// libsass (true|false)
// loader (requirejs|jspm)
//


describe('grunt-symfony:app', function () {

    describe('no framework no preprocessor', function(){

        before(function (done) {
            helpers.run(path.join(__dirname, '../app'))
                .inDir(path.join(os.tmpdir(), './temp-test'))
                .withOptions({'skip-install': true})
                .withPrompts({
                    symfonyStandard: true,
                    continue: true,
                    framework: 'noframework',
                    preprocessor: 'nopreprocessor',
                    loader: 'requirejs'
                }).on('end', done);
        });

        it('creates files', function () {
            assert.file(files().addNop().addRequirejs().done());
        });
    });

    describe('no framework less', function(){

        before(function (done) {
            helpers.run(path.join(__dirname, '../app'))
                .inDir(path.join(os.tmpdir(), './temp-test'))
                .withOptions({'skip-install': true})
                .withPrompts({
                    symfonyStandard: true,
                    continue: true,
                    framework: 'noframework',
                    preprocessor: 'nopreprocessor',
                    loader: 'requirejs'
                }).on('end', done);
        });

        it('creates files', function () {
            assert.file(files().addLess().addRequirejs().done());
        });
    });

    describe('no framework sass', function(){

        before(function (done) {
            helpers.run(path.join(__dirname, '../app'))
                .inDir(path.join(os.tmpdir(), './temp-test'))
                .withOptions({'skip-install': true})
                .withPrompts({
                    symfonyStandard: true,
                    continue: true,
                    framework: 'noframework',
                    preprocessor: 'nopreprocessor',
                    loader: 'requirejs'
                }).on('end', done);
        });

        it('creates files', function () {
            assert.file(files().addSass().addRequirejs().done());
        });
    });

    describe('no framework stylus', function(){

        before(function (done) {
            helpers.run(path.join(__dirname, '../app'))
                .inDir(path.join(os.tmpdir(), './temp-test'))
                .withOptions({'skip-install': true})
                .withPrompts({
                    symfonyStandard: true,
                    continue: true,
                    framework: 'noframework',
                    preprocessor: 'nopreprocessor',
                    loader: 'requirejs'
                }).on('end', done);
        });

        it('creates files', function () {
            assert.file(files().addStylus().addRequirejs().done());
        });
    });
});
