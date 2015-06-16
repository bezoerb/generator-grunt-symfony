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
                ->scalarNode('environment')->defaultValue('node')->end()
            ->end();


        $this->addFilerevSection($rootNode);

        return $treeBuilder;
    }

    private function addFilerevSection(ArrayNodeDefinition $rootNode)
    {
        $rootNode
            ->children()
                ->arrayNode('filerev')
                ->addDefaultsIfNotSet()
                ->children()
                    ->scalarNode('root_dir')->defaultValue('%kernel.root_dir%/../web')->end()
                ->end()
            ->end();
    }
}
