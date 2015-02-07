'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var _ = require('lodash');
var util = require('util');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var AppGenerator = yeoman.generators.Base.extend({

    /**
     * Check for installed composer and prompt for installing composer locally if not found
     */
    checkComposer: function checkComposer() {
        var cb = this.async();
        // Check if composer is installed globally
        this.globalComposer = false;
        exec('composer', ['-V'], function (error) {
            if (error != null) {
                var prompts = [{
                    type: 'confirm',
                    name: 'continue',
                    message: 'WARNING: No global composer installation found. We will install locally if you decide to continue. Continue?',
                    default: false
                }];
                this.prompt(prompts, function (answers) {
                    if (answers.continue) {
                        // Use the secondary installation method as we cannot assume curl is installed
                        exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php');
                        this.log('Installing composer locally.');
                        this.log('See http://getcomposer.org for more details on composer.');
                        this.log('');
                        cb();
                    }
                }.bind(this));
            } else {
                this.globalComposer = true;
                cb();
            }
        }.bind(this));
    },

    /**
     * show custom repo if applicable
     * @param answers
     * @returns {boolean} true
     */
    showSymfonyRepo: function getRepo(answers) {
        var data = _.pick(answers, 'symfonyUsername', 'symfonyRepository', 'symfonyCommit');
        var custom = !_.result(answers, 'symfonyStandard');

        if (custom) {
            var repo = 'https://github.com/'
                + _.result(answers, 'symfonyUsername')
                + '/'
                + _.result(answers, 'symfonyRepository')
                + '/tree/'
                + _.result(answers, 'symfonyCommit');

            console.log('');
            console.log('Thanks! I\'ll use ' + repo);
            console.log('');

        }
        return true;
    },


    /**
     * Prompt for symfony standard edition
     */
    setSymfonyDistribution: function setSymfonyDistribution(answers) {
        var getAnswer = _.partial(_.result, answers);

        this.symfonyAcme = getAnswer('symfonyAcme');

        if (getAnswer('symfonyStandard')) {
            // Use symfony standard edition
            this.symfonyDistribution = this.symfonyDefaults;

        } else {
            // Use custom symfony distribution
            this.symfonyDistribution = {
                username: getAnswer('symfonyUsername'),
                repository: getAnswer('symfonyRepository'),
                commit: getAnswer('symfonyCommit')
            };
        }

    },


    updateAppKernel: function updateAppKernel() {
        this.log('Updating AppKernel ...');
        var appKernelPath = "app/AppKernel.php";
        var appKernelContents = this.readFileAsString(appKernelPath);
        var replaceValue = this.read("symfony/AppKernel.php");
        appKernelContents = appKernelContents.replace("return $bundles;", replaceValue);
        this.write(appKernelPath, appKernelContents);
    },

    updateComposerFile: function updateComposerFile() {
        this.log('Updating composer.json ...');
        var appKernelPath = "composer.json";
        var appKernelContents = this.readFileAsString(appKernelPath);
        var replaceValue = this.read("symfony/composer.json");
        appKernelContents = appKernelContents.replace('"require": {', replaceValue);
        this.write(appKernelPath, appKernelContents);
    }

});


