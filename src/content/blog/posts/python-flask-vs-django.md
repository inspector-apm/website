---
title: "Python Flask vs Django"
slug: "python-flask-vs-django"
section: "inspector"
permalink: "/python-flask-vs-django/"
original_url: "https://inspector.dev/python-flask-vs-django/"
date: "2023-06-08T09:08:13Z"
updated: "2024-11-07T12:13:53Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["django", "python", "software development"]
description: "Explore the key differences we have identified between Flask vs Django, their features, and why we decided to move forward with Django."
focus_keyword: "Flask vs Django"
featured_image: "../images/python-flask-vs-django/featured.jpg"
wp_id: 5769
---

Python offers several frameworks to streamline the development process. In this article we compare Flask vs Django, two of the most known frameworks for web development.

As anticipated in previous articles we are building our Machine Learning API in Python. The choice of the framework to use was an important step to guarantee the best opportunities for the evolution and scalability of the project.

Both Flask and Django have their strengths and weaknesses, and choosing the right framework depends on project's requirements. In this tutorial, we'll explore the key differences we have identified between Flask vs Django, their features, and why we decided to move forward with Django. Even through some code snippets.

## Overview fo Flask vs Django

**[Flask](https://flask.palletsprojects.com/)** is known for its simplicity and minimalistic design. It provides only the essential tools to build web applications, making it highly customizable. It's not tightly coupled with specific ORM or other modules. It is a platform to smoothly integrate external packages giving you the freedom to create the best application infrastructure for your use case.

**[Django](https://www.djangoproject.com/)** is a full-featured and batteries-included web framework that follows the "don't repeat yourself" (DRY) principle. It includes numerous built-in features, such as an ORM, authentication, and admin interface, making it ideal for large-scale and complex projects.

## Routing and URL Handling

Flask uses decorators to define routes and handle URL patterns. Here's an example:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask!'

if __name__ == '__main__':
    app.run()
```

Django uses a URL configuration file "**urls.py**" to define routes. Here's an example:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
]
```

## Templating and Views

Flask uses [Jinja2](https://jinja.palletsprojects.com/) as its default templating engine. Templates are stored in a separate directory and can be rendered using the **render_template** function:

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html', title='Home')

if __name__ == '__main__':
    app.run()
```

Django has its own template engine, which supports template inheritance and provides powerful template tags and filters. Templates are stored within the Django app's **templates** directory.

```php
from django.shortcuts import render

def home(request):
    return render(request, 'index.html', {'title': 'Home'})
```

## Database Integration

Flask does not provide a built-in ORM, allowing developers to choose any database library. [SQLAlchemy](https://www.sqlalchemy.org/) is a popular choice for integrating databases with Python application. Here is an example of to integrate it in a Flask application:

```python
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

// Add the connection string to the application configs
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

if __name__ == '__main__':
    app.run()
```

Django includes a powerful ORM called Django ORM, which supports multiple databases. It provides an easy-to-use API for interacting with databases.

```python
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
```

The User class will inherit the database connection and configurations directly from the "Model" object.

You can read a step by step tutorial on how to set up Django ORM in the article below:

[Setting up Django ORM](/setting-up-django-orm/)

## Authentication and Authorization

Flask has several third-party extensions for authentication and authorization, such as Flask-Login and Flask-Security. As highlighted above, Flask does not include all these functionalities in the main package, so you are free to install only what you really need.

Here's an example using Flask-Login:

```python title="Install flask-login package"
pip install flask-login
```

```python title="Configure flask-login in the main app"
from flask_login import LoginManager, UserMixin

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    # ...

if __name__ == '__main__':
    app.run()
```

Django includes built-in authentication and authorization features, including user models, authentication views, and decorators:

```python
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

@login_required
def profile(request):
    # ...
```

## Admin Interface

Flask does not provide a built-in admin interface. However, you can use third-party extensions like Flask-Admin or Flask-User to add admin functionality to your Flask applications.

Django includes a fully-featured admin interface out of the box. It automatically generates an admin site based on your ORM models, allowing you to manage data easily.

## Scalability and Performance

Flask is lightweight and has a minimalistic design, making it highly scalable and performant. It allows developers to choose the components they need, reducing unnecessary overhead.

Django's batteries-included approach comes with more overhead. However, it provides robust features and optimizations for large-scale projects.

Based on my experience an application run at good or bad performance based on the code you write. **The underlying framework is far less important to performance and scalability than one might imagine**.

**Choose the framework that best fits your development needs. That's all.**

## Move forward with Django

We finally decided to move forward with Django because the way it includes built-in functionalities means a lot less code to write.

Since we are in prototyping mode we can benefits from all the integrations already available in Django.
