'use strict';
/*jshint expr: true*/
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');
var _ = require('lodash');
var files = require('./helper/fileHelper');
var fixtureHelper = require('./helper/fixturesHelper');
var chai = require('chai');
var expect = chai.expect;
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

//

function withComposer (cb) {
    if (!cb) {
        cb = function () {
        };
    }
    exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', function (error) {
        if (error) {
            cb(error);
            return;
        }

        exec('php composer.phar install --prefer-dist --no-interaction', function (error, stdout, stderr) {
            cb(error, stdout);
        });
    });
}

function withJspm (cb) {
    if (!cb) {
        cb = function () {
        };
    }
    exec('node_modules/.bin/jspm init -y', function (error, stdout) {
        cb(error, stdout);
    });
}


describe('grunt-symfony generator', function () {

    var defaultOptions = {
        symfonyStandard: true,
        continue: true,
        framework: 'noframework',
        preprocessor: 'nopreprocessor',
        loader: 'requirejs',
        additional: []
    };

    function testConfiguration (config) {
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
                var usedFiles = files(__dirname + '/temp');
                switch (opts.preprocessor) {
                    case 'less':
                        usedFiles = usedFiles.addLess();
                        break;
                    case 'stylus':
                        usedFiles = usedFiles.addStylus();
                        break;
                    case 'sass':
                        usedFiles = usedFiles.addSass();
                        break;
                    default:
                        usedFiles = usedFiles.addNop();
                        break;
                }

                switch (opts.loader) {
                    case 'requirejs':
                        usedFiles = usedFiles.addRequirejs();
                        break;
                    case 'jspm':
                        usedFiles = usedFiles.addJspm();
                        break;
                }

                assert.file(usedFiles.toArray());

                done();
            });

            it('should pass jshint, karma (mocha) and phpunit', function (done) {
                withComposer(function (error) {
                    withJspm(function (error) {
                        expect(error).to.be.null;
                        var testProcess = exec('grunt test --no-color', function (error, stdout) {
                            expect(stdout).to.contain('Done, without errors.');
                            done();
                        });
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


    describe('running app with load-grunt-config, jspm and without preprocessor,framework ', testConfiguration({
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and without framework ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'less'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and without framework ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and without framework ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true
    }));
    describe('running app with load-grunt-config, jspm, stylus and without framework ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'stylus'
    }));

    describe('running app with load-grunt-config, jspm, uikit and without preprocessor ', testConfiguration({
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and uikit ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'less',
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and uikit ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and uikit ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, jspm, stylus and uikit ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'stylus',
        framework: 'uikit'
    }));

    describe('running app with load-grunt-config, jspm, bootstrap and without preprocessor ', testConfiguration({
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and bootstrap ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'less',
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and bootstrap ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and bootstrap ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, jspm, stylus and bootstrap ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'stylus',
        framework: 'bootstrap'
    }));

    describe('running app with load-grunt-config, jspm, foundation and without preprocessor ', testConfiguration({
        loader: 'jspm'
    }));
    describe('running app with load-grunt-config, jspm, less and foundation ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'less',
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, jspm, sass (ruby) and foundation ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: false,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, jspm, sass (node) and foundation ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'sass',
        libsass: true,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, jspm, stylus and foundation ', testConfiguration({
        loader: 'jspm',
        preprocessor: 'stylus',
        framework: 'foundation'
    }));


    describe('running app with load-grunt-config, webpack and without preprocessor,framework ', testConfiguration({
        loader: 'webpack'
    }));
    describe('running app with load-grunt-config, webpack, less and without framework ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'less'
    }));
    describe('running app with load-grunt-config, webpack, sass (ruby) and without framework ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'sass',
        libsass: false
    }));
    describe('running app with load-grunt-config, webpack, sass (node) and without framework ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'sass',
        libsass: true
    }));
    describe('running app with load-grunt-config, webpack, stylus and without framework ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'stylus'
    }));

    describe('running app with load-grunt-config, webpack, uikit and without preprocessor ', testConfiguration({
        loader: 'webpack'
    }));
    describe('running app with load-grunt-config, webpack, less and uikit ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'less',
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, webpack, sass (ruby) and uikit ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'sass',
        libsass: false,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, webpack, sass (node) and uikit ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'sass',
        libsass: true,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, webpack, stylus and uikit ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'stylus',
        framework: 'uikit'
    }));

    describe('running app with load-grunt-config, webpack, bootstrap and without preprocessor ', testConfiguration({
        loader: 'webpack'
    }));
    describe('running app with load-grunt-config, webpack, less and bootstrap ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'less',
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, webpack, sass (ruby) and bootstrap ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'sass',
        libsass: false,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, webpack, sass (node) and bootstrap ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'sass',
        libsass: true,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, webpack, stylus and bootstrap ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'stylus',
        framework: 'bootstrap'
    }));

    describe('running app with load-grunt-config, webpack, foundation and without preprocessor ', testConfiguration({
        loader: 'webpack'
    }));
    describe('running app with load-grunt-config, webpack, less and foundation ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'less',
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, webpack, sass (ruby) and foundation ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'sass',
        libsass: false,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, webpack, sass (node) and foundation ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'sass',
        libsass: true,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, webpack, stylus and foundation ', testConfiguration({
        loader: 'webpack',
        preprocessor: 'stylus',
        framework: 'foundation'
    }));


    describe('running app with load-grunt-config, requirejs and without preprocessor,framework ', testConfiguration({
        loadGruntConfig: true
    }));
    describe('running app with load-grunt-config, requirejs, less and without framework ', testConfiguration({
        preprocessor: 'less'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and without framework ', testConfiguration({
        preprocessor: 'sass',
        libsass: false
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and without framework ', testConfiguration({
        preprocessor: 'sass',
        libsass: true
    }));
    describe('running app with load-grunt-config, requirejs, stylus and without framework ', testConfiguration({
        preprocessor: 'stylus'
    }));

    describe('running app with load-grunt-config, requirejs, uikit and without preprocessor ', testConfiguration({
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, requirejs, less and uikit ', testConfiguration({
        preprocessor: 'less',
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and uikit ', testConfiguration({
        preprocessor: 'sass',
        libsass: false,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and uikit ', testConfiguration({
        preprocessor: 'sass',
        libsass: true,
        framework: 'uikit'
    }));
    describe('running app with load-grunt-config, requirejs, stylus and uikit ', testConfiguration({
        preprocessor: 'stylus',
        framework: 'uikit'
    }));

    describe('running app with load-grunt-config, requirejs, bootstrap and without preprocessor ', testConfiguration({
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, requirejs, less and bootstrap ', testConfiguration({
        preprocessor: 'less',
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and bootstrap ', testConfiguration({
        preprocessor: 'sass',
        libsass: false,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and bootstrap ', testConfiguration({
        preprocessor: 'sass',
        libsass: true,
        framework: 'bootstrap'
    }));
    describe('running app with load-grunt-config, requirejs, stylus and bootstrap ', testConfiguration({
        preprocessor: 'stylus',
        framework: 'bootstrap'
    }));

    describe('running app with load-grunt-config, requirejs, foundation and without preprocessor ', testConfiguration({
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, requirejs, less and foundation ', testConfiguration({
        preprocessor: 'less',
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and foundation ', testConfiguration({
        preprocessor: 'sass',
        libsass: false,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, requirejs, sass (node) and foundation ', testConfiguration({
        preprocessor: 'sass',
        libsass: true,
        framework: 'foundation'
    }));
    describe('running app with load-grunt-config, requirejs, stylus and foundation ', testConfiguration({
        preprocessor: 'stylus',
        framework: 'foundation'
    }));
});
