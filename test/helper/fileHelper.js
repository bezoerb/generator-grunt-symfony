/**
 * Created by ben on 11.02.15.
 */
function Base() {
    this.files = [
        'bower.json',
        'package.json',
        'Gruntfile.js',
        '.editorconfig',
        '.jshintrc'
    ];
}

Base.prototype.addRequirejs = function() {
    this.files.concat([
        'app/Resources/scripts/main.js',
        'app/Resources/scripts/config.js',
        'app/Resources/scripts/app.js'
    ]);
    return this;
};


Base.prototype.addJspm = function() {
    this.files.concat([
        'app/Resources/scripts/main.js',
        'app/Resources/scripts/config.js'
    ]);
    return this;
};

Base.prototype.addNop = function() {
    this.files.concat(['app/Resources/styles/main.css']);
    return this;
};

Base.prototype.addLess = function() {
    this.files.concat(['app/Resources/styles/main.less']);
    return this;
};

Base.prototype.addStylus = function() {
    this.files.concat(['app/Resources/styles/main.styl']);
    return this;
};

Base.prototype.addSass = function() {
    this.files.concat(['app/Resources/styles/main.sass']);
    return this;
};

Base.prototype.done = function() {
    return this.files;
}

module.exports = function() {
    return new Base();
};
