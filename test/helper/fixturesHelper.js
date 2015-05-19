/**
 * Created by ben on 09.05.15.
 */
'use strict';
var _ = require('lodash');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');


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
function prepareDeps(configFile, dir) {
    var config = fs.readJsonSync(configFile);
    var modules = _.keys(_.merge(config.dependencies || {}, config.devDependencies));

    // rename skiped files conflicted
    var unused = _.chain(glob.sync(dir + '/*'))
        .map(reset())
        .reject(inArray(modules))
        .map(rename())
        .value();

    return unused;
}

/**
 * link dependencies
 */
function linkDeps(base, target, done) {
    return function () {
        prepareDeps(path.join(target, 'package.json'), path.join(base, 'node_modules'));
        prepareDeps(path.join(target, 'bower.json'), path.join(base, 'bower_components'));


        fs.symlinkSync(path.join(base, 'node_modules'), path.join(target, 'node_modules'));
        fs.symlinkSync(path.join(base, 'bower_components'), path.join(target, 'bower_components'));
        fs.symlinkSync(path.join(base, 'vendor'), path.join(target, 'vendor'));
        fs.unlinkSync(path.join(target, 'composer.lock'));
        fs.symlinkSync(path.join(base, 'composer.lock'), path.join(target, 'composer.lock'));
        fs.unlinkSync(path.join(target, 'composer.json'));
        fs.symlinkSync(path.join(base, 'composer.json'), path.join(target, 'composer.json'));
        fs.symlinkSync(path.join(base, 'bin'), path.join(target, 'bin'));

        var pkg = fs.readJsonSync(path.join(target, 'package.json'));
        if (pkg.jspm) {
            fs.symlinkSync(path.join(base, 'jspm_packages'), path.join(target, 'jspm_packages'));
        }

        done();
    };
}

module.exports.linkDeps = linkDeps;
