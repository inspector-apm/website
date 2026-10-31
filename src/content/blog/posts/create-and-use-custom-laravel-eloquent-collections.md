---
title: "Custom Laravel Eloquent Collections - Fast tips"
slug: "create-and-use-custom-laravel-eloquent-collections"
section: "inspector"
permalink: "/create-and-use-custom-laravel-eloquent-collections/"
original_url: "https://inspector.dev/create-and-use-custom-laravel-eloquent-collections/"
date: "2023-05-28T15:52:33Z"
updated: "2024-11-07T12:13:53Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Database", "Fast tips", "Software development"]
tags: ["Laravel", "PHP", "orm", "software development"]
description: "How to create and use custom Laravel Eloquent collections, with practical examples to demonstrate their usefulness."
focus_keyword: "custom Laravel Eloquent Collections"
featured_image: "../images/create-and-use-custom-laravel-eloquent-collections/featured.png"
wp_id: 5758
---

Eloquent is one of the most powerful components of the Laravel framework. It's an Object-Relational Mapping (ORM) tool that simplifies database interactions. It provides a convenient way to work with database records through its built-in collections. While Laravel comes with a variety of pre-defined collection methods, you can also extend the basic **Illuminate\\Database\\Eloquent\\Collection** class to simplify recordsets manipulation.

In this tutorial, we will explore how to create and use custom Laravel Eloquent collections, with practical examples to demonstrate their usefulness.

## Understanding Laravel Eloquent Collections

Before diving into custom Eloquent collections, let's briefly understand the concept of what they are. Eloquent collections are PHP arrays with additional helper methods that provide a convenient way to work with sets of Eloquent model records.

They offer a range of useful methods for filtering, mapping, sorting, and manipulating data.

## Creating a Custom Eloquent Collection

To create a custom Eloquent collection, you need to extend the base **Illuminate\\Database\\Eloquent\\Collection** class provided by Laravel. This base class provides several helper methods and features that can be leveraged when creating your custom collection.

```php
use Illuminate\Database\Eloquent\Collection;

class CustomCollection extends Collection
{
    // Your custom collection methods goes here
}
```

To make your custom Eloquent collection more powerful, you can add your own methods. These methods can be specific to your application's domain or offer additional convenience when working with collections.

This strategy can allows you to incapsulate certain logic in a single class that can be reused across the application.

## Real life example of Custom Eloquent Collection

Let's consider an example of a booking system where we want to resort the internal items according to specific characteristics, but it is much easier to do at code level instead than SQL.

```php
namespace App\Collections;

use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;

class AvailableRoomsCollection extends Collection
{
    public function __constructor($data)
    {
        $this->sortBy(function (Room $room) {
            // Apply sorting logic
        });
    }
}
```

Or you can add a specific method to be called externally.

```php
namespace App\Collections;

use App\Models\Room;
use Illuminate\Support\Collection;

class AvailableRoomsCollection extends Collection
{
    public function sortByAvailability()
    {
        return $this->sortBy(function (Room $room) {
            // Apply sorting logic
        });
    }
}
```

Since your custom collection is automatically sorted when created, you can use it in one or more controllers with the convenience of having the sorting logic encapsulated in the collection itself:

```php
namespace App\Http\Controllers;

use App\Collections\AvailableRoomsCollection;
use App\Models\Room;
use Illuminate\Http\Request;

class AvailabilityController
{
  public_function index(Request $request)
  {
    return new AvailableRoomsCollection(Room::filter($request->filter)->get());
  }
}
```

You can also implement the **newCollection** method directly in the **Room** model class to automatically get the custom colleciton instance as a query result:

```php
use App\Collections\AvailableRoomsCollection;
use Illuminate\Database\Model;

class Room extends Model
{
    ...

    /**
     * Create a new Eloquent Collection instance.
     *
     * @param  array  $models
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function newCollection(array $models = []): AvailableRoomsCollection
    {
        return new AvailableRoomsCollection($models);
    }

    ...
}
```

You can simplify the Controller even more by returning the result of the query directly.

```php
class AvailabilityController
{
    public_function index(Request $request)
    {
        return Room::filter($request->filter)->get();
    }
}
```

Custom Laravel Eloquent collections provide a way to extend the functionality of the default collection methods and add convenience methods and behaviours tailored to your application's needs. By creating custom collections you can streamline your codebase.

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**. I post about building my SaaS business.
