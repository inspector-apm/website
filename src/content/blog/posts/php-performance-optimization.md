---
title: "PHP Perfomance optimization"
slug: "php-performance-optimization"
section: "inspector"
permalink: "/php-performance-optimization/"
original_url: "https://inspector.dev/php-performance-optimization/"
date: "2019-08-12T14:13:00Z"
updated: "2024-11-07T12:14:48Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["PHP"]
description: "In this guide you'll find how to optimize your PHP scripts for speed! Better performance will help you to cut costs on server resources."
focus_keyword: "php performance"
seo_title: "Php performance Optimization tips and tricks | Inspector"
featured_image: "../images/php-performance-optimization/featured.png"
og_image: "../images/php-performance-optimization/timeline.png"
old_slugs: ["php-perfomance-optimization"]
wp_id: 1282
---

Hi, I'm Valerio, software engineer, founder and CTO at Inspector.

Once the initial setup is over and the application start to serve real users, then this is the time when stability and reliability plays an important role as well as the speed of development.

There are hundreds of ways to optimize PHP perfmance but I think that in most cases it's enough to start from a few but important points.

In this article I show you my checklist about php performance tuning. I hope that it will be a good starting point for you to make some improvements.

## PHP Tuning: start with PHP 8.x

The latest version of PHP is the fastest version of PHP ever released. According to some reviews, PHP 8 is much faster and secure than PHP 5.

There's a good backward compatibility so the upgrade can't require a lot of effort.

You will be able to get the advantage of spending time only once, and reduce the resources needed by the application to run. You could cut the cost of your hosting by a few percentage points in the long-term.

Annual benchmark provided by Kinsta (the best WordPress hosting in the world) tell us how huge the performance increase is:

[The Definitive PHP 5.6, 7.0, 7.1, 7.2 & 7.3 Benchmarks (2019)](https://kinsta.com/blog/php-benchmarks/)

## SQL Queries improvements

I worked on a project where the backend runs 40/50K queries per second. Using an ORM ([Eloquent](https://laravel.com/docs/5.8/eloquent) in that case).

40K/50K queries per second was an unexpectedly high number. After a little investigation I changed one line of code using [Eager Loading](https://laravel.com/docs/5.8/eloquent-relationships#eager-loading) to preload a relationship to make the application 30% faster.

```php
// Slower
$books = App\Book::all();
foreach ($books as $book) {
  echo $book->author->name;
}

// Faster (using Eager Loading)
$books = App\Book::with('author')->get();
foreach ($books as $book) {
  echo $book->author->name;
}
```

ORMs are tools. They make our job easier, like all tools they offer many features. It is up to us to learn how to use them correctly.

Learn more how to use the ORM at scale reading this article: [https://inspector.dev/make-your-application-scalable-optimizing-the-orm-performance/](/make-your-application-scalable-optimizing-the-orm-performance/)

## PHP optimization tips

### Use Composer optimized autoload

If not optimized a php application could spending quite some time in autoloading instead of doing more interesting things.

The [Composer](https://getcomposer.org) documentation perfectly exaplains the reason:

> Due to the way PSR-4 and PSR-0 autoloading rules are set up, it Composer needs to check the filesystem before resolving a class name conclusively. This slows things down quite a bit, but it is convenient in development environments because when you add a new class, it can immediately be discovered/used without having to rebuild the autoloader configuration.

In production instead we should prefer the optimized version of the `classmap` because the code will change only on the next deployment when a new `dump-autoload` will be executed again.

### Single quote wins on Double quotes

Using double quote you can insert variables directly within the text of the string. The PHP parser will automatically detect such variables, convert their values into readable text, and place them in their proper places.

```php
$name = 'Valerio';

echo "Hello $name"; // Output: Hello Valerio
```

**PHP takes longer to process double quoted strings.** Since the PHP parser has to read the whole string in advance to detect any variable inside — and concatenate it — it takes longer to process than a single quoted string.

Variables are ignored using single quote. You can concatenate multiple variables with a string by using the dot notation.

```php
$name = 'Valerio';

echo 'Hello $name'; // Output: Hello $name

echo 'Hello '. $name; // Output: Hello Valerio
```

**Single quotes are easier on the server.** Since PHP does not need to read the whole string in advance, the server can work faster and happier.

## Make php even faster

Every time a PHP script is executed it's parsed and compiled into *opcode*.

OPCode is an abbreviation of "operation code", also known as "byte code" in other programming languages.

The process compiles human-readable PHP code to code your server understand. This occurs when the PHP file loads for the first time. Then, it's saved to the server's memory for faster loading at each subsequent execution.

PHP provides many functions to have more control on the OPCode cache. The most popular frameworks have packages to simplify interaction with these API.

## For Laravel

Looking for php optimizazion settings for Lavarel? Working in Laravel based applications for the most of time I can suggest you an handy package that gives you Artisan commands to work with OPcache.

[https://github.com/appstract/laravel-opcache](https://github.com/appstract/laravel-opcache)

## For Symfony

In the official Symfony documentation there’s a good step by step guide that help me in the past to optimize Symfony execution including OPcache configuration.

[https://symfony.com/doc/current/performance.html](https://symfony.com/doc/current/performance.html)

### Conclusion

I hope that one or more of these tips can help you to create more solid and scalable software products.

There are many other factors that can affect the performance of an application. Database interactions, server resources, and many more. Receive more insights by registering your account to Inspector.

When looking to optimize your PHP backend, consider [**hiring a freelance PHP Developer**](https://www.toptal.com/php) from a trusted talent marketplace like Toptal. We have partnered with them in the past and I can say that they are the best source of talents for the PHP ecosystem.
