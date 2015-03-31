'use strict';
/*jshint expr: true*/
var path = require('path');
var helpers = require('yeoman-generator').test;
var _ = require('lodash');
var files = require('./helper/fileHelper');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs-extra');
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

function linkDeps(skip) {
    return function () {
        // reset conflicted modules
        _.forEach(glob.sync(__dirname + '/fixtures/node_modules/*.conflicted'), function (conflicted) {
            fs.renameSync(conflicted, conflicted.replace(/\.conflicted$/, ''));
        });
        // rename skiped files conflicted
        _.chain(glob.sync(__dirname + '/fixtures/node_modules/*'))
            .filter(function (dir) {
                return _.indexOf(skip || [], path.basename(dir)) !== -1;
            }).forEach(function (dir) {
                fs.renameSync(dir, dir + '.conflicted');
            }).value();


        fs.symlinkSync(__dirname + '/fixtures/node_modules', __dirname + '/temp/node_modules');
        fs.symlinkSync(__dirname + '/fixtures/bower_components', __dirname + '/temp/bower_components');
        fs.symlinkSync(__dirname + '/fixtures/jspm_packages', __dirname + '/temp/jspm_packages');
    };
}


//function withComposer(cb) {
//    if (!cb) {
//        cb = function () {};
//    }
//    exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', function () {
//        fs.copySync(__dirname + '/temp/app/config/parameters.yml.dist', __dirname + '/temp/app/config/parameters.yml');
//        exec('php composer.phar install', function (error, stdout) {
//            cb(error, stdout);
//        });
//    });
//}

function withJspm(cb) {
    if (!cb) {
        cb = function () {};
    }
    exec('jspm install', function (error, stdout) {
        cb(error, stdout);
    });
}


