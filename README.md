# generator-grunt-symfony [![Build Status](https://secure.travis-ci.org/bezoerb/generator-grunt-symfony.png?branch=master)](https://travis-ci.org/bezoerb/generator-grunt-symfony)

This [Yeoman](http://yeoman.io) generator scaffolds a symfony2 app with full featured frontend tooling. 
Just scaffold your app, run `grunt serve` and you are ready to go. 

![The Team](https://raw.github.com/bezoerb/generator-grunt-symfony/master/app/templates/img/yo-grunt-bower-symfony.png)

## Features
* Symfony2 framework
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
  * [PureCSS](http://purecss.io) + [Suit](https://suitcss.github.io)
  * no framework?
* Choose Javascript module loader
  * [RequireJS](http://requirejs.org/)
  * [JSPM](http://jspm.io/) + [SystemJS](https://github.com/systemjs/systemjs) (ES6)
* File revving
* Image optimization
* [Critical](https://github.com/addyosmani/critical) (Extract & Inline Critical-path CSS) 
* Organize your Gruntfile with [load-grunt-config](http://firstandthird.github.io/load-grunt-config) or keep everything in place

## Things to come
* Optimize your assets with
  * [uncss](https://github.com/addyosmani/grunt-uncss) (automatically strip off unused css)
  * phpunit
  * js testsuite 
  * ... feel free to add feature requests ;)

## Getting Started

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
