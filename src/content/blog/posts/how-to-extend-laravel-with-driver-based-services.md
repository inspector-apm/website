---
title: "How to extend Laravel implementing custom Facade – Tutorial"
slug: "how-to-extend-laravel-with-driver-based-services"
section: "inspector"
permalink: "/how-to-extend-laravel-with-driver-based-services/"
original_url: "https://inspector.dev/how-to-extend-laravel-with-driver-based-services/"
date: "2021-08-23T12:30:08Z"
updated: "2024-11-07T12:14:11Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Application Scalability", "Software development", "Troubleshooting"]
tags: ["Laravel", "software development"]
description: "Implement your custom Laravel Facade class to create decoupled components to extend your Laravel application. Code snippets included."
focus_keyword: "laravel facade"
featured_image: "../images/how-to-extend-laravel-with-driver-based-services/featured.jpg"
wp_id: 3082
---

In this article I talk about a Laravel internal feature not mentioned in the official documentation called "Driver Manager". It allows you to implement custom Laravel Facade in your application.

It can completely change the way you design and develop your application solving critical architectural bottlenecks, allowing you to build large systems built around decoupled, independent and reusable components.

It was widely used by the creators of the framework to abstract common services allowing you to interact with different types of technologies for each of these services.

Think about Log (you can log to files, syslog, papertrail, slack, etc), Cache (you can cache your data into files, redis, memecached, etc.), Session (you can store PHP sessions using files, databases, etc.), and others general purpose components.

## How the Driver Manager works in the Laravel framework

As mentioned above, Laravel already provides many components built using the "driver" system, and you can access them by Facades:

```php
\Log::debug('message');

\Cache::get('key');

\Session::get('key');
```

## When you use these Facades, how does Laravel know which implementation (the driver) should be used?

Each service has its own configuration file. In case of the Cache service it is in the **`config/cache.php`** configuration file:

```php
/*
|--------------------------------------------------------------------------
| Default Cache Store
|--------------------------------------------------------------------------
|
| This option controls the default cache connection that gets used while
| using this caching library. This connection is used when another is
| not explicitly specified when executing a given caching function.
|
| Supported: "apc", "array", "database", "file",
|            "memcached", "redis", "dynamodb"
|
*/

'default' => env('CACHE_DRIVER', 'file'),
```

Changing the value of the default driver from "file" to "database", Laravel will automatically use the database implemetation instead of files to store and retrieve cached items.

We can also switch from one driver to another at runtime if necessary:

```php
\Cache::driver('file')->put('key', 'value');
```

Obviously it works only if you have properly configured the driver in the configuration file.

Below I'll show you how to develop your own "driver-based" component and how to bind it to the IoC container to be reachable by a Facade class.

## When to develop Laravel custom Facades?

A driver-based service is the right choice when the same utility can be provided by more than one technology.

Thanks to the drivers you can develop a concrete implementation for each underlying technology and switch among them changing a simple configuration parameter or even more simply changing an environment variable.

This strategy allows you to use file as your cache storage in your development environment, and Redis in production simply by setting a different value for the *CACHE_DRIVER* environment variable.

```bash
# DEV environment - Set file as default cache storage
CACHE_DRIVER=file

# PROD environment - Set Redis as default cache storage
CACHE_DRIVER=redis
```

Log, Cache, or Session services are perfect examples. Log, Cache, and Session are functional needs, regardless of the underlying technology you want to use.

Every developer need to cache temporary information out of the database to speed up performance, but a cache service can be provided by many different technologies such as Redis, Memcached, files, etc.

Regardless of the technology you use, you always need to store a value in the cache:

```php
\Cache::put('key', 'value');
```

And retrieve these values from the cache:

```php
$value = \Cache::get('key');
```

To better understand how this mechanism works I'll show a real-life example building our internal Firewall service.

Based on the definition we discussed above a Firewall is a functional need that can be addressed using several types of systems: Cloudflare, fail2ban, Google Cloud Armor, AWS hosted firewall, etc.

## Implement the Firewall custom Facade

First we need to define the general Interface of a Firewall that all drivers must implement.

Looking at the purpose of a Firewall we generically should be able to "deny" IP addresses to reach our infrastructure or "allow" them to send traffic to it.

Here is the Firewall interface:

