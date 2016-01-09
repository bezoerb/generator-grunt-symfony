'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var os = require('os');
var fs = require('fs');
var _ = require('lodash');
var updateNotifier = require('update-notifier');
var stringLength = require('string-length');
var path = require('path');
var exec = require('child_process').exec;
var yaml = require('js-yaml');
var readFileAsString = require("html-wiring").readFileAsString;
var fse = require('fs-extra');


var AppGenerator = yeoman.Base.extend({

    /**
     * Check for installed composer and prompt for installing composer locally if not found
     */
    checkComposer: function checkComposer() {
        var cb = this.async();
        // Check if composer is installed globally
        this.globalComposer = false;
        exec('composer', ['-V'], function (error) {
            if (error !== null && os.platform() !== 'win32') {
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
                    } else {
                        process.exit(1);
                    }
                }.bind(this));
            } else if (error !== null) {
                this.log('WARNING: No global composer installation found. Go to https://getcomposer.org/download/ and install first.');
                process.exit(1);
            } else {
                this.globalComposer = true;
                cb();
            }
        }.bind(this));
    },

    composer: function (args, cb) {
        if (!_.isFunction(cb)) {
            cb = function () {
            };
        }

        var cmd = 'composer';
        if (!this.globalComposer) {
            args.unshift('composer.phar');
            cmd = 'php';
        }
        return this.spawnCommand(cmd, args, {}).on('error', cb).on('exit', cb);
    },

    jspm: function (args, cb, options) {
        if (!_.isFunction(cb)) {
            cb = function () {
            };
        }

        return this.spawnCommand('node_modules/.bin/jspm', args, options || {}).on('error', cb).on('exit', cb);
    },


    /**
     * Check for installed git
     */
    checkGit: function checkGit() {
        // Check if jspm is installed globally
        this.globalGit = false;
        this.spawnCommand('git', ['--version'], {stdio: 'ignore'}).on('exit', function () {
            this.globalGit = true;
        }.bind(this)).on('error', function () {
            this.globalGit = false;
        }.bind(this));
    },

    jspmInstall: function jspmInstall(cb) {
        if (this.useJspm) {
            this.log('');
            this.log('Running ' + chalk.bold.yellow('jspm install') + ' for you to install the required dependencies.');
            this.jspm(['install'], cb);
        } else {
            cb();
        }
    },

    composerUpdate: function composerUpdate(cb) {
        this.log('');
        this.log('Running ' + chalk.bold.yellow('composer update') + ' for you to install the required dependencies.');
        this.composer(['update'], cb || function () {
            });
    },

    /**
     * Set up permissions
     * see: http://symfony.com/doc/current/book/installation.html#book-installation-permissions
     * @param cb
     */
    setupPermissions: function setupPermissions(cb) {
        if (!cb) {
            cb = function () {
            };
        }
        var folder = this.sfVersion >= 3 ? 'var' : 'app';

        this.log(os.EOL + 'Set up permissions for ' + chalk.cyan(folder + '/cache') + ' and ' + chalk.cyan(folder + '/logs') + '.');

        var acl = {
            // Use ACL on a system that does support chmod +a
            chmod: [
                'HTTPDUSER=`ps aux | grep -E \'[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx\' | grep -v root | head -1 | cut -d\\  -f1`',
                'chmod +a "$HTTPDUSER allow delete,write,append,file_inherit,directory_inherit" ' + folder + '/cache ' + folder + '/logs',
                'chmod +a "`whoami` allow delete,write,append,file_inherit,directory_inherit" ' + folder + '/cache ' + folder + '/logs'
            ],

            // Use ACL on a system that does not support chmod +a
            setfacl: [
                'HTTPDUSER=`ps aux | grep -E \'[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx\' | grep -v root | head -1 | cut -d\\  -f1`',
                'setfacl -R -m u:"$HTTPDUSER":rwX -m u:`whoami`:rwX ' + folder + '/cache ' + folder + '/logs',
                'setfacl -dR -m u:"$HTTPDUSER":rwX -m u:`whoami`:rwX ' + folder + '/cache ' + folder + '/logs'
            ]
        };


        exec(acl.chmod.join(';'), [], function (err, stdout, stderr) {
            if (!err) {
                return cb();
            } else if (/not\spermitted/.test(stderr)) {
                this.log(chalk.bold.red('Warning: ') + 'I failed setting the folder permissions. Run the following command as admin as soon as i\'m done:');
                this.log(chalk.yellow(acl.chmod.join(os.EOL)));
                this.log('');
                return cb();
            }

            exec(acl.setfacl.join(';'), [], function (err, stdout, stderr) {
                if (!err) {
                    return cb();
                } else if (/not\spermitted/.test(stderr)) {
                    this.log(chalk.bold.red('Warning: ') + 'I failed setting the folder permissions. Run the following command as admin as soon as i\'m done:');
                    this.log(chalk.yellow(acl.setfacl.join(os.EOL)));
                    this.log('');
                    return cb();
                }

                this.log('Your system doesn\'t support ACL. Setting permissions via ' + chalk.bold.yellow('umask'));
                this.log('See: http://symfony.com/doc/current/book/installation.html#book-installation-permissions');

                // Without using ACL
                var consoleContents = readFileAsString('app/console').replace('<?php', '<?php' + os.EOL + 'umask(0002);');
                fse.outputFileSync('app/console', consoleContents);

                var appContents = readFileAsString('web/app.php').replace('<?php', '<?php' + os.EOL + 'umask(0002);');
                fse.outputFileSync('web/app.php', appContents);

                var appDevContents = readFileAsString('web/app_dev.php').replace('<?php', '<?php' + os.EOL + 'umask(0002);');
                fse.outputFileSync('web/app_dev.php', appDevContents);

                cb();

            }.bind(this));

        }.bind(this));
    },


    /**
     * show custom repo if applicable
     * @param answers
     * @returns {boolean} true
     */
    showSymfonyRepo: function getRepo(answers) {
        var custom = !_.result(answers, 'symfonyStandard');

        if (custom) {
            var repo = 'https://github.com/' +
                _.result(answers, 'symfonyUsername') +
                '/' +
                _.result(answers, 'symfonyRepository') +
                '/tree/' +
                _.result(answers, 'symfonyCommit');

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

        this.sfVersion = parseFloat(this.symfonyDistribution.commit);
    },


    /**
     * Update symfony config
     *
     *  - remove assetic configuration
     *  - update parameters to use proposed dot notation
     *    @see http://symfony.com/doc/current/cookbook/configuration/external_parameters.html
     */
    updateConfig: function () {
        // remove assetic from config_dev.yml
        var configDevSource = fs.readFileSync('app/config/config_dev.yml', 'utf8').replace(/\[([^"']+)\]/igm, '["$1"]');
        var confDev = yaml.safeLoad(configDevSource);
        delete confDev.assetic;
        var newConfDev = yaml.dump(confDev, {indent: 4});
        fs.unlinkSync(this.destinationPath('app/config/config_dev.yml'));
        fs.writeFileSync('app/config/config_dev.yml', newConfDev);

        // remove assetic from config_yml
        var conf = yaml.safeLoad(fs.readFileSync('app/config/config.yml'));
        delete conf.assetic;
        var newConf = yaml.dump(conf, {indent: 4});

        // change parameter names to use dot notation
        newConf = newConf.replace(/%(database|mailer)_(.*)%/g, '%$1.$2%');
        fs.unlinkSync(this.destinationPath('app/config/config.yml'));
        fs.writeFileSync('app/config/config.yml', newConf);

        // update routing
        fs.unlinkSync(this.destinationPath('app/config/routing.yml'));
        fse.copySync(this.templatePath('symfony/routing.yml'), 'app/config/routing.yml');

        // add node environment for browsersync
        fse.copySync(this.templatePath('symfony/config_node.yml'), 'app/config/config_node.yml');
    },

    /**
     * update parameters.yml.dist to use dot notation
     */
    updateParameters: function updateParameters() {
        var parametersDistPath = 'app/config/parameters.yml.dist';
        var parametersDistContents = readFileAsString(parametersDistPath);
        var newparametersDistContents = parametersDistContents.replace(/(database|mailer)_(.*):/g, '$1.$2:');
        fs.unlinkSync(parametersDistPath);
        fs.writeFileSync(parametersDistPath, newparametersDistContents);
    },

    /**
     * update app.php to consider environment variables SYMFONY_ENV and SYMFONY_DEBUG
     */
    updateApp: function updateApp() {
        fs.unlinkSync(this.destinationPath('web/app.php'));
        this.fs.copyTpl(
            this.templatePath('symfony/app.php'),
            this.destinationPath('web/app.php'),
            this
        );
    },

    /**
     * Update AppKernel
     *
     *  - remove assetic
     *  - add "node" as dev environment
     *
     * see http://symfony.com/doc/current/best_practices/web-assets.html
     */
    updateAppKernel: function updateAppKernel() {
        function addBundle(contents, str) {
            return contents.replace(/(\$bundles\s*=\s.*\n(?:[^;]*\n)+)/, '$&            ' + str + '\n');
        }


        var appKernelPath = 'app/AppKernel.php';
        var appKernelContents = readFileAsString(appKernelPath);

        var newAppKernelContents = appKernelContents.replace('new Symfony\\Bundle\\AsseticBundle\\AsseticBundle(),', '');
        newAppKernelContents = newAppKernelContents.replace('array(\'dev\', \'test\')', 'array(\'node\', \'dev\', \'test\')');

        // add bundle
        newAppKernelContents = addBundle(newAppKernelContents, 'new Zoerb\\Bundle\\FilerevBundle\\ZoerbFilerevBundle(),');
        fs.unlinkSync(appKernelPath);
        fs.writeFileSync(appKernelPath, newAppKernelContents);
    },

    /**
     * Set template directories and templates
     */
    updateView: function updateView() {
        fse.removeSync(this.destinationPath('app/Resources/views'));
        fse.mkdirsSync(this.destinationPath('app/Resources/views/controller/default'));

        // copy base template
        this.fs.copyTpl(
            this.templatePath('symfony/base.html.twig'),
            this.destinationPath('app/Resources/views/base.html.twig'),
            this
        );
        //var templateContent = readFileAsString(this.templatePath('symfony/base.html.twig'));
        //fs.writeFileSync('app/Resources/views/base.html.twig', this.engine(templateContent, this));


        // copy default action template
        //var actionContent = readFileAsString(this.templatePath('symfony/index.html.twig'));
        //fs.writeFileSync('app/Resources/views/controller/default/index.html.twig', this.engine(actionContent, this));
        this.fs.copyTpl(
            this.templatePath('symfony/index.html.twig'),
            this.destinationPath('app/Resources/views/controller/default/index.html.twig'),
            this
        );

        fse.copySync(this.templatePath('img'), 'app/Resources/public/img/');
    },

    /**
     * update default controller to use own template
     */
    updateController: function updateControler() {
        var controllerPath = 'src/AppBundle/Controller/DefaultController.php';
        if (fs.existsSync(controllerPath)) {
            fs.unlinkSync(controllerPath);
        }

        fse.copySync(this.templatePath('symfony/DefaultController.php'), controllerPath);
    },

    /**
     * update default controller test to use own template
     */
    updateControllerTest: function updateControllerTest() {


        var controllerPath = this.sfVersion < 3 ?
            'src/AppBundle/Tests/Controller/DefaultControllerTest.php' : 'tests/AppBundle/Controller/DefaultControllerTest.php';
        if (fs.existsSync(controllerPath)) {
            fs.unlinkSync(controllerPath);
        }

        this.fs.copyTpl(
            this.templatePath('symfony/DefaultControllerTest.php'),
            this.destinationPath(controllerPath),
            this
        );

    },


    /**
     * Add scripts and init jspm if applicable
     */
    addScripts: function addScripts() {
        // copy scripts
        fse.mkdirsSync(this.destinationPath('app/Resources/public/scripts/modules'));
        var files = [];
        var folder = '';
        if (this.useRequirejs) {
            files = ['app.js', 'config.js', 'main.js', 'modules/dummy.js', 'modules/service-worker.js'];
            folder = 'requirejs';
        } else if (this.useJspm) {
            files = ['config.js', 'main.js', 'modules/dummy.js', 'modules/service-worker.js'];
            folder = 'jspm';
        } else if (this.useWebpack) {
            files = ['main.js', 'modules/dummy.js', 'modules/service-worker.js'];
            folder = 'webpack';
        }

        _.forEach(files, function (file) {
            //var content = readFileAsString(this.templatePath('scripts/requirejs/' + file));
            //fs.writeFileSync(this.destinationPath('app/Resources/public/scripts/' + file), this.engine(content, this));
            this.fs.copyTpl(
                this.templatePath(path.join('scripts', folder, file)),
                this.destinationPath('app/Resources/public/scripts/' + file),
                this
            );
        }, this);

        this.fs.copyTpl(
            this.templatePath('scripts/sw/runtime-caching.js'),
            this.destinationPath('app/Resources/public/scripts/sw/runtime-caching.js'),
            this
        );

        fse.copySync(this.templatePath('scripts/sw/service-worker.js'), this.destinationPath('app/Resources/public/service-worker.js'));

    },

    addStyles: function addScripts() {
        // copy styles
        if (this.useInuit) {
            fse.copySync(this.templatePath('styles/inuit'), this.destinationPath('app/Resources/public/styles'))
        } else {
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
            fse.mkdirsSync(this.destinationPath('app/Resources/public/styles'));
            _.forEach(styles, function (file) {
                // copy default action template
                //var content = readFileAsString(this.templatePath('styles/' + file));
                //fs.writeFileSync(this.destinationPath('app/Resources/public/styles/' + file), this.engine(content, this));
                this.fs.copyTpl(
                    this.templatePath('styles/' + file),
                    this.destinationPath('app/Resources/public/styles/' + file),
                    this
                );
            }, this);
        }
    },

    copyFonts: function copyFonts() {
        var dest = this.destinationPath('app/Resources/public/fonts');
        fse.mkdirsSync(dest);
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
        } else if (this.useUikit) {
            fontpath = path.join(src, 'uikit', 'fonts');
        }

        if (fs.existsSync(fontpath)) {
            fse.copySync(fontpath, dest);
        }
    },

    /**
     * remove assetic
     */
    updateComposerJson: function () {
        var composerContents = readFileAsString('composer.json');
        var composerParse = JSON.parse(composerContents);

        // remove assetic
        delete composerParse.require['symfony/assetic-bundle'];

        // add filerev bundle
        if (this.sfVersion >= 2.7) {
            composerParse.require['zoerb/filerevbundle'] = '~1.0.1';
        } else {
            composerParse.require['zoerb/filerevbundle'] = '~0.1.2';
        }

        // add phpunit
        composerParse['require-dev'] = _.assign(composerParse['require-dev'] || {}, {'phpunit/phpunit': '~4.6'});

        var data = JSON.stringify(composerParse, null, 4);

        fse.removeSync(this.templatePath('composer.json'));
        fs.writeFileSync('composer.json', data);
    },

    updateGitignore: function updateGitignore() {
        //var gitignore = readFileAsString(this.templatePath('gitignore'));
        fs.unlinkSync(this.destinationPath('.gitignore'));
        //fs.writeFileSync(this.destinationPath('.gitignore'), this.engine(gitignore, this));
        this.fs.copyTpl(
            this.destinationPath('.gitignore'),
            this.destinationPath('.gitignore'),
            this
        );
    }
});


module.exports = AppGenerator.extend({
    initializing: function () {
        this.pkg = require('../package.json');

        // Defaults
        this.symfonyDefaults = {
            username: 'symfony',
            repository: 'symfony-standard',
            commit: '2.7'
        };


        var message = ['Welcome to the ' + chalk.bold.yellow('Grunt Symfony') + ' generator!'];
        if (this.options['update-notifier'] !== false) {
            var notifier = updateNotifier({pkg: this.pkg});

            if (notifier.update) {
                message.push('------------------------------------------');
                message.push('Update available: ' + chalk.green.bold(notifier.update.latest) + chalk.gray(' (current: ' + notifier.update.current + ')'));
                message.push('Run ' + chalk.magenta('npm install -g ' + this.pkg.name) + ' to update.');
            }
        }

        // Have Yeoman greet the user.
        if (!this.options['skip-welcome-message']) {
            this.log(yosay(
                message.join(' '), {maxLength: stringLength(message[Math.min(message.length - 1, 1)])}
            ));
        }

        this.checkGit();
        this.checkComposer();
    },


    prompting: function () {
        var done = this.async();

        var symfonyCustom = function (answers) {
            return !_.result(answers, 'symfonyStandard');
        };

        var hasGit = function () {
            return this.globalGit;
        }.bind(this);

        function hasFeature(answers, group, feature) {
            var val = _.result(answers, group);
            return typeof feature !== 'undefined' && (val === feature || _.isArray(val) && _.indexOf(val, feature) !== -1);
        }


        var useSass = function (answers) {
            return hasFeature(answers, 'preprocessor', 'sass');
        };

        var dontUseSass = function (answers) {
            return !hasFeature(answers, 'preprocessor', 'sass');
        };


        var prompts = [{
            type: 'confirm',
            name: 'symfonyStandard',
            message: 'Would you like to use the Symfony "Standard Edition ' + this.symfonyDefaults.commit + '" distribution',
            default: true
        }, {
            type: 'input',
            name: 'symfonyUsername',
            message: function () {
                this.log('--------------------------------------------------------------------------------');
                this.log('Please provide GitHub details of the Symfony distribution you would like to use.');
                this.log('e.g. http://github.com/[username]/[repository]/tree/[commit].');
                this.log('--------------------------------------------------------------------------------');
                return 'Username';
            }.bind(this),
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
            type: 'list',
            name: 'preprocessor',
            message: function () {
                this.log('--------------------------------------------------------------------------------');
                return 'Would you like to use a CSS preprocessor?';
            }.bind(this),
            choices: [
                {name: 'Sass', value: 'sass'},
                {name: 'Less', value: 'less'},
                {name: 'Stylus', value: 'stylus'},
                {name: 'No Preprocessor', value: 'nopreprocessor'}
            ]
        }, {
            when: useSass,
            type: 'confirm',
            name: 'libsass',
            value: 'uselibsass',
            message: 'Would you like to use libsass? Read up more at' + os.EOL +
            chalk.green('https://github.com/andrew/node-sass#node-sass'),
            default: true
        }, {
            when: useSass,
            type: 'list',
            name: 'framework',
            message: 'Would you like to include a CSS framework?',
            choices: [
                {name: 'UIkit', value: 'uikit'},
                {name: 'Twitter Bootstrap', value: 'bootstrap', checked: true},
                {name: 'Foundation', value: 'foundation'},
                {name: 'Inuit CSS', value: 'inuit'},
                {name: 'No Framework', value: 'noframework'}
            ]
        }, {
            when: dontUseSass,
            type: 'list',
            name: 'framework',
            message: 'Would you like to include a CSS framework?',
            choices: [
                {name: 'UIkit', value: 'uikit'},
                {name: 'Twitter Bootstrap', value: 'bootstrap', checked: true},
                {name: 'Foundation', value: 'foundation'},
                {name: 'No Framework', value: 'noframework'}
            ]
        }, {
            type: 'list',
            name: 'loader',
            message: 'Which module loader would you like to use?',
            choices: [
                {name: 'SystemJS (jspm)', value: 'jspm'},
                {name: 'Webpack (babel)', value: 'webpack'},
                {name: 'RequireJS', value: 'requirejs'}
            ]
        }, {
            type: 'checkbox',
            name: 'additional',
            message: 'Which additional plugins should i integrate for you?',
            choices: [
                {value: 'uncss', name: 'UnCSS - A grunt task for removing unused CSS', checked: true},
                {value: 'critical', name: 'Critical - Extract & Inline Critical-path CSS', checked: true}
            ]
        }, {
            when: hasGit,
            type: 'confirm',
            name: 'initGit',
            value: 'initGit',
            message: 'Would you like to enable Git for this project?',
            default: false
        }];

        this.prompt(prompts, function (props) {
            var has = _.partial(hasFeature, props);

            // set symfony repository and demoBundle option
            this.setSymfonyDistribution(props);

            var useFramework = _.partial(has, 'framework');
            this.noFramework = useFramework('noframework');
            this.useBootstrap = useFramework('bootstrap');
            this.usePure = useFramework('pure');
            this.useInuit = useFramework('inuit');
            this.useFoundation = useFramework('foundation');
            this.useUikit = useFramework('uikit');

            var usePreprocessor = _.partial(has, 'preprocessor');
            this.noPreprocessor = usePreprocessor('nopreprocessor');
            this.useLess = usePreprocessor('less');
            this.useSass = usePreprocessor('sass');
            this.useStylus = usePreprocessor('stylus');
            this.includeLibSass = this.useSass && props.libsass;
            this.includeRubySass = this.useSass && !props.libsass;

            var useLoader = _.partial(has, 'loader');
            this.useRequirejs = useLoader('requirejs');
            this.useJspm = useLoader('jspm');
            this.useWebpack = useLoader('webpack');
            this.useBrowserify = useLoader('browserify');


            var hasAdditional = _.partial(has, 'additional');
            this.useCritical = hasAdditional('critical');
            this.useUncss = hasAdditional('uncss');

            this.useGit = !!props.initGit;
            this.loadGruntConfig = true;//!!props.loadGruntConfig;

            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                _.assign(this, {safeProjectName: _.camelCase(this.appname)})
            );
            //    this.template('_package.json', 'package.json');

            var bower = {
                name: _.camelCase(this.appname),
                private: true,
                dependencies: {}
            };

            if (this.useBootstrap) {
                var bs = 'bootstrap';
                if (this.useSass) {
                    bs += '-sass-official';
                }
                bower.dependencies[bs] = '~3.3.0';
                if (this.useStylus) {
                    bs += '-stylus';
                    bower.dependencies[bs] = '~4.0.0';
                }
            } else if (this.useFoundation) {
                bower.dependencies.foundation = '~5.5.1';
                bower.dependencies.jquery = '~2.1.3';
            } else if (this.usePure) {
                bower.dependencies.pure = '~0.5.0';
                bower.dependencies.suit = '~0.6.0';
                bower.dependencies.jquery = '~2.1.3';
            } else if (this.useUikit) {
                bower.dependencies.uikit = '~2.18.0';
            } else if (this.useInuit) {
                bower.dependencies['inuit-starter-kit'] = '~0.2.9';
                bower.dependencies['inuit-widths'] = '~0.4.2';
                bower.dependencies['inuit-clearfix'] = '~0.2.2';
                bower.dependencies['inuit-layout'] = '~0.3.2';
                bower.dependencies['inuit-spacing'] = '~0.7.0';
                bower.dependencies['inuit-images'] = '~0.3.3';
                bower.dependencies['inuit-reset'] = '~0.1.1';
                bower.dependencies['inuit-headings'] = '~0.3.1';
                bower.dependencies['inuit-media'] = '~0.4.2';
                bower.dependencies['inuit-shared'] = '~0.1.5';
                bower.dependencies['inuit-box'] = '~0.4.4';
                bower.dependencies['inuit-buttons'] = '~0.4.2';
                bower.dependencies['inuit-lists'] = '~0.1.0';
                bower.dependencies['inuit-responsive-tools'] = '~0.1.3';
                bower.dependencies['inuit-flag'] = '~0.3.2';
                bower.dependencies['inuit-widths-responsive'] = '~0.2.2';
                bower.dependencies['inuit-paragraphs'] = '~0.1.4';
                bower.dependencies['inuit-tables'] = '~0.2.1';
                bower.dependencies['inuit-tabs'] = '~0.2.1';
                bower.dependencies['inuit-list-inline'] = '~0.3.2';
                bower.dependencies['inuit-list-ui'] = '~0.4.1';

            } else {
                bower.dependencies.jquery = '~2.1.3';
            }

            // add standalone glyphicons if bootstrap is not used
            if (!this.useBootstrap && !this.useUikit) {
                bower.dependencies['sass-bootstrap-glyphicons'] = '~1.0.0';
            }

            if (this.useRequirejs) {
                bower.dependencies.requirejs = '2.1.15';
                bower.dependencies.almond = '~0.3.0';
                bower.dependencies['visionmedia-debug'] = '~2.2.0';
            }

            bower.dependencies.picturefill = '~3.0.1';
            bower.dependencies.modernizr = '~2.8.3';

            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc')
            );
            this.write('bower.json', JSON.stringify(bower, null, 2));
        },

        grunt: function () {
            if (!this.loadGruntConfig) {
                this.template('Gruntfile.js', 'Gruntfile.js');
            } else {
                this.template('Gruntfile.slim.js', 'Gruntfile.js');
                fse.mkdirsSync(this.destinationPath('grunt'));

                // first all basic tasks for every configuration
                this.template('grunt/aliases.js', 'grunt/aliases.js');
                this.template('grunt/clean.js', 'grunt/clean.js');
                this.template('grunt/watch.js', 'grunt/watch.js');
                this.template('grunt/autoprefixer.js', 'grunt/autoprefixer.js');
                this.template('grunt/cssmin.js', 'grunt/cssmin.js');
                this.template('grunt/copy.js', 'grunt/copy.js');
                this.template('grunt/exec.js', 'grunt/exec.js');
                this.template('grunt/filerev.js', 'grunt/filerev.js');
                this.template('grunt/usemin.js', 'grunt/usemin.js');
                this.template('grunt/eslint.js', 'grunt/eslint.js');
                this.template('grunt/imagemin.js', 'grunt/imagemin.js');
                this.template('grunt/svgmin.js', 'grunt/svgmin.js');
                this.template('grunt/browserSync.js', 'grunt/browserSync.js');
                this.template('grunt/phpunit.js', 'grunt/phpunit.js');
                this.template('grunt/availabletasks.js', 'grunt/availabletasks.js');
                this.template('grunt/sw-precache.js', 'grunt/sw-precache.js');

                // css
                if (this.noPreprocessor) {
                    this.template('grunt/concat.js', 'grunt/concat.js');
                } else if (this.useSass) {
                    this.template('grunt/sass.js', 'grunt/sass.js');
                } else if (this.useLess) {
                    this.template('grunt/less.js', 'grunt/less.js');
                } else if (this.useStylus) {
                    this.template('grunt/stylus.js', 'grunt/stylus.js');
                }

                if (this.useCritical || this.useUncss) {
                    this.template('grunt/connect.js', 'grunt/connect.js');
                    this.template('grunt/http.js', 'grunt/http.js');
                }
                if (this.useCritical) {
                    this.template('grunt/uncss.js', 'grunt/uncss.js');
                }
                if (this.useCritical) {
                    this.template('grunt/critical.js', 'grunt/critical.js');
                }

                // js
                this.template('grunt/karma.js', 'grunt/karma.js');
                if (this.useRequirejs) {
                    this.template('grunt/wiredep.js', 'grunt/wiredep.js');
                    this.template('grunt/bowerRequirejs.js', 'grunt/bowerRequirejs.js');
                    this.template('grunt/requirejs.js', 'grunt/requirejs.js');
                } else if (this.useJspm) {
                    this.template('grunt/uglify.js', 'grunt/uglify.js');
                } else if (this.useWebpack) {
                    this.template('grunt/webpack.js', 'grunt/webpack.js');
                    this.template('webpack.config.js', 'webpack.config.js');
                }
            }
        },

        projectfiles: function () {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );

            this.template('eslintrc', '.eslintrc');
            this.template('jscsrc', '.jscsrc');
        },

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
        },

        testFiles: function () {
            var dest = 'tests/Frontend';
            if (this.useRequirejs) {
                fse.copySync(
                    this.templatePath(path.join('test', 'requirejs', 'spec')),
                    this.destinationPath(path.join(dest, 'spec'))
                );
                fse.copySync(this.templatePath(path.join('test', 'requirejs', 'karma.conf.js')), this.destinationPath(path.join(dest, 'karma.conf.js')));
                this.template(path.join('test', 'requirejs', 'test-main.js'), path.join(dest, 'test-main.js'));
            } else if (this.useJspm) {
                fse.copySync(
                    this.templatePath(path.join('test', 'jspm')),
                    this.destinationPath(dest)
                );
            } else if (this.useWebpack) {
                fse.copySync(
                    this.templatePath(path.join('test', 'webpack')),
                    this.destinationPath(dest)
                );
            }


        },

        gitInit: function gitInit() {
            if (this.useGit) {
                var done = this.async();
                this.spawnCommand('git', ['init']).on('exit', function () {
                    this.template('hooks/post-merge', '.git/hooks/post-merge');
                    done();
                }.bind(this));
            }
        }
    },

    install: function () {
        this.addScripts();
        this.addStyles();
        this.updateGitignore();
        this.updateConfig();
        this.updateParameters();
        this.updateController();
        this.updateControllerTest();
        this.updateView();
        this.updateAppKernel();
        this.updateApp();

        this.updateComposerJson();


        this.installDependencies({
            skipInstall: this.options['skip-install'],
            skipMessage: this.options['skip-install-message'] || this.options['skip-install'],
            callback: function () {
                if (!this.options['skip-install']) {


                    this.jspmInstall(function () {
                        this.composerUpdate(function () {
                            if (!this.options['skip-install-message']) {
                                this.log('');
                                this.log('I\'m finally all done. Run ' + chalk.bold.green('grunt serve') + ' to start your development server or ' + chalk.bold.green('grunt serve:dist') + ' to check your prod environment.');
                                this.log('Run ' + chalk.bold.green('grunt build') + ' to prepare your assets before running your site on a standard webserver like apache or nginx.');
                                this.log('Run ' + chalk.bold.green('grunt') + ' to see your available grunt tasks.');
                                this.log('');
                            }
                        }.bind(this));
                    }.bind(this));

                } else if (!this.options['skip-install-message']) {
                    this.log('');
                    this.log('I\'m all done. Just run ' + chalk.bold.yellow('npm install && bower install &&' + ((this.useJspm) ? ' jspm install &&' : '') + ' composer update') + '  to install the required dependencies.');
                    this.log('');
                }
            }.bind(this)
        });
    },

    end: function () {

        this.setupPermissions();

        // copy fonts
        if (!this.skipInstall) {
            this.copyFonts();
        }

        if (this.useGit) {
            fs.chmodSync(this.destinationPath('.git/hooks/post-merge'), '0755');
        }

        // add postinstall script here before Gruntfile is not available during initial bower install
        if (this.useRequirejs) {
            var bowerrc = fse.readJsonSync(this.destinationPath('.bowerrc'));
            bowerrc.scripts = {
                'postinstall': 'grunt bowerRequirejs'
            };
            fs.writeFileSync('.bowerrc', JSON.stringify(bowerrc, null, 2));
            this.spawnCommand('grunt', ['bowerRequirejs'], {stdio: 'ignore'}).on('error', function (err) {
                this.log(err);
            }.bind(this));

        }
    }
});
