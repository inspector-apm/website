---
title: "Make your application scalable optimizing the ORM performance"
slug: "make-your-application-scalable-optimizing-the-orm-performance"
section: "inspector"
permalink: "/make-your-application-scalable-optimizing-the-orm-performance/"
original_url: "https://inspector.dev/make-your-application-scalable-optimizing-the-orm-performance/"
date: "2020-05-06T14:31:00Z"
updated: "2025-04-29T14:36:54Z"
author: "Valerio Barbera"
category: "Application Scalability"
categories: ["Application Scalability", "Database", "Software development"]
tags: []
description: "A guide about a set of ORMs optimization strategies that are used in critical backend services to improve perfomance and reliability."
focus_keyword: "scalable application monintoring"
seo_title: "Make your application scalable optimizing ORM performance | Inspector"
featured_image: "../images/make-your-application-scalable-optimizing-the-orm-performance/featured.png"
wp_id: 1299
---

Hi, I’m Valerio, software engineer from Italy and CTO at Inspector.

In this article I would share a set of **ORMs optimization strategies** that I’m using in almost every backend service I’m working on.

I’m sure each one of us has complained about a machine or application being slow or even dead, and then spent time at the coffee machine waiting for the results of a long running query.

How can we fix that?

Let’s start with ORM optimization strategies.

## Database is a shared resource

Why so many performance issues are caused by the database?

We often forget that each request is not independent of other requests.

If one request is slow, it’s unlikely to affect the others… right?

Database is a shared resource used by all processes that runs in your application. Even just one poorly designed access can hurt the performance of the whole system.

So, be careful with thinking “*it’s okay if this piece of code isn’t optimized*“. One slow database access can hurt the performance of the whole system, causing negative experiences to your users.

## N+1 database queries problem

What is the N+1 problem?

This is a typical problem encoutered using an ORM to interact with the database. It’s not a SQL coding issue.

When you use an ORM like Eloquent, it isn’t always obvious what queries will be made and when. For this particular problem we talk about **relationships** and eager load.

Any ORM allows you to declare relationships between entities providing a great API to navigate our database structure.

“*Article and Author*” is great example.

```php
/*
* Each Article belongs to an Author
*/
$article = Article::find("1");
echo $article->author->name;

/*
* Each Author has many Articles
*/
foreach (Article::all() as $article)
{
    echo $article->title;
}
```

But we need to code with care using **relations** inside a **loop**.

Take a look on the example below.

We want add the author’s name next to the article’s title. Thanks to the ORM we can navigate the *one-to-one* relation between Article and Author to get its name.

It sounds really simple:

```php
// Initial query to grab all articles
$articles = Article::all();

foreach ($articles as $article)
{
    // Get the author to print the name.
    echo $article->title . ' by '. $article->author->name;
}
```

We have fallen into the trap.

**This loop generate 1 initial query to grab all articles:**

```sql
SELECT * FROM articles;
```

**and N queries to get the author for each article to print the “name” field. Also if the author is always the same.**

```sql
SELECT * FROM author WHERE id = [articles.author_id]
```

**N+1 queries precisely.**

It may not seem like such an important problem. Fifteen or Twenty query could be appears as not an immediate issue to be addressed. Be careful and review the first part of this article:

- Database is a resource shared by all processes.
- Database machine has limited resources, or if are using a managed service, more database load may be imply more costs.
- If your database is located in a seprated machine all data needs to be transfered with additional network latency.

## [Solution] Use eager laoding

As mentioned in the [Laravel documentation](https://laravel.com/docs/master/eloquent-relationships#eager-loading), we can easily fallen into the N+1 query problem because when accessing Eloquent relationships as properties (`$article->author`), the relationship data is “lazy loaded”. **This means the relationship data is not actually loaded until you first access the property.**

However we can load all relationships data with a simple method, so when you access Eloquent relationship as property, it will not run a new query, because tha data has already been loaded by the ORM.

This tactic is called “eager load”, supported by all ORM.

```php
// Eager load authors using "with".
$articles = Article::with('author')->get();

foreach ($articles as $article)
{
    // Author will not run a query on each iteration.
    echo $article->author->name;
}
```

Eloquent provides the method `with()` to eager load relationships.

In this case only two queries wil be executed.

The first is needed to load all articles:

```sql
SELECT * FROM articles;
```

The socond is by the `with()` methods and it will retrieve all authors:

```sql
SELECT * FROM authors WHERE id IN (1, 2, 3, 4, ...);
```

Eloquent will map the data internally to be used as usual:

```php
$article->author->name;
```

## Optimize select statements

For long time I thought that explicitly declare the number of fields in a select query didn’t bring a significant performance improvement, so I took advantage of simplicity of just getting all the fields for my queries.

Furthermore hard coding the fields list for a specific select, is not an easy to maintain code statement.

The biggest mistake behind this argument is that it could be true from the database perspective.

But we are using the ORM, so the data selected from the database will be loaded in memory on the PHP side to be managed by the ORM. The more fields we grab the more memory the process will take.

Laravel Eloquent provides the “select” method to limiting the query to only the columns we needs:

```php
$articles = Article::query()
    ->select('id', 'title', 'content') // The fields you need
    ->latest()
    ->get();
```

Excluding fields PHP does not have to process this data, so you can significantly reduce the memory consumption.

Not selecting everything can also improve sorting, grouping and join performance because the database can save memory that way.

## Use MySQL views

Views are SELECT queries built on the top of other tables and stored in the database.

When we performs a `SELECT` against one or more table, the database needs to compile your SQL statement, verify that it doesn’t contain errors, and execute the data selection.

Views are pre-compiled `SELECT` statements, so MySQL can runs the underline query immediately.

Furthermore MySQL is generally smarter than PHP when it comes to filtering data. Compared to using collections or array functions in PHP, **there’s a big performance gain.**

> *If you want learn more about MySQL capabilities for database intensive applications, take a look on this amazing website:* [***https://www.mysqltutorial.org/***](https://www.mysqltutorial.org/)

## Attach an Eloquent Model to a View

Views are “virtual tables”. They appears as normal tables from the ORM point of view.

That’s why we can create an Eloquent Model to query data inside the View.

```php
class ArticleStats extends Model
{
    /**
    * The name of the view is the table name.
    */
    protected $table = "article_stats_view";
 
    /**
    * If the resultset of the View include the “author_id”
    * we can use it to retrieve the author as normal relation.
    */
    public function author()
    {
        return $this->belongsTo(Author::class);
    }
}
```

**Relations works as usual, also casting, pagination, etc, and there no more performance impact.**
