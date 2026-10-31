---
title: "Why use declare(strict_types=1) in PHP - Fast tips"
slug: "why-use-declarestrict_types1-in-php-fast-tips"
section: "inspector"
permalink: "/why-use-declarestrict_types1-in-php-fast-tips/"
original_url: "https://inspector.dev/why-use-declarestrict_types1-in-php-fast-tips/"
date: "2023-09-25T10:29:25Z"
updated: "2025-01-13T10:39:58Z"
author: "Valerio Barbera"
category: "Fast tips"
categories: ["Fast tips", "Software development"]
tags: ["Laravel", "PHP", "software development"]
description: "Enable strict typing mode in PHP with declare(strict_types=1). Understand its implications with code examples."
focus_keyword: "declare(strict_types=1)"
seo_title: "Why use declare (strict_types=1) in PHP - Inspector.dev"
featured_image: "../images/why-use-declarestrict_types1-in-php-fast-tips/featured.jpg"
wp_id: 5983
---

In this tutorial, we'll explore what **declare(strict_types=1)** means, why PHP developers should use it and why not, and provide examples to illustrate its importance.

This setting comes because of the loosely typed nature of PHP and the increasing demand of strictly typed features led by other popular languages like Java.

Both typing strategies (loose vs strict) have pros and cons, first of all let's understand their meaning.

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.

## Loosely Typed Language

A loosely typed language, also known as a dynamically typed language, is a programming language where variables are not bound to a specific data type at compile-time. You don’t need to declare in advance what data type a variable will contain during the execution.

The data type of a variable is determined based on the value it holds and can change at runtime.

PHP is basically a loosely typed language, so we can write an example with it:

```php
$a = "hello";
$a = 1; 
// No errors. The content of the variable is changed from string to int.
```

Loosely typed languages often allow for implicit type conversion, meaning they may automatically convert data from one type to another to facilitate operations. This behavior can lead to more flexibility but also a higher potential for functional errors.

## Strictly Typed Language

A strictly typed language, also known as a statically typed language, is a programming language where variables must be explicitly declared with a specific data type at compile-time.

Once a variable's data type is defined, it cannot change during its lifetime. Strictly typed languages do not perform implicit type conversion, meaning operations between variables of different types typically result in a compilation error.

We can write an example in Java:

```java
public class CompileError {
    public static void main(String[] args) {

        int x = 15;
        x = "Valerio";

    }
}
```

## What is declare(strict_types=1)?

declare(strict_types=1) is a directive in PHP that enforces strict type checking for function and method arguments and return values within a specific PHP file or code block. When you enable strict type checking, PHP ensures that the data types of function arguments and return values match exactly with the declared types. Exactly the same way as Java does.

Place this declaration at the very beginning of your PHP file or code block (before any other code) to enable strict typing.

Here's the basic syntax to enable strict type checking:

```php
<?php

declare(strict_types=1);

function speak(string $name): string 
{
    return "Hello {$name}!";
}

speak(1); // This fires the error "Uncaught TypeError"
speak("Valerio"); // This prints "Hello Valerio!"
```

## Why Use declare(strict_types=1)?

Enforcing strict typing can significantly improve your code's reliability in certain scenarios.

Strict typing helps prevent unexpected type-related issues that can lead to runtime errors or incorrect behavior. It ensures that you're always working with the data types you expect.

For example, consider a function that is supposed to add two numbers:

```php
function add($a, $b) 
{
    return $a + $b;
}

$result = add(5, '10'); // Without strict typing, this is allowed.
echo $result; // Output: 15
```

Without strict types, PHP would coerce the string '10' to an integer and produce a result that might not be what you intended.

With declare(strict_types=1):

```php
<?php

declare(strict_types=1);

function add(int $a, int $b) 
{
    return $a + $b;
}

$result = add(5, '10'); // Fatal error: Uncaught TypeError
```

With strict types enabled, PHP throws a \`TypeError\` and prevents the function from running, ensuring type safety.

## Which strategy to choose?

Type safety is useful in various aspects of software development and can enhance the reliability and maintainability of your code. But it's not the holy grail.

I strongly advise against mixing the two strategies. Don't activate this language behaviour just in two or three files. It can only make more difficult to understand why an error is happening if your code runs under different rules in some parts of your application.

If you prefer strict type use it throughout the code. Otherwise modern PHP offers many other tools to enforce explicit code declaration. You have extensive support for type declaration in function arguments, return types, class properties, triple equals, and more.

Furthermore working with HTTP requests can be frustrating with strict typing enabled, since in HTTP requests everything is a string. Make your tests to avoid unnecessary headaches.

## Other resources

If you find this article interesting you can find many other resources on our blog like:

- [PHP Iterators for walking through data structures](/php-iterators-for-walking-through-data-structures-fasttips/)
- [Get the client IP address in Laravel](/get-the-client-ip-address-in-laravel-fast-tips/)
- [Custom Laravel Eloquent Collections](/create-and-use-custom-laravel-eloquent-collections/)
