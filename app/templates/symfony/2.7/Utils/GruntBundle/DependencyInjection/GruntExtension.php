<?php

namespace Utils\GruntBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\DefinitionDecorator;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;
use Symfony\Bundle\FrameworkBundle\DependencyInjection\Configuration as FrameworkConfiguration;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class GruntExtension extends Extension implements PrependExtensionInterface
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('parameters.yml');
        $loader->load('services.yml');

        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        // skip if not enabled
        if (!$config['filerev']['enabled']) {
            return;
        }

        // base_urls and base_path are cloned from framework configuration in `prepend`
        $basePath = $config['filerev']['base_path'];
        $httpUrls = $config['filerev']['base_urls']['http'];
        $sslUrls = $config['filerev']['base_urls']['ssl'];

        $rootDir = $config['filerev']['root_dir'];
        $summaryFile = $config['filerev']['summary_file'];
        $cacheDir = $container->getParameter('kernel.cache_dir').'/grunt';

        // overwrite symfony default package
        $defaultPackage = $this->createPackageDefinition($container, $basePath, $httpUrls , $sslUrls, $rootDir, $summaryFile, $cacheDir, $config['debug']);
        $container->setDefinition('assets._default_package', $defaultPackage);

        foreach ($config['filerev']['packages'] as $name => $package) {
            $baseUrlsHttp = empty($package['base_urls']['http']) ? array() : $package['base_urls']['http'];
            $baseUrlsSsl = empty($package['base_urls']['ssl']) ? array() : $package['base_urls']['ssl'];

            $container->setDefinition('assets._package_'.$name, $this->createPackageDefinition($container, $package['base_path'], $baseUrlsHttp , $baseUrlsSsl, $rootDir, $summaryFile, $cacheDir, $config['debug']));
        }
    }

    /**
     * Returns a definition for an asset package.
     *
     * @param ContainerBuilder $container   Container
     * @param array            $httpUrls    SSL assets_base_urls
     * @param array            $sslUrls     assets_base_urls
     * @param string           $rootDir     Directory where to look for reved assets
     * @param string           $summaryFile Grunt filerev summary file
     * @param string           $cacheDir    Kernel cache dir
     * @param bool             $debug       Debug mode?
     * @param string           $name        Package name
     *
     * @return DefinitionDecorator
     */
    private function createPackageDefinition(ContainerBuilder $container, $basePath, array $httpUrls, array $sslUrls, $rootDir, $summaryFile, $cacheDir, $debug, $name = null)
    {
        if (!$httpUrls) {
            $package = new DefinitionDecorator('grunt.filerev.templating.asset.path_package');
            $package
                ->setPublic(false)
                ->replaceArgument(0, $basePath)
                ->replaceArgument(1, $rootDir)
                ->replaceArgument(2, $summaryFile)
                ->replaceArgument(3, $cacheDir)
                ->replaceArgument(4, $debug);

            return $package;
        }

        if ($httpUrls == $sslUrls) {
            $package = new DefinitionDecorator('grunt.filerev.templating.asset.url_package');

            $package
                ->setPublic(false)
                ->replaceArgument(0, $sslUrls)
                ->replaceArgument(1, $rootDir)
                ->replaceArgument(2, $summaryFile)
                ->replaceArgument(3, $cacheDir)
                ->replaceArgument(4, $debug);

            return $package;
        }

        $prefix = $name ? 'templating.asset.package.'.$name : 'templating.asset.default_package';

        $httpPackage = new DefinitionDecorator('grunt.filerev.templating.asset.url_package');
        $httpPackage
            ->replaceArgument(0, $httpUrls)
            ->replaceArgument(1, $rootDir)
            ->replaceArgument(2, $summaryFile)
            ->replaceArgument(3, $cacheDir)
            ->replaceArgument(4, $debug);
        $container->setDefinition($prefix . '.http', $httpPackage);

        if ($sslUrls) {
            $sslPackage = new DefinitionDecorator('grunt.filerev.templating.asset.url_package');
            $sslPackage
                ->replaceArgument(0, $sslUrls)
                ->replaceArgument(1, $rootDir)
                ->replaceArgument(2, $summaryFile)
                ->replaceArgument(3, $cacheDir)
                ->replaceArgument(4, $debug);
        } else {
            $sslPackage = new DefinitionDecorator('grunt.filerev.templating.asset.path_package');
            $sslPackage
                ->replaceArgument(0, $basePath)
                ->replaceArgument(1, $rootDir)
                ->replaceArgument(2, $summaryFile)
                ->replaceArgument(3, $cacheDir)
                ->replaceArgument(4, $debug);
        }
        $container->setDefinition($prefix . '.ssl', $sslPackage);

        $package = new DefinitionDecorator('templating.asset.request_aware_package');
        $package
            ->setPublic(false)
            ->setScope('request')
            ->replaceArgument(1, $prefix . '.http')
            ->replaceArgument(2, $prefix . '.ssl');

        return $package;
    }

    /**
     * Set assets configuration from framework config
     *
     * @param ContainerBuilder $container
     */
    public function prepend(ContainerBuilder $container)
    {
        // process the configuration of FrameworkExtension
        $configs = $container->getExtensionConfig('framework');

        // use the FrameworkConfiguration class to generate a config
        $config = $this->processConfiguration(new FrameworkConfiguration(false), $configs);

        if (isset($config['assets'])) {
            $innerConfig = array();

            if (isset($config['assets']['base_urls'])) {
                $innerConfig['base_urls'] = $config['assets']['base_urls'];
            }
            if (isset($config['assets']['base_path'])) {
                $innerConfig['base_path'] = $config['assets']['base_path'];
            }

            if (isset($config['assets']['packages'])) {
                $innerConfig['packages'] = $config['assets']['packages'];
            }

            $config = array('filerev' => $innerConfig);
            $container->prependExtensionConfig($this->getAlias(), $config);
        }
    }
}
