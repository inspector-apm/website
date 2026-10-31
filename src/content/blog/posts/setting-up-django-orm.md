---
title: "Setting up Django ORM"
slug: "setting-up-django-orm"
section: "inspector"
permalink: "/setting-up-django-orm/"
original_url: "https://inspector.dev/setting-up-django-orm/"
date: "2023-05-20T16:23:36Z"
updated: "2024-11-07T12:13:53Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["django", "orm", "python", "software development"]
description: "How Django ORM works, from setting up the database and models to performing CRUD operations and complex queries."
focus_keyword: "django orm"
featured_image: "../images/setting-up-django-orm/featured.png"
wp_id: 5736
---

As mentioned in previous articles, our machine learning APIs are built on top of Django, the most used framework to build REST applications in Python. And we use Django ORM to interact and maintain the SQL database.

In this tutorial, we will explore the ins and outs of Django ORM, from setting up the database and models to performing CRUD (Create, Read, Update, Delete) operations and complex queries. By the end of this guide, you'll have a solid understanding of how Django ORM works and be able to leverage its capabilities to build robust and scalable web applications.

Table of content:

1. [Setting up Django ORM](#setting-up-django-orm)
2. [Defining Models](#defining-models)
3. [Performing CRUD operations](#performing-crud-operations)
4. [Querying the Database](#querying-the-database)
5. [Advanced Querying Technique](#advanced-querying-techniques)
6. [Working with Migrations](#working-with-migrations)

## What is an ORM in Django?

It is a component of the framework that allows developers to interact with a relational database using Python objects instead of writing SQL queries directly. Django provides a powerful and intuitive ORM that simplifies the process of database manipulation and makes it easier to build database-driven applications.

## How does Django ORM work?

Django ORM works by mapping Python classes to database tables and Python objects to database records. It provides a high-level API that abstracts away the complexity of SQL and allows developers to perform common database operations such as creating, reading, updating, and deleting records using Python methods and attributes.

The ORM uses a concept called models, which are Python classes that define the structure and behavior of database tables. Each model class represents a table in the database, and its attributes correspond to the table's columns. By defining models, you can create, query, and manipulate database records without writing SQL statements explicitly.

## Setting Up Django ORM

To get started, you'll need to have Django installed. Assuming you have a Django project set up, follow these steps to configure the ORM:

1. Open your project's **settings.py** file.
2. Locate the **DATABASES** configuration block.
3. Specify the database settings such as the engine (e.g., PostgreSQL, MySQL), name, user, and password.
4. Save the **settings.py** file.

## Defining Models

Models in Django ORM are Python classes that represent database tables. Each model class corresponds to a table, and its attributes map to table columns. Here's an example of a simple model representing a blog post:

```python
from django.db import models

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)
```

In the above code snippet:

- BlogPost is the model class that inherits from models.Model.
- “title”, “content”, and “pub_date” are fields defined using various field types.

## Performing CRUD Operations

Django ORM provides a straightforward way to perform CRUD operations on the database using model instances. Let's explore some common operations:

```python
/*
 * Creating an Object
 */
post = BlogPost(title='My First Post', content='Hello, Django ORM!')
post.save()

/*
 * Reading an Object
 */
all_posts = BlogPost.objects.all()
filtered_posts = BlogPost.objects.filter(title__contains='Django')
single_post = BlogPost.objects.get(pk=1)

/*
 * Updating an Object
 */
post = BlogPost.objects.get(pk=1)
post.title = 'Updated Title'
post.save()

/*
 * Deleting an Object
 */
post = BlogPost.objects.get(pk=1)
post.delete()
```

## Querying the Database

Django ORM offers a rich API for querying the database. Let's explore some common querying techniques:

### Basic filtering

```python
posts = BlogPost.objects.filter(pub_date__year=2022)
```

### Chaining filters

```python
posts = BlogPost.objects.filter(pub_date__year=2022, title__contains='Django')
```

### Aggregation and annotation

```php
from django.db.models import Count, Avg

posts = BlogPost.objects.annotate(comment_count=Count('comments'))
avg_rating = BlogPost.objects.aggregate(avg_rating=Avg('rating'))
```

### Ordering results

```python
posts = BlogPost.objects.order_by('-pub_date')
```

## Advanced Querying Techniques

Django ORM also supports more advanced querying techniques, such as complex lookups, joins, and Q objects. Here are some examples:

### Working with Relationships:

As other modern database layers you can map relationships between models, such as one-to-one, one-to-many, and many-to-many. Here's a brief example:

```python
class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

# Retrieve books written by a specific author
author = Author.objects.get(id=1)
books = author.book_set.all()

# Retrieve the author of a book
book = Book.objects.get(id=1)
author = book.author
```

### Complex lookups

```python
from django.db.models import Q

posts = BlogPost.objects.filter(Q(title__contains='Django') | Q(content__contains='ORM'))
```

### Joins

```python
class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    content = models.TextField()

# Retrieve all blog posts with their associated comments
posts = BlogPost.objects.select_related('comment_set')
```

### Raw SQL queries

```php
from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("SELECT * FROM blog_post WHERE title LIKE %s", ['%Django%'])
    results = cursor.fetchall()
```

## Working with Migrations

Django ORM also supports migrations. A tool that allows developers to create and maintain the database schema from the command line. This is a critical feature when you ship your application in production with a CI/CD automated process.

You can learn more about migrations in this dedicated article:

[Working with Django ORM migrations](/working-with-django-orm-migrations/)

## Key Features of Django ORM

### Database independence

Django ORM supports multiple database backends, including PostgreSQL, MySQL, SQLite, and Oracle. You can switch between different databases without changing your code. The ORM will use the appropriate SQL syntax to create your queries based on the underlying database type.

### Automatic schema generation

As mentioned before, you can automatically generate database tables based on the model definitions using migrations. A migration is a Django script that analyzes the model's fields and creates the corresponding database schema, including indexes and constraints.

### Query building

The query builder associated with Models allows you to construct complex database queries using a Pythonic syntax. You can filter, order, and aggregate data using methods like filter(), exclude(), order_by(), and annotate().

### Support to "lazy loading" and caching

Lazy loading hich means that database queries are not executed immediately. Instead, the ORM loads data from the database only when it is needed, reducing unnecessary database hits. Additionally, Django ORM provides a caching mechanism that can improve performance by storing frequently accessed data in memory.

### Relationship management

You can map relationships between models, such as one-to-one, one-to-many, and many-to-many relationships. It automatically generates the necessary database joins and provides convenient methods for accessing related objects.

## Django ORM vs. SQL

One common question that arises is whether Django ORM is faster than writing raw SQL queries. The answer is that it depends on the specific use case and the efficiency of the queries you write.

Django ORM offers a high-level abstraction over the database, which can be beneficial for most common operations. It simplifies the development process and reduces the amount of boilerplate code you need to write. However, this abstraction comes at a cost of some performance overhead.

In situations where you need to perform complex and optimized database operations, writing raw SQL queries might be more efficient. SQL gives you fine-grained control over the queries and allows you to optimize them based on the specific database engine you are using. It can be particularly useful when dealing with large datasets or performing advanced database operations that are not easily expressed using ORM's query API.

You can use the raw() method to execute pure SQL queries against the database. This allows you to combine the convenience of the ORM with the performance benefits of SQL when necessary.

```python
from django.db import connection

def execute_raw_sql():
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM my_table")
        results = cursor.fetchall()
        # Process the results
        ...
```

Keep in mind that using raw SQL queries directly can make your code less portable across different database backends supported by Django.

Remember to refer to the official [**Django documentation**](https://docs.djangoproject.com/en/4.2/) for more detailed information on the ORM and its features. Happy coding!
