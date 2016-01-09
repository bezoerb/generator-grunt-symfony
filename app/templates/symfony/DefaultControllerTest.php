<?php

namespace <% if (sfVersion < 3) { %>Tests\AppBundle\Controller<% } else { %>AppBundle\Tests\Controller<% } %>;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertTrue($crawler->filter('html:contains("Welcome")')->count() > 0);
    }
}
