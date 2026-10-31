---
title: "MySQL How To Duplicate A Table – Fast Tips"
slug: "mysql-duplicate-table"
section: "inspector"
permalink: "/mysql-duplicate-table/"
original_url: "https://inspector.dev/mysql-duplicate-table/"
date: "2023-12-19T15:24:38Z"
updated: "2024-11-07T12:13:33Z"
author: "Valerio Barbera"
category: "Database"
categories: ["Database", "Fast tips", "Software development"]
tags: ["database", "mysql", "software development"]
description: "How to duplicate a table in MySQL. How to import data or import only the table structure with indexes, keys, ans auto_increments."
focus_keyword: "mysql duplicate table"
seo_title: "Duplicate MySQL Table - Howto copy paste"
featured_image: "../images/mysql-duplicate-table/featured.png"
wp_id: 6121
---

Recently I had to deal with some limitations of my database provider that doesn't support table renaming. So I had to duplicate a table manually.

The database of my SaaS platform is hosted on [Planetscale](https://planetscale.com/). The company provides a MySQL-compatible serverless database. Thanks to its serverless nature you can get the power of horizontal sharding, non-blocking schema changes, and many more powerful database features without the pain of implementing them. And a great developer experience.

From another perspective you have to deal with some constraint regarding schema changes. These limitations are needed to guarantee consistency in a sharded environment.

They made a lot of progress since I became a customer (almost two years ago), like the support for Foreign Key constraint: [https://planetscale.com/docs/concepts/foreign-key-constraints](https://planetscale.com/docs/concepts/foreign-key-constraints)

## Rename a table

Inspector is a Laravel application. Using the Laravel migrations I could use the *rename* function to simply change the name of a table:

```php
Schema::rename('from', 'to');
```

Planetscale doesn’t support table renaming natively. So I had to find a workaround to accomplish the task.

To be honest renaming a table is a quite rare operation. For me it was because of an overlap of names between "Projects" and "Applications" entities. I had to rename Projects -> Applications.

## How to duplicate a table in MySQL

There are two ways to duplicate a table in MySQL.

## Duplicate the table structure

You can duplicate only the table structure (columns, keys, indexes, etc) **without data**, using "CREATE TABLE … LIKE":

```sql
CREATE TABLE applications LIKE projects;
```

The result is the creation of the **applications** table with the exact same structure of the original **projects** table, but WITH NO data.

To import data too you can run a second statement as "INSERT INTO … SELECT":

```sql
INSERT INTO applications SELECT * FROM projects;
```

Take care running this statement on big tables because it can take a lot of time and server resources.

## Duplicate only column definition

The second option is to duplicate only column definitions and import data in one statement using “CREATE TABLE … AS SELECT”:

```sql
CREATE TABLE applications AS SELECT * FROM projects;
```

The new **applications** table inherits only the basic column definitions from the **projects** table. It does not duplicate Foreign Key constraints, indexes, and auto_increment definitions.

This option could be usefult when you have the names of indexes and keys related to the table name. Changing the name of the table you have to replace the names of the constraints. You'd better not import them at all and do it all over again.

Resources

Database is always an hot topic for developers at any stage. You can find other technical resources on the blog. Here are the most popular articles on the topic:

- [**\[Resolved\] Integrity constraint violation**](/resolved-integrity-constraint-violation-fast-tips/)
- [**Save 1 million queries with Laravel eager loading**](/save-1-2-million-queries-per-day-with-laravel-eager-loading/)
- [**How to scale a SQL database**](/how-i-handled-the-scalability-of-the-sql-database-at-inspector/)
- [**\[Resolved\] – MySQL lock wait timeout exceeded using Laravel queues and jobs**](/resolved-mysql-lock-wait-timeout-exceeded-using-laravel-queues-and-jobs/)