describe('grunt-symfony generator', function () {

    var defaultOptions = {
        symfonyStandard: true,
        continue: true,
        framework: 'noframework',
        preprocessor: 'nopreprocessor',
        useCritical: false,
        loader: 'requirejs',
        loadGruntConfig: false
    };

    function testJs(config, conflictingModules) {
        var opts = _.assign(defaultOptions, config || {});
        return function () {
            before(function (done) {
                this.timeout(60000);
                helpers.run(path.join(__dirname, '../app'))
                    .inDir(__dirname + '/temp')
                    .withOptions({'skip-install': true})
                    .withPrompts(opts)
                    .on('ready', linkDeps(conflictingModules))
                    .on('end', done);
            });

            it('should pass jshint', function (done) {
                exec('grunt jshint', function (error, stdout) {
                    expect(stdout).to.contain('Done, without errors.');
                    done();
                });
            });

            it('should build js', function (done) {
                this.timeout(100000);
                if (opts.loader === 'jspm') {
                    withJspm(function (error) {
                        expect(error).to.be.null;
                        exec('grunt js', function (error, stdout) {
                            expect(stdout).to.contain('Done, without errors.');
                            done();
                        });
                    });
                } else {
                    exec('grunt js', function (error, stdout) {
                        expect(stdout).to.contain('Done, without errors.');
                        done();
                    });
                }
            });
        };
    }

    function testConfiguration(config, conflictingModules) {
        var opts = _.assign(defaultOptions, config || {});
        return function () {
            before(function (done) {
                this.timeout(60000);
                helpers.run(path.join(__dirname, '../app'))
                    .inDir(__dirname + '/temp')
                    .withOptions({'skip-install': true})
                    .withPrompts(opts)
                    .on('ready', linkDeps(conflictingModules))
                    .on('end', done);
            });

            it('should create files', function (done) {
                helpers.assertFile(files(__dirname + '/temp').addLess().addRequirejs().done());
                done();
            });



            it('should build css', function (done) {
                this.timeout(100000);
                exec('grunt css', function (error, stdout) {
                    expect(stdout).to.contain('Done, without errors.');
                    done();
                });
            });
        };
    }

    describe('running app with jspm and without framework ', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm and without preprocessor,framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, less and without framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less'}));
    describe('running app with jspm, sass (ruby) and without framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false}, ['grunt-sass']));
    describe('running app with jspm, sass (node) and without framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true}, ['grunt-contrib-sass']));
    describe('running app with jspm, stylus and without framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus'}));

    describe('running app with jspm and uikit', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, uikit and without preprocessor ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, less and uikit ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less',framework: 'uikit'}));
    describe('running app with jspm, sass (ruby) and uikit ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'uikit'}, ['grunt-sass']));
    describe('running app with jspm, sass (node) and uikit ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'uikit'}, ['grunt-contrib-sass']));
    describe('running app with jspm, stylus and uikit ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus',framework: 'uikit'}));

    describe('running app with jspm and bootstrap', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, bootstrap and without preprocessor ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, less and bootstrap ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less',framework: 'bootstrap'}));
    describe('running app with jspm, sass (ruby) and bootstrap ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'bootstrap'}, ['grunt-sass']));
    describe('running app with jspm, sass (node) and bootstrap ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'bootstrap'}, ['grunt-contrib-sass']));
    describe('running app with jspm, stylus and bootstrap ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus',framework: 'bootstrap'}));

    describe('running app with jspm and foundation', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, foundation and without preprocessor ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, less and foundation ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less',framework: 'foundation'}));
    describe('running app with jspm, sass (ruby) and foundation ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'foundation'}, ['grunt-sass']));
    describe('running app with jspm, sass (node) and foundation ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'foundation'}, ['grunt-contrib-sass']));
    describe('running app with jspm, stylus and foundation ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus',framework: 'foundation'}));

    describe('running app with jspm and pure', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, pure and without preprocessor ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with jspm, less and pure ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less',framework: 'pure'}));
    describe('running app with jspm, sass (ruby) and pure ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'pure'}, ['grunt-sass']));
    describe('running app with jspm, sass (node) and pure ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'pure'}, ['grunt-contrib-sass']));
    describe('running app with jspm, stylus and pure ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus',framework: 'pure'}));

    describe('running app with requirejs and without framework', testJs());
    describe('running app with requirejs and without preprocessor,framework ', testConfiguration());
    describe('running app with requirejs, less and without framework ', testConfiguration({loadGruntConfig: true,preprocessor: 'less'}));
    describe('running app with requirejs, sass (ruby) and without framework ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false}, ['grunt-sass']));
    describe('running app with requirejs, sass (node) and without framework ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true}, ['grunt-contrib-sass']));
    describe('running app with requirejs, stylus and without framework ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus'}));

    describe('running app with requirejs and uikit', testJs());
    describe('running app with requirejs, uikit and without preprocessor ', testConfiguration());
    describe('running app with requirejs, less and uikit ', testConfiguration({loadGruntConfig: true,preprocessor: 'less',framework: 'uikit'}));
    describe('running app with requirejs, sass (ruby) and uikit ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false,framework: 'uikit'}, ['grunt-sass']));
    describe('running app with requirejs, sass (node) and uikit ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true,framework: 'uikit'}, ['grunt-contrib-sass']));
    describe('running app with requirejs, stylus and uikit ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus',framework: 'uikit'}));

    describe('running app with requirejs and bootstrap', testJs());
    describe('running app with requirejs, less and bootstrap ', testConfiguration({loadGruntConfig: true,preprocessor: 'less',framework: 'bootstrap'}));
    describe('running app with requirejs, sass (ruby) and bootstrap ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false,framework: 'bootstrap'}, ['grunt-sass']));
    describe('running app with requirejs, sass (node) and bootstrap ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true,framework: 'bootstrap'}, ['grunt-contrib-sass']));
    describe('running app with requirejs, stylus and bootstrap ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus',framework: 'bootstrap'}));

    describe('running app with requirejs and foundation', testJs());
    describe('running app with requirejs, less and foundation ', testConfiguration({loadGruntConfig: true,preprocessor: 'less',framework: 'foundation'}));
    describe('running app with requirejs, sass (ruby) and foundation ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false,framework: 'foundation'}, ['grunt-sass']));
    describe('running app with requirejs, sass (node) and foundation ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true,framework: 'foundation'}, ['grunt-contrib-sass']));
    describe('running app with requirejs, stylus and foundation ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus',framework: 'foundation'}));

    describe('running app with requirejs and pure', testJs());
    describe('running app with requirejs, less and pure ', testConfiguration({loadGruntConfig: true,preprocessor: 'less',framework: 'pure'}));
    describe('running app with requirejs, sass (ruby) and pure ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false,framework: 'pure'}, ['grunt-sass']));
    describe('running app with requirejs, sass (node) and pure ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true,framework: 'pure'}, ['grunt-contrib-sass']));
    describe('running app with requirejs, stylus and pure ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus',framework: 'pure'}));


    describe('running app with load-grunt-config, jspm and without framework ', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm and without preprocessor,framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, less and without framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less'}));
    describe('running app with load-grunt-config, jspm, sass (ruby) and without framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false}, ['grunt-sass']));
    describe('running app with load-grunt-config, jspm, sass (node) and without framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, jspm, stylus and without framework ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus'}));

    describe('running app with load-grunt-config, jspm and uikit', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, uikit and without preprocessor ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, less and uikit ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less',framework: 'uikit'}));
    describe('running app with load-grunt-config, jspm, sass (ruby) and uikit ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'uikit'}, ['grunt-sass']));
    describe('running app with load-grunt-config, jspm, sass (node) and uikit ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'uikit'}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, jspm, stylus and uikit ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus',framework: 'uikit'}));

    describe('running app with load-grunt-config, jspm and bootstrap', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, bootstrap and without preprocessor ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, less and bootstrap ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less',framework: 'bootstrap'}));
    describe('running app with load-grunt-config, jspm, sass (ruby) and bootstrap ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'bootstrap'}, ['grunt-sass']));
    describe('running app with load-grunt-config, jspm, sass (node) and bootstrap ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'bootstrap'}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, jspm, stylus and bootstrap ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus',framework: 'bootstrap'}));

    describe('running app with load-grunt-config, jspm and foundation', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, foundation and without preprocessor ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, less and foundation ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less',framework: 'foundation'}));
    describe('running app with load-grunt-config, jspm, sass (ruby) and foundation ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'foundation'}, ['grunt-sass']));
    describe('running app with load-grunt-config, jspm, sass (node) and foundation ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'foundation'}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, jspm, stylus and foundation ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus',framework: 'foundation'}));

    describe('running app with load-grunt-config, jspm and pure', testJs({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, pure and without preprocessor ', testConfiguration({loadGruntConfig: true,loader: 'jspm'}));
    describe('running app with load-grunt-config, jspm, less and pure ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'less',framework: 'pure'}));
    describe('running app with load-grunt-config, jspm, sass (ruby) and pure ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: false,framework: 'pure'}, ['grunt-sass']));
    describe('running app with load-grunt-config, jspm, sass (node) and pure ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'sass',libsass: true,framework: 'pure'}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, jspm, stylus and pure ', testConfiguration({loadGruntConfig: true,loader: 'jspm',preprocessor: 'stylus',framework: 'pure'}));

    describe('running app with load-grunt-config, requirejs and without framework ', testJs({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs and without preprocessor,framework ', testConfiguration({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, less and without framework ', testConfiguration({loadGruntConfig: true,preprocessor: 'less'}));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and without framework ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false}, ['grunt-sass']));
    describe('running app with load-grunt-config, requirejs, sass (node) and without framework ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, requirejs, stylus and without framework ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus'}));

    describe('running app with load-grunt-config, requirejs and uikit ', testJs({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, uikit and without preprocessor ', testConfiguration({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, less and uikit ', testConfiguration({loadGruntConfig: true,preprocessor: 'less',framework: 'uikit'}));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and uikit ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false,framework: 'uikit'}, ['grunt-sass']));
    describe('running app with load-grunt-config, requirejs, sass (node) and uikit ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true,framework: 'uikit'}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, requirejs, stylus and uikit ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus',framework: 'uikit'}));

    describe('running app with load-grunt-config, requirejs and bootstrap', testJs({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, bootstrap and without preprocessor ', testConfiguration({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, less and bootstrap ', testConfiguration({loadGruntConfig: true,preprocessor: 'less',framework: 'bootstrap'}));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and bootstrap ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false,framework: 'bootstrap'}, ['grunt-sass']));
    describe('running app with load-grunt-config, requirejs, sass (node) and bootstrap ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true,framework: 'bootstrap'}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, requirejs, stylus and bootstrap ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus',framework: 'bootstrap'}));

    describe('running app with load-grunt-config, requirejs and foundation', testJs({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, foundation and without preprocessor ', testConfiguration({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, less and foundation ', testConfiguration({loadGruntConfig: true,preprocessor: 'less',framework: 'foundation'}));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and foundation ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false,framework: 'foundation'}, ['grunt-sass']));
    describe('running app with load-grunt-config, requirejs, sass (node) and foundation ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true,framework: 'foundation'}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, requirejs, stylus and foundation ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus',framework: 'foundation'}));

    describe('running app with load-grunt-config, requirejs and pure', testJs({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, pure and without preprocessor ', testConfiguration({loadGruntConfig: true}));
    describe('running app with load-grunt-config, requirejs, less and pure ', testConfiguration({loadGruntConfig: true,preprocessor: 'less',framework: 'pure'}));
    describe('running app with load-grunt-config, requirejs, sass (ruby) and pure ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: false,framework: 'pure'}, ['grunt-sass']));
    describe('running app with load-grunt-config, requirejs, sass (node) and pure ', testConfiguration({loadGruntConfig: true,preprocessor: 'sass',libsass: true,framework: 'pure'}, ['grunt-contrib-sass']));
    describe('running app with load-grunt-config, requirejs, stylus and pure ', testConfiguration({loadGruntConfig: true,preprocessor: 'stylus',framework: 'pure'}));

});
