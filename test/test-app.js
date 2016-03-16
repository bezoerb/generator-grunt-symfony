'use strict';
/*jshint expr: true*/
var testPrompts = require('./helper/testHelper').testPrompts;
var assign = require('lodash/assign');
var clone = require('lodash/clone');

describe('grunt-symfony generator', function () {
    this.timeout(300000);

    var tests = [
        // jspm no framework
        {loader: 'browserify'},
        {loader: 'browserify', preprocessor: 'less'},
        {loader: 'browserify', preprocessor: 'sass', libsass: false},
        {loader: 'browserify', preprocessor: 'sass', libsass: true},
        {loader: 'browserify', preprocessor: 'stylus'},
        // browserify uikit
        {loader: 'browserify', framework: 'uikit'},
        {loader: 'browserify', framework: 'uikit', preprocessor: 'less'},
        {loader: 'browserify', framework: 'uikit', preprocessor: 'sass', libsass: false},
        {loader: 'browserify', framework: 'uikit', preprocessor: 'sass', libsass: true},
        {loader: 'browserify', framework: 'uikit', preprocessor: 'stylus'},
        // browserify bootstrap
        {loader: 'browserify', framework: 'bootstrap'},
        {loader: 'browserify', framework: 'bootstrap', preprocessor: 'less'},
        {loader: 'browserify', framework: 'bootstrap', preprocessor: 'sass', libsass: false},
        {loader: 'browserify', framework: 'bootstrap', preprocessor: 'sass', libsass: true},
        {loader: 'browserify', framework: 'bootstrap', preprocessor: 'stylus'},
        // browserify foundation
        {loader: 'browserify', framework: 'foundation'},
        {loader: 'browserify', framework: 'foundation', preprocessor: 'less'},
        {loader: 'browserify', framework: 'foundation', preprocessor: 'sass', libsass: false},
        {loader: 'browserify', framework: 'foundation', preprocessor: 'sass', libsass: true},
        {loader: 'browserify', framework: 'foundation', preprocessor: 'stylus'},
        
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

    var defaults = {
        // need to inject symfony 2.7 to tests as travis node does not support min php version for symfony 3.0
        symfonyStandard: false, 
        symfonyCommit: '2.7',
        continue: true,
        framework: 'noframework',
        preprocessor: 'nopreprocessor',
        loader: 'requirejs',
        additional: []
    };

    tests.forEach(function(test) {
        it('test passed', function (done) {
            testPrompts(assign(clone(defaults),test), done);
        });
    });
});
