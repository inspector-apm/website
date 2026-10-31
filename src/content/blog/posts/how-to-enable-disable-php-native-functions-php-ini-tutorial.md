---
title: "How to enable/disable PHP native functions - php.ini Tutorial"
slug: "how-to-enable-disable-php-native-functions-php-ini-tutorial"
section: "inspector"
permalink: "/how-to-enable-disable-php-native-functions-php-ini-tutorial/"
original_url: "https://inspector.dev/how-to-enable-disable-php-native-functions-php-ini-tutorial/"
date: "2024-07-31T09:58:57Z"
updated: "2025-01-21T17:29:46Z"
author: "Valerio Barbera"
category: "Fast tips"
categories: ["Fast tips", "Product Updates", "Software development", "Troubleshooting", "Tutorials"]
tags: ["Laravel", "PHP", "software development", "symfony"]
description: "How to edit php.ini file on your server to enable disable php native functions. It works both on Win and Unix systems."
focus_keyword: "php.ini"
featured_image: "../images/how-to-enable-disable-php-native-functions-php-ini-tutorial/featured.png"
wp_id: 6865
---

In this article I want to give you the step by step procedure to enable or disable php native functions editing the “disable_functions” directive in the php.ini file.

Sometimes the default PHP configuration on your server needs to be customized to accommodate the compatibility of your system with the production environment.

## Why this tutorial

I’m the author of [Inspector.dev](/) the real-time monitoring package for [**Laravel**](https://github.com/inspector-apm/inspector-laravel) and [**Symfony**](https://github.com/inspector-apm/inspector-symfony). This package uses “pro_open” and “proc_close” php native functions to perform data transfer from your server to the Inspector API asynchronously.

It can also be configured to use the native CURL functions of PHP that are enabled by default, but in this case it will send the monitoring data to Inspector in a synchronous way as other packages do like Sentry, Bugsnag, etc. That means that your application could slow down a bit because the php engine needs to wait before ending the connection with the client.

Recently some developers contacted me because *proc_open* and *proc_close* functions were disabled in their php configuration so they need to unlock them to take advantage of asynchronous data sending.

It’s quite rare but I decided to write this tutorial as a support resource for this use case.

## What is the php.ini file

The php.ini file is THE configuration file for PHP. The file contains a list of key/value pairs called “directives”. Directives are grouped into sections, though these are mainly for organizational purposes.

When PHP starts up, it reads this file and sets up internal data structures to store the configuration. Throughout execution, PHP refers to these internal data structures to determine how it should behave in many key areas, like: Error handling and logging, Resource limits (memory, execution time), File uploads, Database connections, and more.

For someone who's also wondering: PHP can work even if there is no php.ini file, it will simply apply the default values to all directives.

For who is not familiar with it, here is an example of a php.ini file:

[https://github.com/php/php-src/blob/master/php.ini-production](https://github.com/php/php-src/blob/master/php.ini-production)

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.

## Enable/Disable functions in php.ini

Editing the php.ini file we can disable native PHP functions that you will not be able to call inside your PHP code.

Sometimes this feature is used to restrict the usage of some functions in shared hosting environments since a wrong usage of them can cause security issues to other users. Functions like **exec()** are usually disabled, but sometimes server providers are too conservative and can disable functions that are needed in everyday programming tasks.

### Locate the php.ini file

Run the command below in your machine’s terminal to get the current location of the file (it works for both Win and Unix):

```bash
php --ini
```

Common locations: **/etc/php.ini**, **/etc/php/7.x/php.ini** (replace x with the version number of your installation)

To edit files on the server I prefer to use vim editor that should be available in any Unix machine.

```bash
// Use the file path from the command above
sudo vim /etc/php.ini
```

Scroll down to the “**disable_functions**” directive. It should be in the first half of the file and contains a list of functions separated by a comma.

```properties
disable_functions=exec,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source
```

### Edit the php.ini file

- Press the letter “**i**” on your keyboard to enter INSERT mode in vim.
- Remove *proc_open*, and *proc_close* functions from the list.
- When finished editing the file, press the ESC key. This takes you out of INSERT mode and “-- INSERT --" disappears from the bottom left of your terminal.
- To save the file, type in “:wq” , which is the write & quit instruction.

### Restart the PHP engine

To load the new configurations you need to restart PHP. The instruction below should work on most servers. You can eventually search on Google for a specific OS.

```bash
// Change the version of the PHP with what is in use in your machine
sudo systemctl restart php7.3-fpm.service
```

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.
