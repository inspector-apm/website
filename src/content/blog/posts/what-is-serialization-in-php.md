---
title: "What is serialization in PHP"
slug: "what-is-serialization-in-php"
section: "inspector"
permalink: "/what-is-serialization-in-php/"
original_url: "https://inspector.dev/what-is-serialization-in-php/"
date: "2022-02-19T13:30:00Z"
updated: "2024-11-07T12:14:11Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["Laravel", "PHP", "software development"]
description: "How serialization works in PHP. How it is used for system integration. Laravel Queue example with Eloquent Models."
focus_keyword: "serialization in php"
featured_image: "../images/what-is-serialization-in-php/featured.png"
wp_id: 5526
---

In PHP, serialization is the process of converting a data structure or object into a string representation that can be stored or transmitted. This allows you to save the state of an object or data structure to a database, cache, or send it over a network connection, and then later recreate the object or data structure from the serialized string.

Here is an example of how to serialize an object in PHP:

```php
class User
{
    public $name;
    public $email;

    public function __construct($name, $email)
    {
        $this->name = $name;
        $this->email = $email;
    }
}

$user = new User('John', 'john@example.com');

$serializedUser = serialize($user);

echo $serializedUser;
```

The output of this code would be a string representation of the `$user` object, similar to this:

```php
O:4:"User":2:{s:4:"name";s:4:"John";s:5:"email";s:17:"john@example.com";}
```

The serialization format in PHP is fairly simple. The serialized string consists of a series of data types and values, each separated by a colon. For example, the serialized string for an integer would be **i:123**, while the serialized string for a string would be **s:5:"Hello"**.

To unserialize this string back into its original form, you can use the `unserialize()` function:

```php
$unserializedUser = unserialize($serializedUser);

echo $unserializedUser->name; // John
echo $unserializedUser->email; // john@example.com
```

## Hooks in serialization and unserialization processes

There are two hooks available in PHP to interact with this process. These hooks allow you to define custom functions that will be called when an object is serialized or unserialized. This can be useful for performing custom actions when an object is serialized or unserialized, such as logging or validation.

**\_\_sleep() hook**: This hook is called during serialization, before an object's properties are serialized. It allows developers to specify which properties should be serialized and which should be excluded.

```php
class MyClass 
{
    private $data;
    private $secret;

    public function __sleep() {
        return ['data'];
    }
}
```

**\_\_wakeup() hook**: This hook is called during unserialization, after an object's properties have been unserialized. It allows developers to perform any necessary initialization or setup on the object after it has been unserialized.

```php
class MyClass 
{
    private $data;
    private $secret;
  
    public function __wakeup() {
        $this->secret = '123456';
    }
}
```

## How to use serialization to communicate with external services

To use serialization to communicate with external services, you can use PHP's built-in functions for sending HTTP requests, such as `file_get_contents()` or `curl_exec()`. You can then pass the serialized data as a parameter in the request, and the external service can unserialize the data on its end to access the information.

Here's an example of using serialization to send data to an external service:

```php
$data = [
    "name" => "John", 
    "age" => 30
];

// Serialize the data
$serializedData = serialize($data);

// Send the serialized data to the external service using HTTP POST
$ch = curl_init("http://example.com/service");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "data=" . $serializedData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// Handle the response from the service
echo $response;
```

On the external service, you would then use the `unserialize()` function to convert the serialized data back into a PHP data structure or object.

```php
// Get the serialized data from the HTTP POST request
$serializedData = $_POST['data'];

// Unserialize the data
$data = unserialize($serializedData);

// Use the data
echo "Name: " . $data['name'] . "\n";
echo "Age: " . $data['age'] . "\n";
```

## A practical example of serialization - Laravel Queue

The first time I needed to delve into this topic was because of the Laravel Queue system.

If you want to learn more about our implementation of the Laravel Queue system, you can read this article: [https://inspector.dev/what-worked-for-me-using-laravel-queues-from-the-basics-to-horizon/](/what-worked-for-me-using-laravel-queues-from-the-basics-to-horizon/)

When Laravel store a Job class into the queue service (which can be Redis, AWS SQS, or similar) the object is serialized. When you create a new Job class in Laravel it ships with the **SerializesModels** trait included.

```php
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

class ExampleJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //
    }
}
```

If your job class contains references to Eloquent models, this trait allows you to customize the serialization process. It contains an implementation of the hooks seen above:

```php
namespace Illuminate\Queue;

trait SerializesModels
{
    use SerializesAndRestoresModelIdentifiers;

    /**
     * Prepare the instance for serialization.
     *
     * @return array
     */
    public function __sleep()
    {
        // ...
    }

    /**
     * Restore the model after serialization.
     *
     * @return void
     */
    public function __wakeup()
    {
        // ...
    }

    /**
     * Prepare the instance values for serialization.
     *
     * @return array
     */
    public function __serialize()
    {
        // ...
    }

    /**
     * Restore the model after serialization.
     *
     * @param  array  $values
     * @return void
     */
    public function __unserialize(array $values)
    {
        // ...
    }
}
```

As mentioned in the [Laravel documentation](https://laravel.com/docs/9.x/queues#class-structure):

> If your queued job accepts an Eloquent model in its constructor, only the identifier for the model will be serialized onto the queue. When the job is actually handled, the queue system will automatically re-retrieve the full model instance and its loaded relationships from the database. **This approach to model serialization allows for much smaller job payloads to be sent to your queue driver**.

But there may also be side effects to watch out for. For example the record could be modified by other processes before the Job is executed. So you always have to take in consideration the asynchronous nature of this architecture.

## Serialization interoperability

serialize() and unserialize() was PHP's default serialization technique. They are used to transfer PHP objects to external services but they are strictly coupled with PHP specifications.

In fact, there are many libraries in other programming languages that allow you to serialize objects and data structures according to the PHP standard, like this one in Java just for example:

[https://github.com/marcospassos/java-php-serializer](https://github.com/marcospassos/java-php-serializer)

An alternative to this specific format you can use the JSON standard to transfer data to external services without worrying about the technology with which the recipient service is developed. PHP supports this kind of serialization through the two functions: [json_encode](https://www.php.net/manual/en/function.json-encode.php), [json_decode](https://www.php.net/manual/en/function.json-decode.php).