```php
namespace App\Firewall\Contracts;


interface FirewallInterface
{
    /**
     * Allow web traffic from the give ip addresses.
     *
     * @param array $ips
     * @return mixed
     */
    public function allow(array $ips);

    /**
     * Deny web traffic from the given IP addresses.
     *
     * @param array $ips
     * @return mixed
     */
    public function deny(array $ips);
}
```

All drivers will have to implement this interface, so when we develop the "driver manager" we can skip from one driver to another being sure that the application continues to work.

The first demo implementation could be a simple logger to write the list of the given IP addresses in the log file. We call it "*LogFirewallDriver*":

```php
namespace App\Firewall\Drivers;


use App\Firewall\Contracts\FirewallInterface;
use Psr\Log\LoggerInterface;

class LogFirewallDriver implements FirewallInterface
{
    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * LogFirewallDriver constructor.
     *
     * @param LoggerInterface|null $logger
     */
    public function __construct(LoggerInterface $logger = null)
    {
        $this->logger = $logger;
    }

    /**
     * Allow web traffic from the give ip addresses.
     *
     * @param array $ips
     * @return mixed
     */
    public function allow(array $ips)
    {
        if ($this->logger) {
            $this->logger->debug('Allow traffic from: ' . implode(', ', $ips));
        }
    }

    /**
     * Deny web traffic from the given IP addresses.
     *
     * @param array $ips
     * @return mixed
     */
    public function deny(array $ips)
    {
        if ($this->logger) {
            $this->logger->debug('Deny traffic from: ' . implode(', ', $ips));
        }
    }
}
```

## How to implement the Manager class

When we build our driver-based components, we need a way to manage them. We want to be able to create several predefined drivers or even create them at a later time during the application’s lifecycle.

A seen at the beginning of the article we want to be able to request instances of a particular driver at runtime and also have a fallback driver where calls are proxied into, for when we don’t specify a driver.

This is the job of the **\\Illuminate\\Support\\Manager** class.

Laravel provides this abstract Manager class in the Support namespace (Illuminate\\Support\\Manager) that contains some buil-in functionality to help us manage the driver system.

To get started, you need to extend this class and define your own driver creation methods like the `createLogDriver()` method:

```php
namespace App\Firewall;


use Illuminate\Support\Manager;

class FirewallManager extends Manager
{
    /**
     * Get the default driver name.
     *
     * @return string
     */
    public function getDefaultDriver()
    {
        return config('firewall.default') ?? 'log';
    }

    /**
     * Get an instance of the log driver.
     *
     * @return LogFirewallDriver
     */
    public function createLogDriver(): FirewallInterface
    {
        return new LogFirewall(
            $this->container['log']->channel(config('firewall.drivers.log.channel'))
        );
    }
}
```

The driver creation method should respect the format *create[Drivername]Driver* where *Drivername* is the name of the driver after it has been studly-cased.

The driver creation methods you define in your manager class should return an instance of the driver interface.

The base manager class defines several built-in logics to aid in the creation and managing of our drivers. Because it’s an abstract class and declares a getDefaultDriver() method, you've to implement this method returning the default driver's name.

## How to bind the FirewallManager component to the IoC container

To access the Firewall component within the application you need to register the FirewallManager class into the Laravel's service container. Add the code below in your *AppServiceProvider*:

```php
namespace App\Providers;


use App\Firewall\FirewallManager;

class AppServiceProvider extend ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('firewall', function ($app) {
            return new FirewallManager($app);
        });
    }


}
```

We also create the Firewall Facade to access the binded service in a convenient way:

```php
namespace App\Firewall\Facades;


/**
 * @method static FirewallInterface getDefaultDriver()
 * @method static FirewallInterface driver(string $name)
 * @method static FirewallManager extend(string $driver, \Closure $callback)
 * @method static mixed allow(array $ips)
 * @method static mixed deny(array $ips)
 */
class Firewall extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     *
     * @throws \RuntimeException
     */
    protected static function getFacadeAccessor()
    {
        return 'firewall';
    }
}
```

Finally create the **`config\firewall.php`** configuration file to store the specific configuration options for each driver:

```php
return [
    /*
    |--------------------------------------------------------------------------
    | Default Firewall Driver
    |--------------------------------------------------------------------------
    |
    | This option defines the default firewall driver that gets used when try to
    | allow or deny traffic for some IPs addresses. The name specified in this option should match
    | one of the driver defined in the "drivers" configuration array.
    |
    */

    'default' => env('FIREWALL_DRIVER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | Configuration options for each driver
    |--------------------------------------------------------------------------
    |
    | Here you may configure the firewall drivers for Inspector. Out of
    | the box, Inspector is able to allow and deny traffic using the
    | firewalls below.
    |
    */

    'drivers' => [
        'log' => [
            'channel' => 'daily'
        ]
    ]
];
```

