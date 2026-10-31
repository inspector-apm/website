---
title: "How to install and monitor Laravel on cPanel"
slug: "how-to-install-and-monitor-laravel-on-cpanel"
section: "inspector"
permalink: "/how-to-install-and-monitor-laravel-on-cpanel/"
original_url: "https://inspector.dev/how-to-install-and-monitor-laravel-on-cpanel/"
date: "2022-11-01T19:01:19Z"
updated: "2024-11-07T12:13:53Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Monitoring", "Software development"]
tags: ["Laravel", "PHP", "cpanel", "monitoring", "software development"]
description: "Install Laravel framework on cPanel using PHP composer. You may move your current Laravel project to cPanel with ease."
focus_keyword: "install laravel on cpanel"
featured_image: "../images/how-to-install-and-monitor-laravel-on-cpanel/featured.png"
wp_id: 5467
---

Laravel is one of the most popular PHP frameworks today for creating modern web applications. In this tutorial, you'll discover how to set up a Laravel project on cPanel.

To install and use Laravel you must have [composer](https://getcomposer.org/) installed in your system. Let's first clarify what Composer is and what it means in Laravel before continuing.

## What is cPanel?

cPanel is a user-friendly control panel used to streamline website and server management. It is an online GUI that is based on Linux. You may publish websites, manage domains, arrange web files, create email accounts.

The WebHost Manager administration interface allows users to manage their websites, and also provides hosting providers with the tools they need to manage the server.

## What is Composer?

Composer is the package manager of the PHP ecosystem.

With composer, you can install third-party libraries, create and distribute your own modules, and automate php application installation and distribution.

So before utilizing Laravel, make sure Composer is set up on your machine.

## Step 1: Create subdomain

You can open the cPanel administration dashboard at the port 2083 or “cpanel” subdomain: http://yourdomain.com:2083 or https://cpanel.yourdomain.com

To enter a new subdomain for your brand-new Laravel project, click Subdomain under the Domain menu. If you want to host it under the main domain, skip this section.

Because the Laravel project starts from the public folder, enter the name of the subdomain, such as “myapp”, and place “public_html/myapp” under the documents root.

## Step 2: Create database

To enter a new database for your brand-new Laravel project, click MySQL database wizard under Databases.

Enter the name of the database such as “myapp_db”.

To access the database, create a new user account. Give the newly created database user all the privileges, then click the next button. Save all of this information. You need them to configure the database connection in your Laravel project .env file.

```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=xxxx
DB_USERNAME=xxxx
DB_PASSWORD=xxxx
```

## Step 3: Configure Composer

A Laravel project can be loaded into cPanel in two different methods. Using File Upload, or the Terminal. In this tutorial, we'll use Terminal to take advantage of Composer to pull it out.

Since Composer is installed as a remote script, you need to make sure that the **allow_url_fopen** directive is enabled in the **.bashrc** configuration file in your server.

Run the command below in your terminal:

```bash
echo 'alias composer="php -d allow_url_fopen=On /home/$USER_NAME/composer.phar"' >> ~/.bashrc source ~/.bashrc
```

Download composer using the below command. Curl will give you an error message if you attempt to connect to a website that has a self-signed SSL certificate because curl was unable to validate the certificate.

In that situation, you could omit certificate validation by using the -k or —insecure flag.

The -O option will save the file with the same name as the remote in the current working directory.

```bash
curl -k -O https://getcomposer.org/installer
```

Set up composer using:

```bash
php -d allow_url_fopen=On installer
```

## Step 4: Bring your application into the server

To organize your application, make a folder. Consider the folder **myapp** and place your project there.

```php
mkdir myapp
cd myapp
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY .
```

## Step 5: Install dependencies

Composer install dependencies in the vendor directory inside your project:

```bash
composer install
```

Make a fresh application key. This command modifies the APP_KEY setting in your **.env** file.

```bash
php artisan key:generate
```

Next you must configure the database connection with credentials created at the Step 2:

```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=xxxx
DB_USERNAME=xxxx
DB_PASSWORD=xxxx
```

Next, migrate your database. With this command, all of our schemas are published to the database. The database table is also created by this operation.

```bash
php artisan migrate
```

Establish the proper permissions for the storage folder:

```bash
chmod -R 775 storage
```

## Step 6: Make your app publicly accessible

To make your application publicly accessible it should be loaded into the public_html folder of the webserver.

To link the installation of your application with the public_html folder of the webserver, just create a symbolic link.

```bash
ln -s /home/user/myapp/public /home/user/public_html
```

A symbolic link, or symlink, is a file or folder on your computer that points to another file system that is connected to it.Do the same for the **storage** directory:

```bash
ln -s /home/user/my_laravel_app/storage/my_laravel_app/public
/home/user/public_html/storage
```

Then activate the storage link by running the following command:

```bash
php artisan storage:link
```

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**. I post about building my SaaS business.
