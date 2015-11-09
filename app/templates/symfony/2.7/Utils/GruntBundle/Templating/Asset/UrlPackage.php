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
class UrlPackage extends BasePackage
{
    /**
     * Asset base urls
     *
     * @var string
     */
    private $baseUrls;

    /**
     * Constructor.
     *
     * @param string|array $baseUrls    Base asset URLs
     * @param string       $rootDir     The asset root directory
     * @param string       $summaryFile Grunt filerev summary file
     * @param string       $cacheDir    Kernel cache dir
     * @param string       $debug       Debug?
     */
    public function __construct($baseUrls = array(), $rootDir, $summaryFile, $cacheDir, $debug)
    {
        parent::__construct($rootDir, $summaryFile, $cacheDir, $debug);

        if (!is_array($baseUrls)) {
            $baseUrls = (array)$baseUrls;
        }

        $this->baseUrls = array();
        foreach ($baseUrls as $baseUrl) {
            $this->baseUrls[] = rtrim($baseUrl, '/');
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
            $file = '/'.$path;
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

    /**
     * {@inheritdoc}
     */
    public function getUrl($path, $version = null)
    {
        if (false !== strpos($path, '://') || 0 === strpos($path, '//')) {
            return $path;
        }

        $url = $this->applyVersion($path, $version);

        if ($url && '/' != $url[0]) {
            $url = '/'.$url;
        }

        return $this->getBaseUrl($path).$url;
    }

    /**
     * Returns the base URL for a path.
     *
     * @param string $path
     *
     * @return string The base URL
     */
    public function getBaseUrl($path)
    {
        switch ($count = count($this->baseUrls)) {
            case 0:
                return '';

            case 1:
                return $this->baseUrls[0];

            default:
                return $this->baseUrls[fmod(hexdec(substr(hash('sha256', $path), 0, 10)), $count)];
        }
    }
}
