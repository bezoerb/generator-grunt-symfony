'use strict';
module.exports = {
    test: {
        src: 'test/karma.conf.js',
        devDependencies: false,
        ignorePath: '../',
        fileTypes: {
            js: {
                block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                detect: {
                    js: /'(.*\.js)'/gi
                },
                replace: {
                    js: '{pattern: \'{{filePath}}\', included: false},'
                }
            }
        },
        exclude: []
    }
};
