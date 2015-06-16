<?php

/**
 * Copyright (c) 2015 Ben Zörb
 * Licensed under the MIT license.
 * http://bezoerb.mit-license.org/
 */


namespace Utils\GruntBundle\Templating\Asset;

use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\Templating\Asset\Package;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Translation\Loader\JsonFileLoader;
use Symfony\Component\Translation\MessageCatalogue;

/**
 * The path packages adds a version and a base path to asset URLs for use with node's filerev .
 *
 * @author Ben Zörb <ben@sommerlaune.com>
 */
class FilerevPackage extends Package
{
    private $basePath;
    private $root;

    /**
     * @var MessageCatalogue
     */
    private $summary;

    /**
     * Constructor.
     *
     * @param string $basePath The base path to be prepended to relative paths
     * @param string $version  The package version
     * @param string $format   The format used to apply the version
     */
    public function __construct($basePath = null, $version = null, $format = null)
    {
        parent::__construct($version, $format);

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
     * Set filerev summary
     *
     * @param MessageCatalogue $summary
     *
     * @return FilerevPackage
     */
    public function setSummary(MessageCatalogue $summary)
    {
        $this->summary = $summary;

        return $this;
    }

    /**
     * Get filerev summary
     *
     * @return MessageCatalogue
     * @throws \Exception
     */
    public function getSummary()
    {
        if (!$this->summary instanceof MessageCatalogue) {
            throw new \Exception('Summary is not injected into ' . get_class($this));
        }

        return $this->summary;
    }


    public function setRoot($dir)
    {
        $this->root = $dir;

        return $this;
    }

    public function getRoot()
    {
        return $this->root;
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

        // apply the base path
        if ('/' !== substr($url, 0, 1)) {
            $url = $this->basePath . $url;
        }

        return $url;
    }

    /**
     * Returns the base path.
     *
     * @return string The base path
     */
    public function getBasePath()
    {
        return $this->basePath;
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

        $reved = $this->summary->get($file);

        $fullpath = $this->getRoot() . $file;
        $fullreved = $this->getRoot() . $reved;

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
