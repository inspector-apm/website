---
title: "Get the client IP address in Laravel - Fast tips"
slug: "get-the-client-ip-address-in-laravel-fast-tips"
section: "inspector"
permalink: "/get-the-client-ip-address-in-laravel-fast-tips/"
original_url: "https://inspector.dev/get-the-client-ip-address-in-laravel-fast-tips/"
date: "2023-06-11T11:22:29Z"
updated: "2024-11-07T12:13:53Z"
author: "Valerio Barbera"
category: "Fast tips"
categories: ["Fast tips", "Troubleshooting"]
tags: ["Laravel", "PHP", "fast tips"]
description: "How to get the client IP address using the Laravel Request class. Use it to monitor your navigation sessions."
focus_keyword: "ip address laravel"
featured_image: "../images/get-the-client-ip-address-in-laravel-fast-tips/featured.jpg"
wp_id: 5794
---

In this article, I will share with you how to get the client IP address using the Laravel Request class.

You have three options to invoke the **\\Illuminate\\Http\\Request** class:

```php
// Using the helper function
echo request()->ip();

// Using the Facade
echo \Request::ip();

// Using the underlying method directly
echo \Request::getClientIp(true);
```

## How to use the IP address to monitor your navigation sessions

The Inspector middleware allows you to exlude traffic from your monitoring data with a simple configuration:

```php
/*
 |---------------------------------------------------------------------
 | Web request url to ignore
 |---------------------------------------------------------------------
 |
 | Add at this list the url schemes that you don't want monitoring
 | in your Inspector dashboard. You can also use wildcard expression (*).
 |
 */
 
'ignore_url' => [
    'telescope*',
    'vendor/telescope*',
    'horizon*',
    'vendor/horizon*',
],
```

If you need to implement a custom logic, the middleware is also designed to be extended.

```php
<?php

use \Inspector\Laravel\Middleware\WebRequestMonitoring;


class InspectorFilterMonitoringMiddleware extends WebRequestMonitoring
{
    /**
     * Determine if Inspector should record current request.
     *
     * @param \Illuminate\Http\Request $request
     * @return bool
     */
    protected function shouldRecorded($request): bool
    {
        // Monitor requests coming from your IP addresses (e.g. for debugging purpose)
        return in_array($request->ip(), ['xxx.xxx.xxx.xxx']);
    }
}
```

Overwriting the **shouldRecorded()** method, you can implement a custom condition to decide which routes should be ignored by Inspector.

Check out the complete tutorial in the official documentation:

[https://docs.inspector.dev/guides/laravel/http-requests-monitoring#ignore-http-requests](https://docs.inspector.dev/guides/laravel/http-requests-monitoring#ignore-http-requests)

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**. I post about building my SaaS business.
