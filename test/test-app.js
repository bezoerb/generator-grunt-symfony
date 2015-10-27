'use strict';
/*jshint expr: true*/
var testPrompts = require('./helper/testHelper').testPrompts;
var _ = require('lodash');
var files = require('./helper/fileHelper');
var fixtureHelper = require('./helper/fixturesHelper');
var withComposer = fixtureHelper.withComposer;
var withJspm = fixtureHelper.withJspm;
var chai = require('chai');
var expect = chai.expect;
var exec = require('child_process').exec;





describe('grunt-symfony generator', function () {
    this.timeout(100000);

    var tests = [
        {loader: 'jspm'},
        {loader: 'jspm', preprocessor: 'less'},
        {loader: 'jspm', preprocessor: 'sass'}
    ];

    tests.forEach(function(test) {
        it('test passed', function (done) {
            testPrompts(test, done);
        });
    });


    //describe('running app with load-grunt-config, jspm, less and without framework ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'less'
    //}));
    //describe('running app with load-grunt-config, jspm, sass (ruby) and without framework ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'sass',
    //    libsass: false
    //}));
    //describe('running app with load-grunt-config, jspm, sass (node) and without framework ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'sass',
    //    libsass: true
    //}));
    //describe('running app with load-grunt-config, jspm, stylus and without framework ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'stylus'
    //}));
    //
    //describe('running app with load-grunt-config, jspm, uikit and without preprocessor ', testConfiguration({
    //    loader: 'jspm'
    //}));
    //describe('running app with load-grunt-config, jspm, less and uikit ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'less',
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, jspm, sass (ruby) and uikit ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, jspm, sass (node) and uikit ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, jspm, stylus and uikit ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'stylus',
    //    framework: 'uikit'
    //}));
    //
    //describe('running app with load-grunt-config, jspm, bootstrap and without preprocessor ', testConfiguration({
    //    loader: 'jspm'
    //}));
    //describe('running app with load-grunt-config, jspm, less and bootstrap ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'less',
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, jspm, sass (ruby) and bootstrap ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, jspm, sass (node) and bootstrap ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, jspm, stylus and bootstrap ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'stylus',
    //    framework: 'bootstrap'
    //}));
    //
    //describe('running app with load-grunt-config, jspm, foundation and without preprocessor ', testConfiguration({
    //    loader: 'jspm'
    //}));
    //describe('running app with load-grunt-config, jspm, less and foundation ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'less',
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, jspm, sass (ruby) and foundation ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, jspm, sass (node) and foundation ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, jspm, stylus and foundation ', testConfiguration({
    //    loader: 'jspm',
    //    preprocessor: 'stylus',
    //    framework: 'foundation'
    //}));
    //
    //
    //describe('running app with load-grunt-config, webpack and without preprocessor,framework ', testConfiguration({
    //    loader: 'webpack'
    //}));
    it('test passed', function (done) {
        testPrompts({loader: 'webpack'}, done);
    });
    //describe('running app with load-grunt-config, webpack, less and without framework ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'less'
    //}));
    //describe('running app with load-grunt-config, webpack, sass (ruby) and without framework ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'sass',
    //    libsass: false
    //}));
    //describe('running app with load-grunt-config, webpack, sass (node) and without framework ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'sass',
    //    libsass: true
    //}));
    //describe('running app with load-grunt-config, webpack, stylus and without framework ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'stylus'
    //}));
    //
    //describe('running app with load-grunt-config, webpack, uikit and without preprocessor ', testConfiguration({
    //    loader: 'webpack'
    //}));
    //describe('running app with load-grunt-config, webpack, less and uikit ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'less',
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, webpack, sass (ruby) and uikit ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, webpack, sass (node) and uikit ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, webpack, stylus and uikit ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'stylus',
    //    framework: 'uikit'
    //}));
    //
    //describe('running app with load-grunt-config, webpack, bootstrap and without preprocessor ', testConfiguration({
    //    loader: 'webpack'
    //}));
    //describe('running app with load-grunt-config, webpack, less and bootstrap ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'less',
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, webpack, sass (ruby) and bootstrap ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, webpack, sass (node) and bootstrap ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, webpack, stylus and bootstrap ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'stylus',
    //    framework: 'bootstrap'
    //}));
    //
    //describe('running app with load-grunt-config, webpack, foundation and without preprocessor ', testConfiguration({
    //    loader: 'webpack'
    //}));
    //describe('running app with load-grunt-config, webpack, less and foundation ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'less',
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, webpack, sass (ruby) and foundation ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, webpack, sass (node) and foundation ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, webpack, stylus and foundation ', testConfiguration({
    //    loader: 'webpack',
    //    preprocessor: 'stylus',
    //    framework: 'foundation'
    //}));
    //
    //
    //describe('running app with load-grunt-config, requirejs and without preprocessor,framework ', testConfiguration({
    //    loadGruntConfig: true
    //}));
    //describe('running app with load-grunt-config, requirejs, less and without framework ', testConfiguration({
    //    preprocessor: 'less'
    //}));
    //describe('running app with load-grunt-config, requirejs, sass (ruby) and without framework ', testConfiguration({
    //    preprocessor: 'sass',
    //    libsass: false
    //}));
    //describe('running app with load-grunt-config, requirejs, sass (node) and without framework ', testConfiguration({
    //    preprocessor: 'sass',
    //    libsass: true
    //}));
    //describe('running app with load-grunt-config, requirejs, stylus and without framework ', testConfiguration({
    //    preprocessor: 'stylus'
    //}));
    //
    //describe('running app with load-grunt-config, requirejs, uikit and without preprocessor ', testConfiguration({
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, requirejs, less and uikit ', testConfiguration({
    //    preprocessor: 'less',
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, requirejs, sass (ruby) and uikit ', testConfiguration({
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, requirejs, sass (node) and uikit ', testConfiguration({
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'uikit'
    //}));
    //describe('running app with load-grunt-config, requirejs, stylus and uikit ', testConfiguration({
    //    preprocessor: 'stylus',
    //    framework: 'uikit'
    //}));
    //
    //describe('running app with load-grunt-config, requirejs, bootstrap and without preprocessor ', testConfiguration({
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, requirejs, less and bootstrap ', testConfiguration({
    //    preprocessor: 'less',
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, requirejs, sass (ruby) and bootstrap ', testConfiguration({
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, requirejs, sass (node) and bootstrap ', testConfiguration({
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'bootstrap'
    //}));
    //describe('running app with load-grunt-config, requirejs, stylus and bootstrap ', testConfiguration({
    //    preprocessor: 'stylus',
    //    framework: 'bootstrap'
    //}));
    //
    //describe('running app with load-grunt-config, requirejs, foundation and without preprocessor ', testConfiguration({
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, requirejs, less and foundation ', testConfiguration({
    //    preprocessor: 'less',
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, requirejs, sass (ruby) and foundation ', testConfiguration({
    //    preprocessor: 'sass',
    //    libsass: false,
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, requirejs, sass (node) and foundation ', testConfiguration({
    //    preprocessor: 'sass',
    //    libsass: true,
    //    framework: 'foundation'
    //}));
    //describe('running app with load-grunt-config, requirejs, stylus and foundation ', testConfiguration({
    //    preprocessor: 'stylus',
    //    framework: 'foundation'
    //}));
});
