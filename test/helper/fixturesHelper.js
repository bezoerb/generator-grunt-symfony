/**
 * Created by ben on 09.05.15.
 */
'use strict';
var _ = require('lodash');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');
var exec = require('child_process').exec;
var debug = require('debug')('yeoman:generator-grunt-symfony');

function inArray (arr) {
    return function (fp) {
        var name = path.basename(fp);
        var suit = _.indexOf(arr, 'suit') !== -1 && /^suit-/.test(name);
        return suit || _.indexOf(['karma'], name) !== -1 || _.indexOf(arr, name) !== -1;
    };
}

/**
 * symlink npm dependencies
 */
function prepareNpmDeps (configFile, base, target) {
    var config = fs.readJsonSync(configFile);
    var modules = _.keys(_.merge(config.dependencies || {}, config.devDependencies));

    fs.removeSync(target);

    // link deps
    return _.chain(glob.sync(base + '/*'))
        .filter(inArray(modules))
        .forEach(function (fp) {
            fs.ensureSymlinkSync(fp, path.join(target, path.basename(fp)));
        }).value();
}

/**
 * symlink bower dependencies
 */
function prepareBowerDeps (configFile, base, target) {
    var config = fs.readJsonSync(configFile);
    var dependencies = _.keys(_.merge(config.dependencies || {}, config.devDependencies));

    // add dependencies from dependencies as bower has a flat directory structure
    var modules = _.reduce(dependencies, function (res, item) {
        try {
            var configPath = path.join(base, item, 'bower.json');
            var config = fs.readJsonSync(configPath);
            return res.concat(_.keys(config.dependencies || {}));
        } catch (err) {
            return res;
        }
    }, dependencies);

    fs.removeSync(target);

    // link deps
    return _.chain(glob.sync(base + '/*'))
        .filter(inArray(_.uniq(modules)))
        .forEach(function (fp) {
            fs.ensureSymlinkSync(fp, path.join(target, path.basename(fp)));
        }).value();
}

/**
 * link dependencies
 */
function linkDeps (base, target, done) {
    return function () {
        prepareNpmDeps(path.join(target, 'package.json'), path.join(base, 'node_modules'), path.join(target, 'node_modules'));
        prepareBowerDeps(path.join(target, 'bower.json'), path.join(base, 'bower_components'), path.join(target, 'bower_components'));

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


module.exports.withComposer = function (cb) {
    if (!cb) {
        cb = function () {
        };
    }

    debug('process.cwd() -> ',process.cwd());

    exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', function (error) {
        if (error) {
            cb(error);
            return;
        }
        exec('php composer.phar clear-cache', function(error, stdout, stderr) {
            debug('stdout: composer install -> ', stdout);
            debug('stderr: composer install -> ', stderr);
            if (error) {
                debug('error: composer clear-cache -> ', error);
                cb(error);
                return;
            }

            exec('php composer.phar install --prefer-dist --no-interaction', function (error, stdout, stderr) {
                debug('error: composer install -> ', error);
                debug('stdout: composer install -> ', stdout);
                debug('stderr: composer install -> ', stderr);
                // app/bootstrap.php.cache should be ready
                var bootstrap = path.resolve('app/bootstrap.php.cache');
                /* jshint -W016 */
                try {
                    fs.statSync(bootstrap, fs.R_OK | fs.W_OK);
                    debug('SUCCESS bootstrap.php.cache -> available');
                } catch (err) {
                    debug('ERROR: bootstrap.php.cache -> ', err.message || err);
                }

                cb(error, stdout);
            });
        });
    });
};

module.exports.withJspm = function (cb) {
    if (!cb) {
        cb = function () {
        };
    }
    exec('node_modules/.bin/jspm init -y', function (error, stdout) {
        cb(error, stdout);
    });
};
