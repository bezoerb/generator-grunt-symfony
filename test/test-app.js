'use strict';
/*jshint expr: true*/
var testPrompts = require('./helper/testHelper').testPrompts;


describe('grunt-symfony generator', function () {
    this.timeout(300000);

    var tests = [
        // jspm no framework
        {loader: 'jspm'},
        {loader: 'jspm', preprocessor: 'less'},
        {loader: 'jspm', preprocessor: 'sass', libsass: false},
        {loader: 'jspm', preprocessor: 'sass', libsass: true},
        {loader: 'jspm', preprocessor: 'stylus'},
        // jspm uikit
        {loader: 'jspm', framework: 'uikit'},
        {loader: 'jspm', framework: 'uikit', preprocessor: 'less'},
        {loader: 'jspm', framework: 'uikit', preprocessor: 'sass', libsass: false},
        {loader: 'jspm', framework: 'uikit', preprocessor: 'sass', libsass: true},
        {loader: 'jspm', framework: 'uikit', preprocessor: 'stylus'},
        // jspm bootstrap
        {loader: 'jspm', framework: 'bootstrap'},
        {loader: 'jspm', framework: 'bootstrap', preprocessor: 'less'},
            {loader: 'jspm', framework: 'bootstrap', preprocessor: 'sass', libsass: false},
        {loader: 'jspm', framework: 'bootstrap', preprocessor: 'sass', libsass: true},
        {loader: 'jspm', framework: 'bootstrap', preprocessor: 'stylus'},
        // jspm foundation
        {loader: 'jspm', framework: 'foundation'},
        {loader: 'jspm', framework: 'foundation', preprocessor: 'less'},
        {loader: 'jspm', framework: 'foundation', preprocessor: 'sass', libsass: false},
        {loader: 'jspm', framework: 'foundation', preprocessor: 'sass', libsass: true},
        {loader: 'jspm', framework: 'foundation', preprocessor: 'stylus'},

        // webpack no framework
        {loader: 'webpack'},
        {loader: 'webpack', preprocessor: 'less'},
        {loader: 'webpack', preprocessor: 'sass', libsass: false},
        {loader: 'webpack', preprocessor: 'sass', libsass: true},
        {loader: 'webpack', preprocessor: 'stylus'},
        // webpack uikit
        {loader: 'webpack', framework: 'uikit'},
        {loader: 'webpack', framework: 'uikit', preprocessor: 'less'},
        {loader: 'webpack', framework: 'uikit', preprocessor: 'sass', libsass: false},
        {loader: 'webpack', framework: 'uikit', preprocessor: 'sass', libsass: true},
        {loader: 'webpack', framework: 'uikit', preprocessor: 'stylus'},
        // webpack bootstrap
        {loader: 'webpack', framework: 'bootstrap'},
        {loader: 'webpack', framework: 'bootstrap', preprocessor: 'less'},
        {loader: 'webpack', framework: 'bootstrap', preprocessor: 'sass', libsass: false},
        {loader: 'webpack', framework: 'bootstrap', preprocessor: 'sass', libsass: true},
        {loader: 'webpack', framework: 'bootstrap', preprocessor: 'stylus'},
        // webpack foundation
        {loader: 'webpack', framework: 'foundation'},
        {loader: 'webpack', framework: 'foundation', preprocessor: 'less'},
        {loader: 'webpack', framework: 'foundation', preprocessor: 'sass', libsass: false},
        {loader: 'webpack', framework: 'foundation', preprocessor: 'sass', libsass: true},
        {loader: 'webpack', framework: 'foundation', preprocessor: 'stylus'},

        // requirejs no framework
        {loader: 'requirejs'},
        {loader: 'requirejs', preprocessor: 'less'},
        {loader: 'requirejs', preprocessor: 'sass', libsass: false},
        {loader: 'requirejs', preprocessor: 'sass', libsass: true},
        {loader: 'requirejs', preprocessor: 'stylus'},
        // requirejs uikit
        {loader: 'requirejs', framework: 'uikit'},
        {loader: 'requirejs', framework: 'uikit', preprocessor: 'less'},
        {loader: 'requirejs', framework: 'uikit', preprocessor: 'sass', libsass: false},
        {loader: 'requirejs', framework: 'uikit', preprocessor: 'sass', libsass: true},
        {loader: 'requirejs', framework: 'uikit', preprocessor: 'stylus'},
        // requirejs bootstrap
        {loader: 'requirejs', framework: 'bootstrap'},
        {loader: 'requirejs', framework: 'bootstrap', preprocessor: 'less'},
        {loader: 'requirejs', framework: 'bootstrap', preprocessor: 'sass', libsass: false},
        {loader: 'requirejs', framework: 'bootstrap', preprocessor: 'sass', libsass: true},
        {loader: 'requirejs', framework: 'bootstrap', preprocessor: 'stylus'},
        // requirejs foundation
        {loader: 'requirejs', framework: 'foundation'},
        {loader: 'requirejs', framework: 'foundation', preprocessor: 'less'},
        {loader: 'requirejs', framework: 'foundation', preprocessor: 'sass', libsass: false},
        {loader: 'requirejs', framework: 'foundation', preprocessor: 'sass', libsass: true},
        {loader: 'requirejs', framework: 'foundation', preprocessor: 'stylus'}
    ];

    tests.forEach(function(test) {
        it('test passed', function (done) {
            testPrompts(test, done);
        });
    });
});