module.exports = AppGenerator.extend({
    initializing: function () {
        this.pkg = require('../package.json');

        // Defaults
        this.symfonyDefaults = {
            username: 'symfony',
            repository: 'symfony-standard',
            commit: '2.6'
        };

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the priceless ' + chalk.red('GruntSymfony') + ' generator!'
        ));

        this.checkComposer();

    },


    prompting: function () {
        var context = this;
        var done = this.async();

        var symfonyCustom = function (answers) {
            return !_.result(answers, 'symfonyStandard');
        };

        function hasFeature(answers, group, feature) {
            return !!feature && _.result(answers, group) === feature;
        }


        var useSass = function (answers) {
            return hasFeature(answers, 'preprocessor', 'sass');
        };


        var prompts = [{
            type: 'confirm',
            name: 'symfonyStandard',
            message: 'Would you like to use the Symfony "Standard Edition 2.6" distribution',
            default: true
        }, {
            type: 'input',
            name: 'symfonyUsername',
            message: function () {
                context.log('--------------------------------------------------------------------------------');
                context.log('Please provide GitHub details of the Symfony distribution you would like to use.');
                context.log('e.g. http://github.com/[username]/[repository]/tree/[commit].');
                context.log('--------------------------------------------------------------------------------');
                return 'Username';
            },
            default: this.symfonyDefaults.username,
            when: symfonyCustom

        }, {
            type: 'input',
            name: 'symfonyRepository',
            message: 'Repository',
            default: this.symfonyDefaults.repository,
            when: symfonyCustom
        }, {
            type: 'input',
            name: 'symfonyCommit',
            message: 'Commit (commit/branch/tag)',
            default: this.symfonyDefaults.commit,
            when: symfonyCustom
        }, {
            type: 'confirm',
            name: 'symfonyAcme',
            message: 'Would you like to include the Acme/DemoBundle',
            default: false,
            when: this.showSymfonyRepo
        }, {
            type: 'list',
            name: 'framework',
            message: function () {
                context.log('--------------------------------------------------------------------------------');
                return 'Would you like to include a CSS framework?';
            },
            choices: [
                {name: 'No Framework', value: 'noframework'},
                {name: 'Twitter Bootstrap', value: 'bootstrap'},
                {name: 'PureCSS', value: 'pure'},
                {name: 'Foundation', value: 'foundation', checked: true}
            ]
        }, {
            type: 'list',
            name: 'preprocessor',
            message: 'Would you like to use a CSS preprocessor?',
            choices: [
                {name: 'No Preprocessor', value: 'nopreprocessor'},
                {name: 'Less', value: 'less'},
                {name: 'Sass', value: 'sass', checked: true},
                {name: 'Stylus', value: 'stylus'}
            ]
        }, {
            when: useSass,
            type: 'confirm',
            name: 'libsass',
            value: 'uselibsass',
            message: 'Would you like to use libsass? Read up more at \n' +
            chalk.green('https://github.com/andrew/node-sass#node-sass'),
            default: true
        }, {
            type: 'list',
            name: 'loader',
            message: 'Which module loader would you like to use?',
            choices: [
                {name: 'RequireJS', value: 'requirejs', checked: true},
                {name: 'Browserify', value: 'browserify'}
            ]
        }];

        this.prompt(prompts, function (props) {
            var has = _.partial(hasFeature, props);

            // set symfony repository and demoBundle option
            this.setSymfonyDistribution(props);

            var useFramework = _.partial(has, 'framework');
            this.noFramework = useFramework('noframework');
            this.useBootstrap = useFramework('bootstrap');
            this.usePure = useFramework('pure');
            this.useFoundation = useFramework('foundation');

            var usePreprocessor = _.partial(has, 'preprocessor');
            this.noPreprocessor = usePreprocessor('nopreprocessor');
            this.useLess = usePreprocessor('less');
            this.useSass = usePreprocessor('sass');
            this.useStylus = usePreprocessor('stylus');
            this.includeLibSass = this.useSass && props.libsass;
            this.includeRubySass = this.useSass && !props.libsass;

            var useLoader = _.partial(has, 'loader');
            this.useRequirejs = useLoader('requirejs');
            this.useBrowserify = useLoader('browserify');

             done();
        }.bind(this));
    },

    configuring: {
        enforceFolderName: function () {
            var appName = _.kebabCase(_.deburr(this.appname));
            var destName = _.last(this.destinationRoot().split(path.sep));

            if (appName !== _.kebabCase(_.deburr(destName))) {
                this.destinationRoot(this.appname);
            }
            this.config.save();
        },

        /**
         * install symfony base system
         */
        symfonyBase: function() {
            var done = this.async();
            var appPath = this.destinationRoot();

            this.remote(
                this.symfonyDistribution.username,
                this.symfonyDistribution.repository,
                this.symfonyDistribution.commit,
                function (err, remote) {
                    if (err) {
                        return done(err);
                    }
                    remote.directory('.', path.join(appPath, '.'));
                    done();
                }
            );
        },

        ///**
        // * remove unwanted files
        // */
        //symfonyClear: function symfonyClear() {
        //    var cb = this.async();
        //    var custom = [
        //        'web/app_dev.php',
        //        'app/Resources/views/base.html.twig',
        //        'src/Acme/DemoBundle/Resources/views/layout.html.twig'
        //    ];
        //    custom.forEach(function (file) {
        //        if (fs.existsSync(path.join(this.destinationRoot(), file))) {
        //            fs.unlinkSync(path.join(this.destinationRoot(), file));
        //        }
        //    }.bind(this));
        //    cb();
        //}


    },

    writing: {
        app: function () {
            this.template('_package.json', 'package.json');

            var bower = {
                name: this._.slugify(this.appname),
                private: true,
                dependencies: {}
            };

            if (this.useBootstrap) {
                var bs = 'bootstrap';
                if (this.useSass) {
                    bs += '-sass-official';
                }
                bower.dependencies[bs] = '~3.2.0';
                if (this.useStylus) {
                    bs += '-stylus';
                    bower.dependencies[bs] = '~4.0.0';
                }
            } else if (this.useFoundation) {
                bower.dependencies.foundation = '~5.5.1';
            } else if (this.usePure) {
                bower.dependencies.pure = '~0.5.0';
                bower.dependencies.jquery = '~2.1.3';
            }


            if (this.useRequirejs) {
                bower.dependencies.requirejs = '2.1.15';
                bower.dependencies.almond = '~0.3.0';
            }


            bower.dependencies.loglevel = '~1.2.0';
            bower.dependencies.picturefill = '~2.1.0';
            bower.dependencies.modernizr = '~2.8.3';

            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc')
            );

            this.write('bower.json', JSON.stringify(bower, null, 2));
        },

        projectfiles: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
        },

        gruntfile: function () {
            this.template('Gruntfile.js', 'Gruntfile.js');

            //   this.gruntfile.insertConfig("compass", "{ watch: { watch: true } }");
        },

        gitInit: function gitInit() {
            var cb = this.async();
            spawn('git', ['init']).on('exit', function () {
                cb();
            });
        }

        //updateAppKernel: function updateAppKernel() {
        //    console.log('This will add the custom bundles to the AppKernel');
        //    var appKernelPath = "app/AppKernel.php";
        //    var appKernelContents = this.readFileAsString(appKernelPath);
        //    var replaceValue = this.read("symfony/AppKernel.php");
        //    appKernelContents = appKernelContents.replace("return $bundles;", replaceValue);
        //    this.write(appKernelPath, appKernelContents);
        //},
        //
        //updateComposerFile: function updateComposerFile() {
        //    console.log('This will add the custom includes to the composer.json file');
        //    var appKernelPath = "composer.json";
        //    var appKernelContents = this.readFileAsString(appKernelPath);
        //    var replaceValue = this.read("symfony/composer.json");
        //    appKernelContents = appKernelContents.replace('"require": {', replaceValue);
        //    this.write(appKernelPath, appKernelContents);
        //},
        //
        //updateConfigDev: function updateConfigDev() {
        //    console.log('This will enable live reload in the development environment');
        //    var configDevPath = "app/config/config_dev.yml";
        //    var configDevContents = this.readFileAsString(configDevPath);
        //    var extraContents = this.read("symfony/config_dev.yml");
        //    configDevContents += extraContents;
        //    this.write(configDevPath, configDevContents);
        //}
    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            skipMessage: this.options['skip-install-message'],
            callback: function () {
                this.log('Getting the composer dependencies');
                //if (this.globalComposer) {
                //    spawn('composer', ['install']);
                //} else {
                //    spawn('php', ['composer.phar', 'install']);
                //}
            }.bind(this)
        });
    }
});
