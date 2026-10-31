---
title: "How to accelerate application performance with smart SQL queries."
slug: "how-to-accelerate-application-performance-with-smart-sql-queries"
section: "inspector"
permalink: "/how-to-accelerate-application-performance-with-smart-sql-queries/"
original_url: "https://inspector.dev/how-to-accelerate-application-performance-with-smart-sql-queries/"
date: "2020-10-25T15:43:15Z"
updated: "2024-11-07T12:14:32Z"
author: "Valerio Barbera"
category: "Application Scalability"
categories: ["Application Scalability", "Database"]
tags: []
description: "Learn how smart SQL queries can drastically improve your application performance also using an ORM. Laravel Eloquent examples and more"
focus_keyword: "MySQL performance"
seo_title: "MySQL performance issues? How to use smart queries | Inspector"
featured_image: "../images/how-to-accelerate-application-performance-with-smart-sql-queries/featured.png"
featured_image_alt: "MySQL performance optimizations"
wp_id: 2114
---

### Why so many performance issues are caused by the database?

We often forget that each request or process performed by the application is not "atomic". If one request is slow, it’s likely to affect othersì requests running in parallel.

Database is a shared resource used by all processes that runs in your application. Even just one poorly designed access can hurt the performance of the whole system.

Hi, I'm Valerio software engineer and CTO at inspector. In this article I'll talk about some smart approach to SQL queries that has completely changed some parts of our system, improving application performance for a better customer experience.

If you deal with large datasets, import/export processes, data aggregation algorithms, and similar problems these solutions can help you drastically reduce the consumption of resources by your application and achieve significant economic savings.

## INSERT on duplicate key UPDATE

`insert on duplicate key update` is one of the lesser known MySQL clauses, but that guarantees incredible performance improvements in some specific cases, that can literally save your customers experience.

Thanks to this clause you can instruct MySQL to run an `UPDATE` statement in case the `INSERT` statement goes wrong due to a possible duplicate key in the table.

Let me show a real world example.

### CSV import/export

Let's imagine a process of importing a list of users from a CSV file, where each row need to have a unique email address. Our script should insert new users and update a specific user if the email address already exists.

A first version of this script could be:

```php
// CSV file content
$csv = [...];

foreach($csv as $row)
 {
    $user = User::firstWhere('email', $row['email']);

    if(!$user) {
        $user = new User()
    }

    $user->name = $row['name'];

    // "save" method is smart enough to update a record if it does not exists, otherwise create.
    $user->save();
}
```

For each row we verify if the user with the given email already exists in the database. If the user exists the script update its name and than save, if the user does not exists the script creates a new instance of User and than proceeds with the insert.

In this example we are using the [Eloquent ORM](https://laravel.com/docs/master/eloquent) to interact with the database and the "save()" method is smart enough to update a record if it does not exists, create it otherwise. At the end we run a select to grab the user from the database, and another query to INSERT or UPDATE the record, so two queries for each line in the CSV file.

**This means that for a CSV with 500.000 rows we need to run 1 million queries (500K select, 500K insert or update).**

### Simplify the code

Eloquent, as well as every other decent ORM, provides some shortcut to accomplish this kind of operations, so we can use `updateOrCreate` method to reduce the number of lines for a better readibility:

```php
// CSV file content
$csv = [...];

foreach($csv as $row)
 {
    User::updateOrCreate(
        // Identify record by this columns
        [
            'email' => $row['email']
        ],
        // Other fields to fill
        [
            'name' => $row['email']
        ]
    ]);
}
```

The method has a really clear name and provides a useful functionality, but this is not enough, because it contains the same issue: it runs two queries per CSV rows.

Too many queries means too much time, CPU and memory usage. Instead we aim to reduce the number of database statements to optimize performance and resource consumption by the script.

## How to use "on duplicate key"

This clause is like a "try/catch" statement but for SQL. Here is a raw example:

```sql
INSERT INTO users (email, name) 
    VALUES ('support@wordpress-542944-1738327.cloudwaysapps.com', 'Valerio')
ON DUPLICATE KEY 
    UPDATE users SET name = 'Valerio';
```

It has a really simple behaviour:

- Try to insert a record with the given information;
- If there are no errors, it performs the insert as usual;
- If the query fires a "duplicate key" error it procedes with the second query provided;

Thanks to this clause we can move the "if" statement form PHP to the database, halving the number of requests against the database itself.

## Let's go further

We can use this SQL statement also for bulk operations to obtain an exponential performance improvement. We can add multiple INSERT and use the VALUES function to reference the correct field like a variable inside a cycle.

```sql
INSERT INTO users (email, name) 
    VALUES
        ('support@wordpress-542944-1738327.cloudwaysapps.com', 'Valerio'),
        ('support@wordpress-542944-1738327.cloudwaysapps.com', 'Valerio Barbera'),
        ('frank@gmail.com', 'Frank'),
        ('seb@gmail.com', 'Sebastian')
ON DUPLICATE KEY 
    UPDATE users SET name = VALUES(name);
```

We could import the entire CSV with one query... in theory.

In a real life scenario, a query has a length limit and it may be more prudent not to do everything in one operation to avoid out of memory errors. We can chunk the CSV in sub arrays of 1.000 items and run queries with 1.000 INSERT inside:

```php
// CSV file content
$csv = [...];
$chunks = array_chunk($csv, 1000);

foreach($chunks as $chunk) {
    foreach($chunk as $row) {
        User::updateOrCreate(
            // Identify record by this columns
            [
                'email' => $row['email']
            ],
            // Other fields to fill
            [
                'name' => $row['email']
            ]
        ]);
    }
}
```

1.000 is just an example, based on your server resources you could increase or decrease this number. **The most important thing is that we have reduced the number of queries from 500.000 to 500.**

## Eloquent UPSERT method

Eloquent ORM provides the `upsert` method that implements this strategy for you under the hood.

```php
User::upsert([
    ['email' => 'support@wordpress-542944-1738327.cloudwaysapps.com', 'name' => 'Valerio', 'age' => 25],
    ['email' => 'support@wordpress-542944-1738327.cloudwaysapps.com', 'name' => 'Valerio Barbera', 'age' => 35]
], ['email'], ['name', 'age']);
```

The method's first argument consists of the values to insert or update, while the second argument lists the column(s) that uniquely identify records within the associated table. The method's third and final argument is an array of the columns that should be updated if a matching record already exists in the database.

To allow the method to do its job it's require the columns in the second argument of the upsert method to have a "primary" or "unique" index.

## Conclusion

I hope that one or more of this tips can help you to create a more solid and scalable software product.

I have used Eloquent ORM to write code exmaples, but you can use this strategies with all major ORMs out there in the same way. As I often say, tools should helps us to implement an efficient strategy. Strategic thinking is the key to give a long term perspective to our products.
