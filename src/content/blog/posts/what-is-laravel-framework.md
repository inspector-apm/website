---
title: "What is Laravel framework, and why is it so popular?"
slug: "what-is-laravel-framework"
section: "inspector"
permalink: "/what-is-laravel-framework/"
original_url: "https://inspector.dev/what-is-laravel-framework/"
date: "2020-09-23T15:10:45Z"
updated: "2024-11-07T12:14:32Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: []
description: "What is Laravel, what is a framework, why Lavarel is so popular, how to monitor it. Enjoy our complete guide!"
focus_keyword: "inspector laravel"
seo_title: "What is Lavarel? How to monitor it? | Inspector"
featured_image: "../images/what-is-laravel-framework/featured.jpg"
featured_image_alt: "What is Laravel and why it's so popular"
wp_id: 1725
---

Hi, I'm Valerio, Software engineer and CTO at Inspector.

If you are a developer, you’ve probably been pushed by everyone to learn a framework to develop your applications.

But in every developer’s journey comes the moment to take a decision. It’s almost always the same moment we finally find the business idea we want to dedicate all our effort.

This choice is never easy. The main reason developers get struggle thinking about a framework is the fear of being conditioned in the future.

Adopting a framework instead can lead to great results, and can give you the ability to build assets that can lead you to professional success.

## What is a framework

For a developer, **the most valuable asset is to define a process**.

Try to imagine how much easier your job would be if you had a clear, defined method to develop your applications that is repeatable and even automatable.

The advice I repeat every day to my collaborators is:

> *Stop looking for tools or libraries to write less code. Instead, find a design that can help you to define the right process to solve a specific issue in a long-term way.*

Think about the word "framework". It consists of two words: "frame" - "work". It's like an organized work scheme. So each framework is like a proposal, that's why you can prefer Symfony instead of Laravel, because their organizational foundations are different based on the challenge that the community has faced over time.

Anyway these organizational proposals are the results of the work of many experienced developers.

Say no to a good framework is like saying no to an international team of experienced developers who make applications for successful businessess. They give you advice on how to reach your goals and you say no… Be careful?

For example, if you spend time studying how to handle authentication using a framework instead of coding it from scratch, it doesn’t mean you’re wasting your time, because you will never be able to do it in a repeatable way or without errors.

**The first step is to understand that start with a framework is not an admission of ignorance but rather a wise way to reach our business goals as quickly as possible.**

## What is Laravel and why it is used?

Help developers simplify their development process with clean and reusable code is the claim of every framework. So the real quistion should be how Laravel accomplish this mission better than any other framework out there.

## Easy to use

Taylor Otwell and his community, developed Laravel focusing their attention on wrinting fluent, clear, and natural to understand code APIs.

Classes and methods name are always clear in their purpose and also the namespaces and framework organization appears so clear and familiar from the first day.

Simplicity is a feature that has always guaranteed great results in the technology space. But it takes a lot of effort to achieve it. Laravel has also a fantastic documentation portal that surely costs a lot of time to be maintained and updated over time.

## Availability of Pre-built Components

Inside Laravel you have a lot of infrastructure functionalities ready to use by default.

Its driver based architecture helps maintainers and users to continuous adjust and expand framework functionalities and integrations.

From basics components like the template engine, routing, Log management, [Eloquent ORM](/make-your-application-scalable-optimizing-the-orm-performance/), to advanced modules like Filesystem abstraction, Redis client, and the powerful Artisan console or the Jobs/Queues system.

Regarding in particular the queuing system with the version 8 of the framework it introduced some features that you can find only in commarcial licensed solution in other environment.

