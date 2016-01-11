# generator-grunt-symfony 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url] [![Download][dlcounter-image]][dlcounter-url]

This [Yeoman](http://yeoman.io) generator scaffolds a symfony app with full featured frontend tooling. 
Just scaffold your app, run `grunt serve` and you are ready to go. 

![The Team](https://raw.github.com/bezoerb/generator-grunt-symfony/master/app/templates/img/yo-grunt-bower-symfony.png)

## Features
* Symfony framework
* Twig templating engine
* Assetic removed
* Browsersync dev/prod server with livereload
* Choose the CSS preprocessor which fits your needs
  - [Sass](http://sass-lang.com/)
  - [Less](http://lesscss.org)
  - [Stylus](http://learnboost.github.io/stylus/)
  - or no preprocessor at all
* Choose CSS Framework
  * [uikit](http://getuikit.com)  
  * [Bootstrap](http://getbootstrap.com)
  * [Foundation](http://foundation.zurb.com)
  * [inuitcss](http://inuitcss.com) (sass only)
  * no framework?
* Choose Javascript module loader
  * [RequireJS](http://requirejs.org/)
  * [JSPM](http://jspm.io/) + [SystemJS](https://github.com/systemjs/systemjs) (ES6)
  * [Webpack](https://webpack.github.io/) (ES6)
* File revving
* Image optimization
* [Critical](https://github.com/addyosmani/critical) (Extract & Inline Critical-path CSS) 
* [uncss](https://github.com/addyosmani/grunt-uncss) (Automatically strip off unused css)
* Service Worker
* Organized Gruntfile with [load-grunt-config](http://firstandthird.github.io/load-grunt-config)
* Preconfigured testing Stack: [Karma](http://karma-runner.github.io/0.12/index.html), [Mocha](http://mochajs.org/) & [Chai](http://chaijs.com/)
* Phpunit 


## Things to come

  * Feel free to add feature requests ;)

## Getting Started

Install dependencies
```bash
npm install -g yo grunt bower
```
To install generator-grunt-symfony from npm, run:
```bash
npm install -g generator-grunt-symfony
```

Finally, initiate the generator:

```bash
yo grunt-symfony
```

### Environments
The browsersync server uses it's own symfony environment to prevent asset loading conflicts with the environment loaded via apache2. 

### Directory structure
The directory structure is based on the [Symfony Best Practices](http://symfony.com/doc/current/best_practices/index.html)
#### Dev
* Assets are located in `app/Resources/public` 
* Templates can be found in `app/Resources/views` 

#### Production
* All production assets are located in the `web` folder.
* 
Run `grunt build` to compile, optimize and rev your assets for production.

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

### Changelog

See [History.md](History.md)

## License

MIT

[npm-url]: https://npmjs.org/package/generator-grunt-symfony
[npm-image]: https://badge.fury.io/js/generator-grunt-symfony.svg

[travis-url]: https://travis-ci.org/bezoerb/generator-grunt-symfony
[travis-image]: https://secure.travis-ci.org/bezoerb/generator-grunt-symfony.svg?branch=master

[depstat-url]: https://david-dm.org/bezoerb/generator-grunt-symfony
[depstat-image]: https://david-dm.org/bezoerb/generator-grunt-symfony.svg

[dlcounter-url]: https://www.npmjs.com/package/generator-grunt-symfony
[dlcounter-image]: https://img.shields.io/npm/dm/generator-grunt-symfony.svg
