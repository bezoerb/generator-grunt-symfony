<?php

use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Debug\Debug;


<% if (sfVersion < 3) { %> 
$loader = require_once __DIR__.'/../app/bootstrap.php.cache';
<% } else { %> 
/**
 * @var Composer\Autoload\ClassLoader
 */
$loader = require __DIR__.'/../app/autoload.php';
include_once __DIR__.'/../var/bootstrap.php.cache';
<% } %>

// Enable APC for autoloading to improve performance.
// You should change the ApcClassLoader first argument to a unique prefix
// in order to prevent cache key conflicts with other applications
// also using APC.
/*
$apcLoader = new ApcClassLoader(sha1(__FILE__), $loader);
$loader->unregister();
$apcLoader->register(true);
*/

$env = 'prod';
$debug = false;

// Override env by server env
// Depending on the SYMFONY_ENV environment variable, tells which environment should be taken
if (($servEnv = getenv("SYMFONY_ENV")) !== false) {
    $env = $servEnv;
}

// Overwrite $debug depending on the SYMFONY_DEBUG environment variable
if (($servDbg = getenv("SYMFONY_DEBUG")) !== false) {
    $debug = !!$servDbg;
}


if ($debug) {
    Debug::enable();
}

require_once __DIR__.'/../app/AppKernel.php';
//require_once __DIR__.'/../app/AppCache.php';


$kernel = new AppKernel($env, $debug);
$kernel->loadClassCache();
//$kernel = new AppCache($kernel);

// When using the HttpCache, you need to call the method in your front controller instead of relying on the configuration parameter
//Request::enableHttpMethodParameterOverride();
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
