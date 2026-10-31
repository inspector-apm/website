---
title: "Working with Django ORM migrations"
slug: "working-with-django-orm-migrations"
section: "inspector"
permalink: "/working-with-django-orm-migrations/"
original_url: "https://inspector.dev/working-with-django-orm-migrations/"
date: "2023-05-10T16:09:31Z"
updated: "2024-11-07T12:13:53Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["django", "orm", "python", "software development"]
description: "How Django ORM migrations work to automates the process of database schema changes over time, making it easier and deployment-friendly."
focus_keyword: "django orm migrations"
featured_image: "../images/working-with-django-orm-migrations/featured.png"
wp_id: 5738
---

One of the key features of Django's ORM is its migration system, which automates the process of database schema changes over time. In this tutorial, we will dive deep into understanding how Django ORM migrations work and how you can effectively use them in your projects.

As mentioned in previous articles, our machine learning APIs are built on top of Django, the most used framework to build REST applications in Python. And we use Django ORM to interact and maintain the SQL database.

This series of articles represents the knowledge we are building internally working with Django.

## Overview of Django ORM Migrations

Django migrations allow developers to create, manage, and apply database schema changes over time, making it easier to evolve your database schema alongside your application. Migrations are written in Python and are stored as files in your Django project. They provide a version control-like system for database schemas.

## Setting Up Migrations

To use ORM migrations in Django, you need to make sure that the django.contrib.migrations app is included in your project's settings file (settings.py). This app is responsible for handling database migrations.

## Creating Database Models

In Django, database models are defined as Python classes using Django's django.db.models module. Each model class represents a database table, and the attributes of the class define the fields of the table. When creating or modifying models, Django's migration system keeps track of the changes and generates corresponding migration files.

Here's an example of a simple Django model representing a blog post:

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```

## Generating Migrations

Once you have defined your database models, you need to create migrations for them. Django provides a command-line utility called makemigrations that automatically creates migration files based on the changes you made to your models.

To generate migrations, run the following command in your terminal:

```python
python manage.py makemigrations
```

Django will scan your models and generate a migration file (a Python file) for each database schema change.

## Applying Migrations

After generating the migrations, you need to apply them to your database to make the corresponding schema changes. Django provides the migrate command to apply migrations.

To apply migrations, run the following command:

```python
python manage.py migrate
```

Django will execute the migrations in the order they were created, updating your database schema accordingly.

## Handling Database Schema Changes

As your project evolves, you might need to make changes to your existing models or add new models. Django's migration system provides various operations to handle schema changes, such as adding fields, modifying fields, deleting fields, creating tables, and more.

Here are a few examples of common migration operations.

### Adding a new field to an existing model

```python
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='mymodel',
            name='new_field',
            field=models.CharField(max_length=50),
        ),
    ]
```

### Modifying an existing field

```python
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_previous_migration'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mymodel',
            name='existing_field',
            field=models.IntegerField(),
        ),
    ]
```

### Deleting a field

```python
from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_previous_migration'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mymodel',
            name='obsolete_field',
        ),
    ]
```

### Advanced Migration Operations

Django ORM migrations also support more advanced operations, such as data migrations, running custom SQL, creating indexes, and more. These operations can be used to perform complex database schema changes.

For example, here's a data migration that populates a newly added field with some initial values:

```python
from django.db import migrations

def populate_new_field(apps, schema_editor):
    MyModel = apps.get_model('myapp', 'MyModel')
    for instance in MyModel.objects.all():
        instance.new_field = 'default value'
        instance.save()

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0004_auto_20230101_1234'),
    ]

    operations = [
        migrations.RunPython(populate_new_field),
    ]
```

### Rolling Back Migrations

Django provides a way to reverse previously applied migrations using the migrate command with the --fake or --fake-initial option. This allows you to roll back migrations in case of errors or when you need to revert to a previous state.

For example, to rollback the last applied migration, use the following command:

```python
python manage.py migrate myapp 0003_previous_migration --fake
```

### Migrations in Production

When deploying your Django application to production, it is crucial to have a solid migration strategy. It's recommended to apply migrations as part of your deployment process to ensure your database schema is always up to date.

You can automate the migration process by running the migrate command during deployment or using tools like Django's migrate management command in combination with deployment tools like Ansible, Fabric, or Docker.
