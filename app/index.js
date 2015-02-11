'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var _ = require('lodash');
//var util = require('util');
var path = require('path');
var exec = require('child_process').exec;
var yaml = require('js-yaml');
var fse = require('fs-extra');


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
     * Check for installed jspm
     */
    checkJspm: function checkJspm() {
        // Check if jspm is installed globally
        this.globalJspm = false;
        exec('jspm', ['-v'], function (error) {
            this.globalJspm = !error;
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


    /**
     * remove assetic
     */
    cleanComposer: function () {
        var done = this.async();

        var composerContents = this.readFileAsString('composer.json');
        var composerParse = JSON.parse(composerContents);
        delete composerParse.require['symfony/assetic-bundle'];
        var data = JSON.stringify(composerParse, null, 4);

        fse.deleteSync(this.templatePath('composer.json'));
        fs.writeFileSync('composer.json', data);
        done();
    },

    cleanConfig: function () {
        var done = this.async();

        var confDev = yaml.safeLoad(fs.readFileSync('app/config/config_dev.yml'));
        delete confDev.assetic;
        var newConfDev = yaml.dump(confDev, {indent: 4});
        fs.unlinkSync(this.destinationPath('app/config/config_dev.yml'));
        fs.writeFileSync('app/config/config_dev.yml', newConfDev);

        var conf = yaml.safeLoad(fs.readFileSync('app/config/config.yml'));
        delete conf.assetic;
        var newConf = yaml.dump(conf, {indent: 4});
        fs.unlinkSync(this.destinationPath('app/config/config.yml'));
        fs.writeFileSync('app/config/config.yml', newConf);

        fs.unlinkSync(this.destinationPath('app/config/routing.yml'));
        fse.copySync(this.templatePath('symfony/routing.yml'), 'app/config/routing.yml');

        fse.copySync(this.templatePath('symfony/config_node.yml'), 'app/config/config_node.yml');

        fs.unlinkSync(this.destinationPath('web/app.php'));
        fse.copySync(this.templatePath('symfony/app.php'), 'web/app.php');

        done();
    },

    /**
     * remove assetic
     */
    updateAppKernel: function () {
        var appKernelPath = 'app/AppKernel.php';
        var appKernelContents = this.readFileAsString(appKernelPath);

        var newAppKernelContents = appKernelContents.replace('new Symfony\\Bundle\\AsseticBundle\\AsseticBundle(),', '');
        newAppKernelContents = newAppKernelContents.replace('array(\'dev\', \'test\')', 'array(\'node\', \'dev\', \'test\')');
        fs.unlinkSync(appKernelPath);
        fs.writeFileSync(appKernelPath, newAppKernelContents);
    },

    updateParametersDist: function () {
        // update parameters.yml.dist
        var parametersDistPath = 'app/config/parameters.yml.dist';
        var parametersDistContents = this.readFileAsString(parametersDistPath);

        var newparametersDistContents = parametersDistContents.replace(/(database|mailer)_(.*):/g, '$1.$2:');

        fs.unlinkSync(parametersDistPath);
        fs.writeFileSync(parametersDistPath, newparametersDistContents);

        // update config.yml
        var configPath = 'app/config/config.yml';
        var configContent = this.readFileAsString(configPath);

        var newconfigContent = configContent.replace(/%(database|mailer)_(.*)%/g, '%$1.$2%');

        fs.unlinkSync(configPath);
        fs.writeFileSync(configPath, newconfigContent);
    },

    updateView: function () {
        var cb = this.async();

        fse.removeSync(this.destinationPath('app/Resources/views'));
        fse.mkdirsSync(this.destinationPath('app/Resources/views/controller/default'));

        // copy base template
        var templateContent = this.readFileAsString(this.templatePath('symfony/base.html.twig'));
        fs.writeFileSync('app/Resources/views/base.html.twig', this.engine(templateContent, this));


        // copy default action template
        var actionContent = this.readFileAsString(this.templatePath('symfony/index.html.twig'));
        fs.writeFileSync('app/Resources/views/controller/default/index.html.twig', this.engine(actionContent, this));


        fse.copySync(this.templatePath('img'), 'app/Resources/public/img/');


        cb();

    },

    updateController: function updateControler() {
        var controllerPath = 'src/AppBundle/Controller/DefaultController.php';
        if (fs.existsSync(controllerPath)) {
            fs.unlinkSync(controllerPath);
        }

        fse.copySync(this.templatePath('symfony/DefaultController.php'), controllerPath);

    },


    addScripts: function addScripts() {
        // copy scripts
        this.mkdir(this.destinationPath('app/Resources/public/scripts'));
        if (this.useRequirejs) {
            _.forEach(['app.js', 'main.js', 'config.js'], function (file) {
                fse.copySync(this.templatePath('scripts/requirejs/' + file), 'app/Resources/public/scripts/' + file);
            }, this);
        } else if (this.useJspm) {
            _.forEach(['main.js', 'config.js'], function (file) {
                var content = this.readFileAsString(this.templatePath('scripts/jspm/' + file));
                fs.writeFileSync(this.destinationPath('app/Resources/public/scripts/' + file), this.engine(content, this));
            }, this);
        }
    },


    addStyles: function addScripts() {
        // copy styles
        this.mkdir(this.destinationPath('app/Resources/public/styles'));
        var styles = [];
        if (this.useSass) {
            styles.push('main.scss');
        } else if (this.useLess) {
            styles.push('main.less');
        } else if (this.useStylus) {
            styles.push('main.styl');
        } else {
            styles.push('main.css');
        }

        _.forEach(styles, function (file) {
            // copy default action template
            var content = this.readFileAsString(this.templatePath('styles/' + file));
            fs.writeFileSync(this.destinationPath('app/Resources/public/styles/' + file), this.engine(content, this));
        }, this);
    },

    copyFonts: function copyFonts() {
        var dest = this.destinationPath('app/Resources/public/fonts');
        this.mkdir(dest);
        var src = this.destinationPath('bower_components');

        var fontpath = path.join(src, 'sass-bootstrap-glyphicons', 'fonts');

        if (this.useBootstrap) {
            if (this.useSass) {
                fontpath = path.join(src, 'bootstrap-sass-official', 'assets', 'fonts');
            } else if (this.useStylus) {
                fontpath = path.join(src, 'bootstrap-stylus', 'fonts');
            } else {
                fontpath = path.join(src, 'bootstrap', 'fonts');
            }
        }

        if (fs.existsSync(fontpath)) {
            fse.copySync(fontpath, dest);
        }
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

        this.checkJspm();
        this.checkComposer();
    },


    prompting: function () {
        var context = this;
        var done = this.async();

        /*     // set symfony repository and demoBundle option
         this.symfonyDistribution = this.symfonyDefaults;

         this.noFramework = false;
         this.useBootstrap = true;
         this.usePure = false;
         this.useFoundation = false;

         this.noPreprocessor = false;
         this.useLess = false;
         this.useSass = true;
         this.useStylus = false;
         this.includeLibSass = true;
         this.includeRubySass = false;

         this.useRequirejs = true;
         done(); return;
         */
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
        }, /* {
         type: 'confirm',
         name: 'symfonyAcme',
         message: 'Would you like to include the Acme/DemoBundle',
         default: false,
         when: this.showSymfonyRepo
         }, */{
            type: 'list',
            name: 'framework',
            message: function () {
                context.log('--------------------------------------------------------------------------------');
                return 'Would you like to include a CSS framework?';
            },
            choices: [
                {name: 'No Framework', value: 'noframework'},
                {name: 'Twitter Bootstrap', value: 'bootstrap', checked: true},
                {name: 'PureCSS + Suit', value: 'pure'},
                {name: 'Foundation', value: 'foundation'}
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
            when: function () {
                return this.globalJspm;
            }.bind(this),
            choices: [
                {name: 'RequireJS', value: 'requirejs', checked: true},
                {name: 'SystemJS (jspm)', value: 'jspm'}
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
            this.useRequirejs = !this.globalJspm || useLoader('requirejs');
            this.useJspm = this.globalJspm && useLoader('jspm');
            this.useBrowserify = useLoader('browserify');

            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            this.template('_package.json', 'package.json');
            this.template('Gruntfile.js', 'Gruntfile.js');

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
                bower.dependencies.suit = '~0.6.0';
                bower.dependencies.jquery = '~2.1.3';
            } else {
                bower.dependencies.jquery = '~2.1.3';
            }

            // add standalone glyphicons if bootstrap is not used
            if (!this.useBootstrap) {
                bower.dependencies['sass-bootstrap-glyphicons'] = '~1.0.0';
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


        //gitInit: function gitInit() {
        //    var cb = this.async();
        //    spawn('git', ['init']).on('exit', function () {
        //        cb();
        //    });
        //},

        /**
         * install symfony base system
         */
        symfonyBase: function symfonyBase() {
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
        }
    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install'],
            skipMessage: this.options['skip-install-message'],
            callback: function () {

                if (!this.options['skip-install']) {
                    this.log('Getting the composer dependencies');
                    if (this.globalComposer) {
                        this.spawnCommand('composer', ['install']);
                    } else {
                        this.spawnCommand('php', ['composer.phar', 'install']);
                    }

                    if (this.useJspm) {
                        this.log('Getting the jspm dependencies');
                        this.spawnCommand('jspm', ['install']);
                    }
                }
            }.bind(this)
        });
    },

    end: function () {
        this.cleanComposer();
        this.cleanConfig();
        this.updateController();
        this.updateAppKernel();
        this.updateParametersDist();
        this.updateView();


        this.addScripts();
        this.addStyles();

        // copy fonts
        if (!this.skipInstall) {
            this.copyFonts();
        }

        // add postinstall script here before Gruntfile is not available during initial bower install
        if (this.useRequirejs) {
            var bowerrc = fse.readJsonSync(this.destinationPath('.bowerrc'));
            bowerrc.scripts = {
                'postinstall': 'grunt bowerRequirejs'
            };
            fs.writeFileSync('.bowerrc', JSON.stringify(bowerrc, null, 2));
        }

        this.log('');
        this.log('I\'m finally all done. Run \'grunt serve\' to start your development server');
        this.log('');
    }
});
