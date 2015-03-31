'use strict';
module.exports = function(grunt) {
    var _ = require('lodash');
    var path = require('path');
    return {
        css: ['<%%= paths.dist %>/styles/**/*.css'],
        js: ['<%%= paths.dist %>/scripts/**/*.js'],
        html: 'app/Resources/views/**/*.html.twig',
        options: {
            assetsDirs: ['<%%= paths.dist %>'],
            patterns: {
                html: [[
                    /asset\(['"]([^'"]+(?:css|js|jpg|jpeg|gif|png|webp))['"]\)/gm,
                    'Update references to reved assets',
                    function (m) {
                        var matched = _.chain(grunt.config.get('usemin.options.assetsDirs')).reduce(function(dirs,dir){
                            return _.map([
                                /\.[\w\d]{8}\.(css|js|jpg|jpeg|gif|png|webp)/m,
                                /\.(?:[\w\d]{8}\.)+(css|js|jpg|jpeg|gif|png|webp)/m
                            ],function(r){
                                return path.join(dir,m.replace(r,'.$1'));
                            }).concat(dirs);
                        },[]).uniq().intersection(_.keys(grunt.filerev.summary)).first().value();
                        return matched ? grunt.filerev.summary[matched] : m;
                    },

                    function (m) {
                        return m.replace(new RegExp('^(' + grunt.config.get('usemin.options.assetsDirs').join('|') + ')/'),'');
                    }
                ]]
            }
        }
    };
};
