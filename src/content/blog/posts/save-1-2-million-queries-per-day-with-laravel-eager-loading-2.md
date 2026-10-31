---
title: "Save 1.2 million queries per day with Laravel Eager Loading"
slug: "save-1-2-million-queries-per-day-with-laravel-eager-loading-2"
section: "inspector"
permalink: "/save-1-2-million-queries-per-day-with-laravel-eager-loading-2/"
original_url: "https://inspector.dev/save-1-2-million-queries-per-day-with-laravel-eager-loading-2/"
date: "2024-12-18T10:22:30Z"
updated: "2024-12-18T10:22:30Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Application Scalability", "Database", "Software development"]
tags: ["Laravel", "PHP", "software development"]
description: "How eager loading works in Laravel. A real life example of how I saved millions of queries simply studying deeper Laravel eager loading."
focus_keyword: "Laravel Eager Loading"
seo_title: "Save 1 million queries with Laravel Eager Loading | Inspector"
featured_image: "../images/save-1-2-million-queries-per-day-with-laravel-eager-loading-2/featured.png"
featured_image_alt: "Laravel Eager loading inspector monitoring"
wp_id: 5868
---

In this article I discussed how we saved 1.2 million queries per day making a better use of Laravel Eloquent Eager Loading.

Since various elements of the Inspector backend rely on Laravel, I worked a lot with the ORM component myself, and its Eager Loading features.

The tradeoff in using an ORM always remains tremendously positive for developers. Laravel Eloquent (the Laravel’s ORM) has meant for me a huge increase in productivity and flexibility in building Inspector.

But it’s a technical tool. As our application grows or is subject to ever higher load, we need to improve the use we make of our technology stack.

As I always say to my collaborators “it’s a good thing”. It’s because the business is growing.

I’m Valerio, software engineer and CTO at Inspector. In this article I’ll show you how I saved 1.2 million queries per day using Eager Loading correctly.

Let’s first clarify what eager loading in Laravel means before continuing.

## Eager Loading in Laravel

Working with databases is incredibly easy thanks to object relational mapping (ORM). Although querying related model data is made simple by object-oriented definitions of database relationships, developers could overlook the underlying database calls.

Eloquent is part of Laravel and makes working with your database fun.

How is the ORM expected to understand your intentions, after all?

**Eager Loading** means you get all of the required data at the same time. In contrast, **Lazy Loading** only retrieves related things when they are actually needed and only gives you one item at a time.

Let me show you a real life example. Consider a database with two tables: *posts* and *comments*.

A post naturally contains numerous comments since all comments have a post_id field on them that links them to the corresponding posts (1 to N relation or hasMany).

Below there are the Post and Comment Eloquent models.

```php
namespace AppModels;

use IlluminateDatabaseEloquentModel;

class Post extend Model
{
    /**
     * The comments associated to the post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

```php
namespace AppModels;

use IlluminateDatabaseEloquentModel;

class Comment extend Model
{
    /**
     * The Post that own the comment.
     */
    public function comments(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
```

Let’s say that the posts table contains 10 items. To access all posts, we just need to:

```php
$posts = Post::all();
```

Then, to get every comment connected to a post, we might do something like this:

```php
foreach ($posts as $post) {
    echo $post->comments->count();
}
```

We have concurrently loaded all 10 posts and their comments using the “with” method. Eloquent will hydrate the internal comment property of the post model, so when you use it in your code it won’t run a new query but can rely on previously fetched data. This will avoid the additional (+1) query on each post’s iteration.

Since various elements of the Inspector backend system rely on it, I worked a lot with this framework’s component myself. Later I will explain how I saved more than 1 million queries per day using this technique.

## Eager Loading Multiple Relationships

Let’s imagine that our Post model has another relationship, such as Category:

```php
namespace AppModels;

use IlluminateDatabaseEloquentModel;

class Post extend Model
{
    /**
     * The category that own the post.
     */
    public function category(): HasMany
    {
        return $this->belongsTo(Category::class);
    }
	
    /**
     * The comments associated to the post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

We can simply retrieve the relationships without our code needing to hit the database repeatedly:

```php
$posts = Post::with('comments', 'category')->get();

foreach ($posts as $post) {
    echo "Category name is {$post->category->name}";

    foreach ($post->comments as $comment){
        echo "Comment is {$comment->message}";
    }
}
```

If you plan to loop for more relationships during the rest of the execution.

There are many other options you can use to take advantage from this feature, so I strongly recommend that you consult the official documentation for all possible configurations:

[https://laravel.com/docs/master/eloquent-relationships#eager-loading](https://laravel.com/docs/master/eloquent-relationships#eager-loading)

## How I saved 1.2 million queries per day with Laravel Eager Loading

Recently we decided to rely on a Cache layer in order to offload the SQL database from some queries that are executed millions of times every day.

The cache layer is structured following the Repository Pattern. You can read more about our implementation in the article below:

Following the same schema of the example above with posts and comments, our users can have multiple subscription plans.

In the cache layer we cache the result of the query below:

[How and why we implemented the "Repository Pattern" in our PHP backend](/demystifying-the-repository-pattern-in-php/)

Here was the bug.

In order to use the eager loaded plans we have to use the $this->plans property not the method.

Invoking $this->plans() Eloquent will run the query again.

It was enough to remove the parentheses from the statement to tell Eloquent to use preloaded records and avoid the execution of 1.2 million queries per day.

```php
public function get($id): User
{
    return User::with('plans')->findOrFail($id);
}
```

In the image below you can see the magnitude of reduction in the number of queries per second.

CTA

## Laravel Eager loading inspector monitoring

### Conclusion

The advantage of eager loading over lazy loading is that everything is available at once. Users experience no lag when obtaining data, and the number of queries they send to the database is drastically reduced.

The cons are:

The initial query takes a little more time to run

Naturally loading more records needs more memory

And more bandwidth to transmit more data
