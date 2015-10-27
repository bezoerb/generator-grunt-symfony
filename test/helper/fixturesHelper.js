/**
 * Created by ben on 09.05.15.
 */
'use strict';
var _ = require('lodash');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var exec = require('child_process').exec;


function reset() {
    return function (fp) {
        if (!/\.unused/.test(fp)) {
            return fp;
        }
        var newPath = fp.replace(/\.unused/, '');
        fs.renameSync(fp, newPath);
        return newPath;

    };
}

function inArray(arr) {
    return function (fp) {
        var name = path.basename(fp);
        var suit = _.indexOf(arr,'suit') !== -1 && /^suit-/.test(name);
        return suit || _.indexOf(['karma'],name) !== -1 || _.indexOf(arr,name) !== -1;
    };
}

function rename() {
    return function (fp) {
        fs.renameSync(fp, fp + '.unused');
        return fp + '.unused';
    };
}

/**
 * rename unused dependencies so they behave as if they were not installed
 * @returns {void}
 */
function prepareDeps(configFile, base, target) {
    var config = fs.readJsonSync(configFile);
    var modules = _.keys(_.merge(config.dependencies || {}, config.devDependencies));

    fs.removeSync(target);

    // link deps
    return _.chain(glob.sync(base + '/*'))
        .filter(inArray(modules))
        .forEach(function(fp){
            fs.ensureSymlinkSync(fp,path.join(target,path.basename(fp)));
        }).value();
}

/**
 * link dependencies
 */
function linkDeps(base, target, done) {
    return function () {
        prepareDeps(path.join(target, 'package.json'), path.join(base, 'node_modules'), path.join(target, 'node_modules'));
        prepareDeps(path.join(target, 'bower.json'), path.join(base, 'bower_components'), path.join(target, 'bower_components'));

        fs.ensureSymlinkSync(path.join(base, 'node_modules', '.bin'), path.join(target, 'node_modules', '.bin'));
        fs.ensureSymlinkSync(path.join(base, 'vendor'), path.join(target, 'vendor'));
        fs.removeSync(path.join(target, 'composer.lock'));
        fs.ensureSymlinkSync(path.join(base, 'composer.lock'), path.join(target, 'composer.lock'));
        fs.removeSync(path.join(target, 'composer.json'));
        fs.ensureSymlinkSync(path.join(base, 'composer.json'), path.join(target, 'composer.json'));
        fs.ensureSymlinkSync(path.join(base, 'bin'), path.join(target, 'bin'));

        var pkg = fs.readJsonSync(path.join(target, 'package.json'));
        if (pkg.jspm) {
            fs.ensureSymlinkSync(path.join(base, 'jspm_packages'), path.join(target, 'jspm_packages'));
        }

        done();
    };
}

module.exports.linkDeps = linkDeps;



module.exports.withComposer = function(cb) {
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

module.exports.withJspm = function(cb) {
    if (!cb) {
        cb = function () {
        };
    }
    exec('node_modules/.bin/jspm init -y', function (error, stdout) {
        cb(error, stdout);
    });
}
