/**
 * Created by ben on 27.10.15.
 */
'use strict';
/*jshint expr: true*/
var path = require('path');
/*jshint -W079 */
var Promise = require('es6-promise').Promise;
var debug = require('debug')('yeoman:generator-grunt-symfony');
var helpers = require('yeoman-test');
var chalk = require('chalk');
var indentString = require('indent-string');
var assert = require('yeoman-assert');
var _ = require('lodash');
var files = require('./fileHelper');
var fixtureHelper = require('./fixturesHelper');
var withComposer = fixtureHelper.withComposer;
var withJspm = fixtureHelper.withJspm;
var chai = require('chai');
var expect = chai.expect;
var exec = require('child_process').exec;
var os = require('os');

var base = path.join(__dirname, '..', 'fixtures');
var target = path.join(__dirname, '..', 'temp');


var defaultOptions = {
    symfonyStandard: true,
    continue: true,
    framework: 'noframework',
    preprocessor: 'nopreprocessor',
    loader: 'requirejs',
    additional: []
};

function log (text) {
    process.stdout.write(indentString(chalk.grey(text), chalk.grey('      ')));
}

function markDone () {
    process.stdout.write(os.EOL);
}

function prompts2String (promts) {
    return _.reduce(promts, function (res, curr, key) {
        if (_.indexOf(['symfonyStandard', 'continue', 'additional'], key) >= 0) {
            return res;
        } else {
            res.push(key + ': ' + chalk.yellow(curr));
            return res;
        }

    }, []);
}


/**
 * Run generator
 *
 * @param prompts
 * @returns {Promise}
 */
function install (prompts) {
    return new Promise(function (resolve) {
        var opts = prompts2String(prompts);
        process.stdout.write(os.EOL + indentString('running app with ' + opts.join(', '), '    ') + os.EOL);
        helpers.run(path.join(__dirname, '../../app'))
            .inDir(target)
            .withOptions({'skip-install': true})
            .withPrompts(prompts)
            .on('end', fixtureHelper.linkDeps(base, target, function () {
                resolve();
            }));
    });
}

/**
 * @param prompts
 * @returns {Function}
 */
function checkFiles (prompts) {
    return function () {
        log('... check files');
        var usedFiles = files(target);
        switch (prompts.preprocessor) {
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

        switch (prompts.loader) {
            case 'requirejs':
                usedFiles = usedFiles.addRequirejs();
                break;
            case 'jspm':
                usedFiles = usedFiles.addJspm();
                break;
        }
        markDone();
        assert.file(usedFiles.toArray());
    };
}


function checkTests (prompts) {
    return function () {
        log('... check eslint, karma (mocha) and phpunit');
        return new Promise(function (resolve) {
            withComposer(function (error, stdout) {
                /*jshint expr: true*/
                debug(os.EOL + stdout);
                expect(error).to.be.null;

                if (prompts.loader === 'jspm') {
                    withJspm(function (error, stdout) {
                        /*jshint expr: true*/
                        debug(os.EOL + stdout);
                        expect(error).to.be.null;
                        exec('grunt test --no-color', function (error, stdout) {
                            if (error) {
                                log(os.EOL + stdout + os.EOL);
                            }
                            /*jshint expr: true*/
                            expect(error).to.be.null;
                            expect(stdout).to.contain('Done, without errors.');
                            markDone();
                            resolve();
                        });
                    });
                } else {
                    exec('grunt test --no-color', function (error, stdout) {
                        if (error) {
                            log(os.EOL + stdout + os.EOL);
                        }
                        /*jshint expr: true*/
                        expect(error).to.be.null;
                        expect(stdout).to.contain('Done, without errors.');
                        markDone();
                        resolve();
                    });
                }


            });
        });
    };
}

function checkJs (prompts) {
    return function () {
        log('... check js build');
        return new Promise(function (resolve) {
            if (prompts.loader === 'jspm') {
                withJspm(function (error) {
                    /*jshint expr: true*/
                    expect(error).to.be.null;
                    exec('grunt js --no-color', function (error, stdout) {
                        /*jshint expr: true*/
                        expect(error).to.be.null;
                        expect(stdout).to.contain('Done, without errors.');
                        markDone();
                        resolve();
                    });
                });
            } else {
                exec('grunt js --no-color', function (error, stdout) {
                    /*jshint expr: true*/
                    expect(error).to.be.null;
                    expect(stdout).to.contain('Done, without errors.');
                    markDone();
                    resolve();
                });
            }
        });
    };
}

function checkCss () {
    return function () {
        log('... check css build');
        return new Promise(function (resolve) {
            exec('grunt css --no-color', function (error, stdout) {
                /*jshint expr: true*/
                expect(error).to.be.null;
                expect(stdout).to.contain('Done, without errors.');
                markDone();
                resolve();
            });
        });
    };
}


module.exports.testPrompts = function (opts, done) {
    var prompts = _.defaults(opts, defaultOptions);
    install(prompts)
        .then(checkFiles(prompts))
        .then(checkTests(prompts))
        .then(checkJs(prompts))
        .then(checkCss())
        .then(done)
        .catch(function (err) {
            process.stderr.write(os.EOL + (err.message || err));
            /*jshint expr: true*/
            expect(err).to.be.null;
        });
};
