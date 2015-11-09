<?php

/**
 * Copyright (c) 2015 Ben Zörb
 * Licensed under the MIT license.
 * http://bezoerb.mit-license.org/
 */


namespace Utils\GruntBundle\Templating\Asset;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Config\FileLocator;

/**
 * The path packages adds a version and a base path to asset URLs for use with node's filerev .
 *
 * @author Ben Zörb <ben@sommerlaune.com>
 */
class PathPackage extends BasePackage
{
    /**
     * Asset base
     *
     * @var string
     */
    private $basePath;


    /**
     * Constructor.
     *
     * @param Request $request     The base path to be prepended to relative paths
     * @param string  $rootDir     The asset root directory
     * @param string  $summaryFile Grunt filerev summary file
     * @param string  $cacheDir    Kernel cache dir
     * @param string  $debug       Debug?
     */
    public function __construct($basePath, $rootDir, $summaryFile, $cacheDir, $debug)
    {
        parent::__construct($rootDir, $summaryFile, $cacheDir, $debug);

        if (!$basePath) {
            $this->basePath = '/';
        } else {
            if ('/' != $basePath[0]) {
                $basePath = '/' . $basePath;
            }

            $this->basePath = rtrim($basePath, '/') . '/';
        }
    }

    /**
     * Applies version to the supplied path.
     *
     * @param string           $path    A path
     * @param string|bool|null $version A specific version
     *
     * @return string The versionized path
     */
    protected function applyVersion($path, $version = null)
    {
        $file = $path;
        // apply the base path
        if ('/' !== substr($path, 0, 1)) {
            $file = $this->basePath . $path;
        }

        $reved = $this->getRevedFilename($file);

        $fullpath = $this->rootDir . $file;
        $fullreved = $this->rootDir . $reved;

        // $reved or unversioned
        if (file_exists($fullreved)) {
            return $reved;

            // fallback
        } else {
            $pattern = preg_replace('/\.([^\.]+$)/', '.*.$1', $fullpath);
            $regex = preg_replace('/\.([^\.]+$)/', '\.[\d\w]{8}\.$1', $fullpath);
            $base = str_replace($path, '', $fullpath);
            foreach (glob($pattern) as $filepath) {
                if (preg_match('#' . $regex . '#', $filepath)) {
                    $result = str_replace($base, '', $filepath);
                    $this->summary->set($file, $result);

                    return $result;
                }
            };

        }

        return $path;
    }
}