## How to use the Firewall custom Facade

Once we have configured our component, that is, registering a facade as Firewall, and setting up the config file, we can easily get an instance of the FirewallManager and access the driver functionalities:

```php
\Firewall::deny(['127.0.0.1', '127.0.0.2']);
```

By default it use the log driver, so you should see the log entry:

```php
[2021-08-19 14:37:55] local.DEBUG: Deny traffic from: 127.0.0.1, 127.0.0.2
```

## Add a new driver

With the *FirewallManager* in place we can now easily develop new firewall implementations to interact with other systems. Just as an example I'll show you how to implement and add the "Cloudflare" driver to to interact with the Cloudflare firewall, without touch the application's code.

As seen for the implementation of the *LogFireallDriver* we need to create the *CloudflareFirewallDriver* implemeting the general firewall interface:

```php
namespace App\Firewall\Drivers;


use App\Firewall\Contracts\FirewallInterface;

class CloudflareFirewallDriver implements FirewallInterface
{
    /**
     * Http client to interact with Cloudflare API.
     *
     * @var \Guzzle\Client $client
     */
    protected $client;

    /**
     * CloudflareFirewallDriver constructor.
     *
     * @param string $zoneId
     */
    public function __construct(string $zoneId)
    {
        $this->client = new \Guzzle\Client('https://api.cloudflare.com/client/v4/zones/' . $zoneId)
    }

    /**
     * Allow web traffic from the given ip addresses.
     *
     * @param array $ips
     * @return mixed
     */
    public function allow(array $ips)
    {
        // Call Cloudflare API to allow traffic from the given IP addresses.
        $this->client->put('filters', ...);
    }

    /**
     * Deny web traffic from the given IP addresses.
     *
     * @param array $ips
     * @return mixed
     */
    public function deny(array $ips)
    {
        // Call Cloudflare API to deny traffic from the given IP addresses.
        $this->client->put('filters', ...);
    }
}
```

As you can see in the contructor method you need to provide the "zoneId" to properly build the Cloudflare API endpoint. You can add a new entry in the **`config/firewall.php`** configuration file for this new driver:

```php
return [
    /*
    |--------------------------------------------------------------------------
    | Default Firewall Driver
    |--------------------------------------------------------------------------
    |
    | This option defines the default firewall driver that gets used when try to
    | allow or deny traffic for some IPs addresses. The name specified in this option should match
    | one of the driver defined in the "drivers" configuration array.
    |
    */

    'default' => env('FIREWALL_DRIVER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | Configuration options for each driver
    |--------------------------------------------------------------------------
    |
    | Here you may configure the firewall drivers for Inspector. Out of
    | the box, Inspector is able to allow and deny traffic using the
    | firewalls below.
    |
    */

    'drivers' => [
        'log' => [
            'channel' => 'daily'
        ],

        'cloudflare' => [
            'zone' => 'xxx'
        ]
    ]
];
```

We also must make the FirewallManager aware of this new driver. You can add the new *createCloudflareDriver()* method to define the creation logic:

```php
namespace App\Firewall;


use Illuminate\Support\Manager;

class FirewallManager extends Manager
{
    /**
     * Get the default driver name.
     *
     * @return string
     */
    public function getDefaultDriver()
    {
        return config('firewall.default') ?? 'log';
    }

    /**
     * Get an instance of the log driver.
     *
     * @return LogFirewallDriver
     */
    public function createLogDriver(): FirewallInterface
    {
        return new LogFirewall(
            $this->container['log']->channel(config('firewall.drivers.log.channel'))
        );
    }


    /**
     * Get an instance of the Cloudlfare driver.
     *
     * @return CloudflareFirewallDriver
     */
    public function createCloudflareDriver(): FirewallInterface
    {
        return new CloudflareFirewallDriver(
            config('firewall.drivers.cloudflare.zone'))
        );
    }
}
```

Now you are free to switch to this new driver or configure it as default driver in your environment file:

```php
\Firewall::driver('cloudflare')->deny(['127.0.0.1', '127.0.0.2']);
```