The components ecosystem consist also in a set of official packages to address some common use case developing a cloud application like [Passport](https://laravel.com/docs/master/passport) as the official OAuth server, [Socialite](https://laravel.com/docs/master/socialite) to provides social authentication to your users, [Horizon](https://laravel.com/docs/master/passport) to watch inside your Redis queue system, [Cashier](https://laravel.com/docs/master/billing) for billing and many more.

## Laravel Validation

I would reserve a special mention to the Laravel validation system that is one of the best example of the Object Orientend mindset with which Laravel is developed.

Next to a lot of predefined validation rules, you can build custom validation rule as reusable class.

As an example I developed an email validator that check an email through the ApiLayer API to avoid registration by spam email address in my app.

Here is the validation rule class:

```php
class EmailSpamChecker implements Rule
{
    /**
     * @var Client
     */
    protected $http;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->http = new Client([
            'base_uri' => 'http://apilayer.net/api'
        ]);
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        try{

            $response = $this->http->get('/check', [
                'query' => [
                    'access_key' => config('services.mailboxlayer.key'),
                    'email' => $value,
                ]
            ])->getBody();

            $response = json_decode($response, true);

            return $response['format_valid'] && !$response['disposable'];

        } catch (\Exception $exception) {
            report($exception);
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Invalid email address.';
    }
}
```

That you can easily use in your controllers:

```php
return Validator::make($data, [
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'string', 'email', 'min:5', new EmailSpamChecker()],
    'password' => ['required', 'string', 'min:6', 'max:20'],
]);
```

## Optimized for security out of the box

Application security, or system security in general, depends by developers best practices and experience. Anyway Laravel helps developers to avoid a lot of risks based on common security vulnerability, probably the best PHP framework in this field, thanks to its built-in protection features like security against cross-site scripting, SQL injections, cross-site request forgeries and more.

## A solid company behind

One of the most undervalued aspect talking about Laravel is the solidity of the commercial products ecosystem that the Laravel team created in the last few years.

This aspect could sounds off topic related to an open source project, but I really believe that it is totally the opposite.

With a commercial ecosystem Laravel founders have built the right foundation to ensure a stable future and a long-term perspective for companies and developers that rely on Laravel to develop their business.

## A great ORM (Object Relationship Mapping)

Database is a shared resource used by all processes that runs in your application. Even just one poorly designed access can hurt the performance of the whole system.

A good database access layer can speed up your development process without compromise the application integrity and performance.

Learn more on [how to optimize the ORM performance in a Laravel application](/make-your-application-scalable-optimizing-the-orm-performance/).

## Solve MySQL race condition with Laravel Redis Client

Laravel provides a really great architecture for background Jobs and Queues.

They introduces the ability to execute background tasks in parallel, that is one of the most interesting field for developers committed to scale their application keeping server resources cost-friendly.

One of the most annoying side effect of parallel jobs execution is database race condition. [Learn more how to avoid database dead-lock](/resolved-mysql-lock-wait-timeout-exceeded-using-laravel-queues-and-jobs/).

## Conclusion and introduction to Inspector

Laravel provides really solid bases to build great software, but — when the application starts to serve real users — errors, mistakes, and performance bottlenecks can become the enemy for business growth. Many of us continue to discover bugs and errors in the applications thanks to direct user reports.

This can be dangerous as — when a user reports a problem — it’s can be too late to solve it. For every user that reports a problem, there are many others that simply stop using our application altogether; moving to another product that fits their needs better.

That’s why we introduced Inspector, the Laravel real-time monitoring dashboard ready to use in less than one minute. If you want bring real-time monitoring power in your Laravel application you can read our quick start guide: [**Laravel real time performance monitoring**](/laravel-real-time-performance-monitoring-using-inspector-part-1/)

### Laravel performance metrics

Anyone that has ever made a decision uses or has used averages. They are simple to understand and calculate.

But although all of us use them, we tend to ignore just how wrong the picture that averages paint of the world is.

At this link I talked about [actionable metrics I use to make informed decisions](/metrics-performance-monitoring/).

### E-commerce monitoring

As you probably know Laravel is widly used as basic infrastructure to build great many different types of software like CMS, E-commerce, etc.

Thanks to their Laravel foundation they are a perfect example of how developers can enjoy the Laravel network, integrating all Laravel compatible tools in their system.

Here is an example of how to integrate real-time monitoring in a Bagisto e-commerce in less than one minute: [How to monitor a Bagisto e-commerce in Real-Time using Inspector](/how-to-monitor-a-bagisto-e-commerce-in-real-time-using-inspector/).
