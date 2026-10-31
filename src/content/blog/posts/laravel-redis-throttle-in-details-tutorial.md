---
title: "Laravel Redis Throttle Fine Tuning: Tutorial"
slug: "laravel-redis-throttle-in-details-tutorial"
section: "inspector"
permalink: "/laravel-redis-throttle-in-details-tutorial/"
original_url: "https://inspector.dev/laravel-redis-throttle-in-details-tutorial/"
date: "2024-04-15T10:07:19Z"
updated: "2024-11-07T12:15:12Z"
author: "Valerio Barbera"
category: "Application Scalability"
categories: ["Application Scalability", "Components", "SaaS", "Software development"]
tags: ["Laravel", "PHP", "scalability", "software development"]
description: "Learn how to fine tune Laravel Redis Throttle to control large amount of traffic and background jobs execution."
focus_keyword: "Laravel Redis Throttle"
featured_image: "../images/laravel-redis-throttle-in-details-tutorial/featured.png"
wp_id: 6302
---

Redis Throttle is a fantastic feature provided by the Redis facade in the Laravel framework. It’s a convenient way to limit the rate at which certain actions can be performed.

```php
Redis::throttle("rate-limiter-{$action->id}") // Rate limiter key
    ->allow(100) // No. executions permitted
    ->every(10) // Time range in seconds
    ->then(function () {
	
        // Lock acquired
        // Your code here...
        $action->run();
		
    }, function () {
	
        // Lock not acquired.
		
    });
```

## How Laravel Redis throttle works

The **throttle()** method allows you to go through the following process:

1. **Determining the Key**: The first parameter of the throttle() method is a string used as a reference for the rate limiter. You should build the key to separate throttling for each action you want to control.
2. **Acquiring a Lock**: Laravel first attempts to acquire a lock using Redis. This lock prevents race conditions that could occur when multiple requests are processed simultaneously.
3. **Tracking Locks**: Once the key is determined, Laravel uses Redis to store information about the lock acquisition request, such as the timestamp of the last request and the number of requests made within a certain time period.
4. **Throttling Logic**: The **then()** method evaluates the information against the configured throttling limits to determine if the callback can be executed or not. Throttling limits include a maximum number of requests allowed and for a specific time window (e.g., 60 requests per minute).
5. **Enforcing Throttling**: If the request exceeds the throttling limits, Laravel prevents further processing and runs the second callback to allow developers to manage the case of exceeding throttle limits.

## What is an Atomic Lock in Redis

An atomic lock in Redis is a mechanism that allows multiple clients to coordinate and synchronize access to a shared resource. It ensures that only one client can hold the lock at a time, preventing concurrent access and maintaining data integrity.

In Redis, an atomic lock is typically implemented using the SETNX (SET if Not eXists) command. The SETNX command sets a key in Redis only if the key does not already exist. If the key is successfully set, it means the lock is acquired by the client. If the key already exists, it means another client holds the lock, and the current client cannot acquire it.

## Laravel Redis Throttle Fine-Tuning

Beyond the basic arguments, the **throttle()** method offers a fluid interface to access other parameters that allow you to fine-tune the throttling strategy for particular needs.

I want to focus this chapter on two parameters: **timeout**, and **sleep**.To better understand how these parameters change the behavior of throttling, and the potential side effects you can experience, we have to analyze the internal implementation of the *Illuminate\\Redis\\Limiters\\DurationLimiter* class:

```php
/**
 * This is the method that launch the throttling process.
 * It uses an instance of \Illuminate\Redis\Limiters\DurationbLimiter class.
 * 
 * Redis::throttle($key)->then(callback, callback);
 */
public function then(callable $callback, callable $failure = null)
{
    try {
        return (new DurationLimiter(
            $this->connection, $this->name, $this->maxLocks, $this->decay
        ))->block($this->timeout, $callback, $this->sleep);
    } catch (LimiterTimeoutException $e) {
        if ($failure) {
            return $failure($e);
        }

        throw $e;
    }
}


/**
 * This is the real implementation of the DurationLimiter::block method.
 */
public function block($timeout, $callback = null, $sleep = 750)
{
    $starting = time();

    while (! $this->acquire()) {
        if (time() - $timeout >= $starting) {
            throw new LimiterTimeoutException;
        }

        Sleep::usleep($sleep * 1000);
    }

    if (is_callable($callback)) {
        return $callback();
    }

    return true;
}
```

The purpose of the **block()** method is to acquire a lock from Redis in order to perform throttling or rate limiting.

