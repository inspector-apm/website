---
title: "Laravel Http Client Overview and Monitoring"
slug: "laravel-http-client-overview-and-monitoring"
section: "inspector"
permalink: "/laravel-http-client-overview-and-monitoring/"
original_url: "https://inspector.dev/laravel-http-client-overview-and-monitoring/"
date: "2024-06-13T10:51:05Z"
updated: "2025-01-21T17:30:11Z"
author: "Valerio Barbera"
category: "Fast tips"
categories: ["Components", "Fast tips", "Product Updates", "Troubleshooting", "Tutorials"]
tags: ["Laravel", "PHP", "software development"]
description: "How to use Laravel built-in Http Client to communicate with external systems. Monitor Http Client activities with a simple Laravel Package."
focus_keyword: "laravel http client"
seo_title: "Laravel http client - Overview - Inspector.dev"
featured_image: "../images/laravel-http-client-overview-and-monitoring/featured.jpg"
wp_id: 6655
---

Laravel HTTP client was introduced starting from version 10 of the framework, and then also made available in all previous versions.

It stands out as a powerful tool for making HTTP requests and handling responses from external services. This article will delve into the technical foundations of the Laravel HTTP client, its motivations, and how it simplifies communication with external systems. I’ll also provide code examples to illustrate its usage.

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.

## Technical Foundations

The Laravel HTTP client is built on top of the [Guzzle HTTP client](https://docs.guzzlephp.org/en/stable/), which is a widely-used PHP HTTP client that simplifies the process of sending HTTP requests and handling responses in an object oriented way.

Guzzle is great, but it was built as a low level library to model communication with external services. It is widely used to create SDKs to interact with external APIs.

By leveraging Guzzle, Laravel provides a more intuitive and developer-friendly interface while inheriting Guzzle's robustness and performance.

Guzzle's key features include:

- Synchronous and asynchronous requests
- Support for [PSR-7 HTTP](https://www.php-fig.org/psr/psr-7/) message interfaces
- Middleware for modifying requests and responses
- Extensive event-driven architecture
- Efficient connection management and pooling

Laravel wraps these capabilities in a more expressive and “Laravel-esque” syntax, making it easier for developers to perform common tasks and integrate with the rest of the Laravel ecosystem.

## Motivation Behind Laravel HTTP Client

Laravel maintainers built the HTTP client to address several common pain points faced by developers when interacting with external services:

1. **Consistency and Ease of Use**: By providing a consistent API that adheres to Laravel's conventions, developers can quickly become productive without needing to learn the intricacies of Guzzle.
2. **Integration with Laravel Features**: The HTTP client integrates seamlessly with Laravel's features like dependency injection, service containers, events, and testing utilities.
3. **Error Handling and Testing**: Laravel's HTTP client includes built-in mechanisms for error handling and simplifies the process of writing tests for HTTP interactions.

## Simplifying Communication with External Systems

### Basic Usage

To get started with the Laravel HTTP client, you can use the Http facade. Here is a simple example of making a GET request:

```php
use Illuminate\Support\Facades\Http;

$response = Http::get('https://api.example.com/users');

if ($response->successful()) {
    $users = $response->json();
    // Process the users data
} else {
    // Handle the error
    Log::error('Request failed: ' . $response->body());
}
```

### Sending Data

You can send data using various HTTP methods like POST, PUT, and DELETE. Here's an example of sending a POST request with JSON data:

```php
$response = Http::post('https://api.example.com/users', [
    'name' => 'John Doe',
    'email' => 'john@example.com'
]);

if ($response->successful()) {
    $user = $response->json();
    // Process the user data
} else {
    // Handle the error
    Log::error('Request failed: ' . $response->body());
}
```

### Handling Responses

The Laravel HTTP client provides several methods to handle responses effectively:

- successful(): Checks if the response status code is 200-299.
- clientError(): Checks if the response status code is 400-499.
- serverError(): Checks if the response status code is 500-599.
- json(): Parses the response body as JSON.

Here's an example of handling different response scenarios:

```php
$response = Http::get('https://api.example.com/users/1');

if ($response->successful()) {
    $user = $response->json();
    // Process the user data
} elseif ($response->clientError()) {
    Log::warning('Client error: ' . $response->body());
} elseif ($response->serverError()) {
    Log::error('Server error: ' . $response->body());
} else {
    Log::error('Unexpected error: ' . $response->body());
}
```

### Headers and Authentication

You can easily set headers and handle authentication. Here’s an example using a Bearer token to authenticate on external APIs:

```php
$response = Http::withHeaders([
    'Authorization' => 'Bearer ' . $token,
])->get('https://api.example.com/protected-resource');

if ($response->successful()) {
    $data = $response->json();
    // Process the data
} else {
    // Handle the error
    Log::error('Request failed: ' . $response->body());
}
```

### Timeout and Retry

Laravel’s HTTP client allows setting timeouts and retry mechanisms to handle transient failures. This feature is based on the retry helper function that you may already know:

```php
$response = Http::timeout(10)
               ->retry(3, 100)
               ->get('https://api.example.com/resource');

if ($response->successful()) {
    $data = $response->json();
    // Process the data
} else {
    // Handle the error
    Log::error('Request failed: ' . $response->body());
}
```

### Macroable

To create custom predefined configurations you can create a macro on the Http client that will store your settings. You can define your macros in the *boot* method of the *AppServiceProvider*:

```php
use Illuminate\Support\Facades\Http;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Http::macro('inspector', function () {
        return Http::withHeaders([
            'Authorization' => 'Bearer ' . $inspectorToken,
        ])->baseUrl('https://app.inspector.dev/api');
    });
}
```

You can use the name of the macro to quickly reuse it everywhere in your application:

```php
$response = Http::inspector()->get('/apps');
```

### Middleware

You can use middleware to modify requests and responses. Here’s an example of adding a custom header to every request:

```php
Http::macro('withCustomHeader', function () {
    return $this->withHeaders([
        'X-Custom-Header' => 'CustomValue'
    ]);
});

// Usage
$response = Http::withCustomHeader()->get('https://api.example.com/resource');

if ($response->successful()) {
    $data = $response->json();
    // Process the data
} else {
    // Handle the error
    Log::error('Request failed: ' . $response->body());
}
```

### Testing HTTP Requests

Laravel provides utilities to mock HTTP requests and responses, making it easier to write tests:

```php
use Illuminate\Support\Facades\Http;

Http::fake([
    'https://api.example.com/*' => Http::response(['name' => 'John Doe'], 200)
]);

$response = Http::get('https://api.example.com/users/1');

$this->assertTrue($response->successful());
$this->assertEquals('John Doe', $response->json('name'));
```

## Monitor Laravel Http Client activities

Monitoring Laravel HTTP client activities becomes crucial to understanding the impact of communication with external systems on the reliability of your application.

How long do calls to external endpoints take? How many times do they go wrong?

You can use tools like Inspector to visualize each HTTP request performed by your application into the execution timeline.

Learn more in the article below:

[Laravel Application Monitoring with a simple package](/laravel-real-time-performance-monitoring-using-inspector-part-1/)

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.
