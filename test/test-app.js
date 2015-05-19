'use strict';
/*jshint expr: true*/
var path = require('path');
var helpers = require('yeoman-generator').test;
var _ = require('lodash');
var files = require('./helper/fileHelper');
var fixtureHelper = require('./helper/fixturesHelper');
var chai = require('chai');
var expect = chai.expect;
var glob = require('glob');
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


function withComposer(cb) {
    if (!cb) {
        cb = function () {};
    }
    exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', function () {
        exec('php composer.phar install  --no-interaction ', function (error, stdout) {
            cb(error, stdout);
        }).stdout.on('data', function(data) {
            console.log(data);
        });
    });
}

function withJspm(cb) {
    if (!cb) {
        cb = function () {
        };
    }
    exec('jspm init -y', function (error, stdout) {
        cb(error, stdout);
    }).stdout.on('data', function(data) {
        console.log(data);
    });
}


describe('grunt-symfony generator', function () {

    var defaultOptions = {
        symfonyStandard: true,
        continue: true,
        framework: 'noframework',
        preprocessor: 'nopreprocessor',
        loader: 'requirejs',
        loadGruntConfig: false,
        additional: []
    };

    function testConfiguration(config) {
        var opts = _.assign(defaultOptions, config || {});
        var base = path.join(__dirname, 'fixtures');
        var target = path.join(__dirname, 'temp');

        return function () {
            before(function (done) {
                this.timeout(60000);

                helpers.run(path.join(__dirname, '../app'))
                    .inDir(__dirname + '/temp')
                    .withOptions({'skip-install': true})
                    .withPrompts(opts)
                    .on('end', fixtureHelper.linkDeps(base, target, done));
            });

            it('should create files', function (done) {
                helpers.assertFile(files(__dirname + '/temp').addLess().addRequirejs().done());
                done();
            });

            it('should pass jshint, karma (mocha) and phpunit', function (done) {
                withComposer(function(error){
                    expect(error).to.be.null;
                    exec('grunt test --no-color', function (error, stdout) {
                        expect(stdout).to.contain('Done, without errors.');
                        done();
                    });
                });
            });

            it('should build js', function (done) {
                this.timeout(100000);
                if (opts.loader === 'jspm') {
                    withJspm(function (error) {
                        expect(error).to.be.null;
                        exec('grunt js --no-color', function (error, stdout) {
                            expect(stdout).to.contain('Done, without errors.');
                            done();
                        });
                    });
                } else {
                    exec('grunt js --no-color', function (error, stdout) {
                        expect(stdout).to.contain('Done, without errors.');
                        done();
                    });
                }
            });

            it('should build css', function (done) {
                this.timeout(100000);
                exec('grunt css --no-color', function (error, stdout) {
                    expect(stdout).to.contain('Done, without errors.');
                    done();
                });
            });


        };
    }


//function testConfiguration(config) {
//    var opts = _.assign(defaultOptions, config || {});
//    return function () {
//        before(function (done) {
//            this.timeout(60000);
//            helpers.run(path.join(__dirname, '../app'))
//                .inDir(__dirname + '/temp')
//                .withOptions({'skip-install': true})
//                .withPrompts(opts)
//                .on('ready', fixtureHelper.linkDeps(path.join(__dirname, 'fixtures'), path.join(__dirname, 'temp')))
//                .on('end', done);
//        });
//
//        it('should create files', function (done) {
//            helpers.assertFile(files(__dirname + '/temp').addLess().addRequirejs().done());
//            done();
//        });
//
//
//
//        it('should build css', function (done) {
//            this.timeout(100000);
//            exec('grunt css --no-color', function (error, stdout) {
//                expect(stdout).to.contain('Done, without errors.');
//                done();
//            });
//        });
//    };
//}


    describe('running app with load-grunt-config, jspm and without preprocessor,framework ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and without framework ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'less'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and without framework ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and without framework ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true
    }));
    describe('running app with load-grunt-config, jspm, stylus and without framework ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'stylus'
    }));

    describe('running app with load-grunt-config, jspm, uikit and without preprocessor ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and uikit ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'less',
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and uikit ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and uikit ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, jspm, stylus and uikit ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'stylus',
        framework: 'uikit'
    }));

    describe('running app with load-grunt-config, jspm, bootstrap and without preprocessor ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and bootstrap ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'less',
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and bootstrap ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and bootstrap ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, jspm, stylus and bootstrap ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'stylus',
        framework: 'bootstrap'
    }));

    describe('running app with load-grunt-config, jspm, foundation and without preprocessor ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and foundation ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'less',
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and foundation ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and foundation ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, jspm, stylus and foundation ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'stylus',
        framework: 'foundation'
    }));

    describe('running app with load-grunt-config, jspm, pure and without preprocessor ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and pure ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'less',
        framework: 'pure'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and pure ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false,
        framework: 'pure'
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and pure ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true,
        framework: 'pure'
    }));
    describe('running app with load-grunt-config, jspm, stylus and pure ', testConfiguration({
        loadGruntConfig: true,
        loader: 'jspm',
        preprocessor: 'stylus',
        framework: 'pure'
    }));

    describe('running app with load-grunt-config, requirejs and without preprocessor,framework ', testConfiguration({
        loadGruntConfig: true
    }));
    describe('running app with load-grunt-config, requirejs, less and without framework ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'less'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and without framework ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: false
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and without framework ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: true
    }));
    describe('running app with load-grunt-config, requirejs, stylus and without framework ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'stylus'
    }));

    describe('running app with load-grunt-config, requirejs, uikit and without preprocessor ', testConfiguration({
        loadGruntConfig: true,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, requirejs, less and uikit ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'less',
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and uikit ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: false,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and uikit ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: true,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, requirejs, stylus and uikit ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'stylus',
        framework: 'uikit'
    }));

    describe('running app with load-grunt-config, requirejs, bootstrap and without preprocessor ', testConfiguration({
        loadGruntConfig: true,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, requirejs, less and bootstrap ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'less',
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and bootstrap ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: false,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and bootstrap ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: true,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, requirejs, stylus and bootstrap ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'stylus',
        framework: 'bootstrap'
    }));

    describe('running app with load-grunt-config, requirejs, foundation and without preprocessor ', testConfiguration({
        loadGruntConfig: true,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, requirejs, less and foundation ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'less',
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and foundation ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: false,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and foundation ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: true,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, requirejs, stylus and foundation ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'stylus',
        framework: 'foundation'
    }));

    describe('running app with load-grunt-config, requirejs, pure and without preprocessor ', testConfiguration({
        loadGruntConfig: true,
        framework: 'pure'
    }));
    describe('running app with load-grunt-config, requirejs, less and pure ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'less',
        framework: 'pure'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and pure ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: false,
        framework: 'pure'
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and pure ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'sass',
        libsass: true,
        framework: 'pure'
    }));
    describe('running app with load-grunt-config, requirejs, stylus and pure ', testConfiguration({
        loadGruntConfig: true,
        preprocessor: 'stylus',
        framework: 'pure'
    }));

    /* deprecated the use without load-grunt-config so tests aren't needed anymore
     describe('running app with jspm and without framework ', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm and without preprocessor,framework ', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, less and without framework ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'less'}));
     describe('running app with jspm, sass (ruby) and without framework ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: false}));
     describe('running app with jspm, sass (node) and without framework ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: true}));
     describe('running app with jspm, stylus and without framework ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'stylus'}));

     describe('running app with jspm and uikit', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, uikit and without preprocessor ', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, less and uikit ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'less',framework: 'uikit'}));
     describe('running app with jspm, sass (ruby) and uikit ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'uikit'}));
     describe('running app with jspm, sass (node) and uikit ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'uikit'}));
     describe('running app with jspm, stylus and uikit ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'stylus',framework: 'uikit'}));

     describe('running app with jspm and bootstrap', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, bootstrap and without preprocessor ', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, less and bootstrap ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'less',framework: 'bootstrap'}));
     describe('running app with jspm, sass (ruby) and bootstrap ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'bootstrap'}));
     describe('running app with jspm, sass (node) and bootstrap ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'bootstrap'}));
     describe('running app with jspm, stylus and bootstrap ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'stylus',framework: 'bootstrap'}));

     describe('running app with jspm and foundation', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, foundation and without preprocessor ', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, less and foundation ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'less',framework: 'foundation'}));
     describe('running app with jspm, sass (ruby) and foundation ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'foundation'}));
     describe('running app with jspm, sass (node) and foundation ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'foundation'}));
     describe('running app with jspm, stylus and foundation ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'stylus',framework: 'foundation'}));

     describe('running app with jspm and pure', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, pure and without preprocessor ', testConfiguration({loadGruntConfig: false,loader: 'jspm'}));
     describe('running app with jspm, less and pure ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'less',framework: 'pure'}));
     describe('running app with jspm, sass (ruby) and pure ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'pure'}));
     describe('running app with jspm, sass (node) and pure ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'pure'}));
     describe('running app with jspm, stylus and pure ', testConfiguration({loadGruntConfig: false,loader: 'jspm',preprocessor: 'stylus',framework: 'pure'}));

     describe('running app with requirejs and without framework', testConfiguration());
     describe('running app with requirejs and without preprocessor,framework ', testConfiguration());
     describe('running app with requirejs, less and without framework ', testConfiguration({loadGruntConfig: false,preprocessor: 'less'}));
     describe('running app with requirejs, sass (ruby) and without framework ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: false}));
     describe('running app with requirejs, sass (node) and without framework ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: true}));
     describe('running app with requirejs, stylus and without framework ', testConfiguration({loadGruntConfig: false,preprocessor: 'stylus'}));

     describe('running app with requirejs and uikit', testConfiguration());
     describe('running app with requirejs, uikit and without preprocessor ', testConfiguration());
     describe('running app with requirejs, less and uikit ', testConfiguration({loadGruntConfig: false,preprocessor: 'less',framework: 'uikit'}));
     describe('running app with requirejs, sass (ruby) and uikit ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: false,framework: 'uikit'}));
     describe('running app with requirejs, sass (node) and uikit ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: true,framework: 'uikit'}));
     describe('running app with requirejs, stylus and uikit ', testConfiguration({loadGruntConfig: false,preprocessor: 'stylus',framework: 'uikit'}));

     describe('running app with requirejs and bootstrap', testConfiguration());
     describe('running app with requirejs, less and bootstrap ', testConfiguration({loadGruntConfig: false,preprocessor: 'less',framework: 'bootstrap'}));
     describe('running app with requirejs, sass (ruby) and bootstrap ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: false,framework: 'bootstrap'}));
     describe('running app with requirejs, sass (node) and bootstrap ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: true,framework: 'bootstrap'}));
     describe('running app with requirejs, stylus and bootstrap ', testConfiguration({loadGruntConfig: false,preprocessor: 'stylus',framework: 'bootstrap'}));

     describe('running app with requirejs and foundation', testConfiguration());
     describe('running app with requirejs, less and foundation ', testConfiguration({loadGruntConfig: false,preprocessor: 'less',framework: 'foundation'}));
     describe('running app with requirejs, sass (ruby) and foundation ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: false,framework: 'foundation'}));
     describe('running app with requirejs, sass (node) and foundation ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: true,framework: 'foundation'}));
     describe('running app with requirejs, stylus and foundation ', testConfiguration({loadGruntConfig: false,preprocessor: 'stylus',framework: 'foundation'}));

     describe('running app with requirejs and pure', testConfiguration());
     describe('running app with requirejs, less and pure ', testConfiguration({loadGruntConfig: false,preprocessor: 'less',framework: 'pure'}));
     describe('running app with requirejs, sass (ruby) and pure ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: false,framework: 'pure'}));
     describe('running app with requirejs, sass (node) and pure ', testConfiguration({loadGruntConfig: false,preprocessor: 'sass',libsass: true,framework: 'pure'}));
     describe('running app with requirejs, stylus and pure ', testConfiguration({loadGruntConfig: false,preprocessor: 'stylus',framework: 'pure'}));
     */
})
;