## How Laravel uses Redis atomic locks for throttling or rate limiting

When a client wants to perform an action that is subject to throttling, Laravel attempts to acquire a lock using the **acquire()** method.

Laravel Redis throttle uses the SETNX (Set If Not Exists) command to attempt to set the lock key in Redis. If the key is successfully set, it means the lock is acquired by the client.

If the lock is acquired, Laravel proceeds with executing the throttled action.

After the action is completed, Laravel releases the lock by deleting the lock key from Redis using the DEL command.

If the lock is not acquired (i.e., the key already exists), it means another client is holding the lock. In this case, Laravel's **block()** method enters a loop where it repeatedly attempts to acquire the lock until a specified timeout is reached.

Within the loop, Laravel introduces a delay between each attempt to acquire the lock using the **Sleep::usleep()** function. This delay helps to prevent excessive CPU usage and allows other clients to acquire the lock.

If the lock is successfully acquired within the specified timeout, Laravel proceeds with executing the throttled action. If the timeout is reached and the lock is still not acquired, Laravel throws a *LimiterTimeoutException* to indicate that the lock could not be acquired. The fallback closure is executed in this case.

Now, let's focus on the effects (or side effects potentially) of the $timeout and $sleep parameters.

### The Timeout parameter

The $timeout parameter determines the maximum amount of time the method will wait to acquire the lock before giving up and allow the throttle method to call the failure callback.

If the $timeout is set to a lower value, the method will give up sooner if the lock is not acquired, potentially leading to more frequent timeouts and exceptions.

If the $timeout is set to a higher value, the method will wait longer for the lock, increasing the chances of acquiring it but also potentially causing longer blocking times, slowind down the consume of messages from the queue.

### The Sleep parameter

The $sleep parameter determines the amount of time the method will pause between each attempt to acquire the lock.

It helps to introduce a delay and prevent excessive CPU usage by constantly trying to acquire the lock in a tight loop.

A smaller $sleep value will result in more frequent attempts to acquire the lock, potentially increasing the responsiveness of the method but also increasing CPU usage.

A larger $sleep value will introduce longer delays between attempts, reducing CPU usage but potentially increasing the overall time taken to acquire the lock.

The choice of $timeout and $sleep values depends on the specific requirements of the application and the expected load.

## Inspector Use Case For Laravel Redis Throttle

As CTO of Inspector I had a chance to go deeper into this feature because of the high traffic we deal with, and the very big impact this fine tuning has on our infrastructure utilization patterns and the costs that it implies.

We have a rate limiter in place for every Inspector account to prevent our databases from being flooded with requests from a single account, and negatively affect data ingestion for other customers.

One of the most common limits we use allows for 200 messages every second. It should look like this:

```php
Redis::throttle("rate-limiter-{$organization->id}")
    ->allow(200) // No. executions permitted
    ->every(1) // One second time window
    ->then(function () {
	
        // Lock acquired
        // Your code here...
        $this->process();
		
    }, function () {
	
        // Lock not acquired.
        $this->release($this->attempts());
	
    });
```

If this rate limit is reached by an account the system reschedules the data to be processed later with a delay proportionate to the number of ingestion attempts. It’s a way to wait for a less busy time window. No data is lost, it will simply be ingested with a little delay in the case of large traffic peaks.

Using the default $timeout and $sleep parameters causes the number of jobs consumed from the queue to be too slow, and sometimes jobs accumulate in the queue.

I think the issue was because I decided to set a so tight time window (one second) and the big amount of incoming requests (10.000 per minute) we normally have against our system.

The solution was to set the $timeout parameter to 0:

```php
Redis::throttle("rate-limiter-{$organization->id}")
    ->allow(200) // No. executions permitted
    ->every(1) // One second time window
    ->block(0) // Set the timeout to zero
    ->then(function () {
	
        // Lock acquired
        // Your code here...
        $this->process();
		
    }, function () {
	
        // Lock not acquired.
        $this->release($this->attempts());
		
    });
```

With zero **$timeout** the while cycle doesn’t wait to acquire the lock multiple times. It just picks the message from the queue, and if the lock isn’t available immediately calls the **$failure** callback.

The failure callback reschedules the job onto the queue with a delay, so the worker can immediately pick another message from the queue without waiting for multiple attempts to acquire the lock. This was why the workers weren’t processing enough jobs. With timeout and sleep the workers’ processes remained busy doing nothing, just waiting for the lock.

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**. I post about building my SaaS business.
