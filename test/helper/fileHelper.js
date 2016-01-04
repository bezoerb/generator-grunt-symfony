/**
 * Created by ben on 11.02.15.
 */
'use strict';

var path = require('path');

function Base(dir) {
    this._dir = dir;
    this.files = [
        path.join(this._dir, 'bower.json'),
        path.join(this._dir, 'package.json'),
        path.join(this._dir, 'Gruntfile.js'),
        path.join(this._dir, '.editorconfig'),
        path.join(this._dir, '.eslintrc'),
        path.join(this._dir, '.jscsrc'),
    ];
}

Base.prototype.addRequirejs = function () {
    this.files.concat([
        path.join(this._dir, 'app/Resources/scripts/main.js'),
            path.join(this._dir, 'app/Resources/scripts/config.js'),
                path.join(this._dir, 'app/Resources/scripts/app.js')
    ]);
    return this;
};


Base.prototype.addJspm = function () {
    this.files.concat([
        path.join(this._dir, 'app/Resources/scripts/main.js'),
            path.join(this._dir, 'app/Resources/scripts/config.js')
    ]);
    return this;
};

Base.prototype.addNop = function () {
    this.files.concat([path.join(this._dir, 'app/Resources/styles/main.css')]);
    return this;
};

Base.prototype.addLess = function () {
    this.files.concat([path.join(this._dir, 'app/Resources/styles/main.less')]);
    return this;
};

Base.prototype.addStylus = function () {
    this.files.concat([path.join(this._dir, 'app/Resources/styles/main.styl')]);
    return this;
};

Base.prototype.addSass = function () {
    this.files.concat([path.join(this._dir, 'app/Resources/styles/main.sass')]);
    return this;
};

Base.prototype.toArray = function () {
    return this.files;
};

module.exports = function (dir) {
    return new Base(dir);
};
