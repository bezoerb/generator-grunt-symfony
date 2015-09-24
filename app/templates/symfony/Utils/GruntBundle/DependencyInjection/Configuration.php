<?php

namespace Utils\GruntBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('grunt');

        $rootNode
            ->children()
                ->booleanNode('debug')->defaultValue('%kernel.debug%')->end()
            ->end();


        $this->addFilerevSection($rootNode);

        return $treeBuilder;
    }

    private function addFilerevSection(ArrayNodeDefinition $rootNode)
    {

        $organizeUrls = function ($urls) {
            $urls += array(
                'http' => array(),
                'ssl' => array(),
            );

            foreach ($urls as $i => $url) {
                if (is_int($i)) {
                    if (0 === strpos($url, 'https://') || 0 === strpos($url, '//')) {
                        $urls['http'][] = $urls['ssl'][] = $url;
                    } else {
                        $urls['http'][] = $url;
                    }
                    unset($urls[$i]);
                }
            }

            return $urls;
        };

        $rootNode
            ->children()
                ->arrayNode('filerev')
                    ->info('grunt filerev configuration')
                    ->canBeDisabled()
                    ->children()
                        ->scalarNode('root_dir')->defaultValue('%kernel.root_dir%/../web')->end()
                        ->scalarNode('summary_file')->defaultValue('filerev.json')->end()
                        ->scalarNode('base_path')->end()
                        ->arrayNode('base_urls')
                            ->performNoDeepMerging()
                            ->addDefaultsIfNotSet()
                            ->beforeNormalization()
                                ->ifTrue(function ($v) { return !is_array($v); })
                                ->then(function ($v) { return array($v); })
                            ->end()
                            ->beforeNormalization()
                                ->always()
                                ->then($organizeUrls)
                            ->end()
                            ->children()
                                ->arrayNode('http')
                                    ->prototype('scalar')->end()
                                ->end()
                                ->arrayNode('ssl')
                                    ->prototype('scalar')->end()
                                ->end()
                            ->end()
                        ->end()
                        ->arrayNode('packages')
                            ->useAttributeAsKey('name')
                            ->prototype('array')
                                ->fixXmlConfig('base_url')
                                ->children()
                                    ->scalarNode('version')->defaultNull()->end()
                                    ->scalarNode('version_format')->defaultNull()->end()
                                    ->scalarNode('base_path')->defaultValue('')->end()
                                    ->arrayNode('base_urls')
                                        // ->requiresAtLeastOneElement()
                                        ->beforeNormalization()
                                            ->ifTrue(function ($v) { return !is_array($v); })
                                            ->then(function ($v) { return array($v); })
                                        ->end()
                                        ->prototype('scalar')->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                    ->end()
                ->end()
            ->end()
        ;
    }
}
