---
title: "[Resolved] Laravel email verification sent multiple times"
slug: "resolved-laravel-email-verification-sent-multiple-times"
section: "inspector"
permalink: "/resolved-laravel-email-verification-sent-multiple-times/"
original_url: "https://inspector.dev/resolved-laravel-email-verification-sent-multiple-times/"
date: "2024-11-05T17:16:59Z"
updated: "2024-11-07T12:04:07Z"
author: "Valerio Barbera"
category: "Troubleshooting"
categories: ["Software development", "Troubleshooting"]
tags: ["Laravel", "software development"]
description: "Fix the issue of Laravel email verification sent multiple times. It happened to me too so you can quickly fix the problem."
focus_keyword: "Laravel email verification"
featured_image: "../images/resolved-laravel-email-verification-sent-multiple-times/featured.png"
wp_id: 7673
---

Laravel provides a built-in system to verify the user's email address after registering an account on your application. But unlike other components of the framework it’s quite coupled in its implementation. This could lead to some issues like the problem of sending the verification email multiple times. It happened to me so I'll show you why, and how to fix it.

If you prefer a complete tutorial on Laravel Mailable system, check the article below:

[Laravel Mailable Tutorial](/laravel-mailable-tutorial/)

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or [**X**](https://x.com/Barbalerio).

## How Laravel email verification works

The workflow of this feature is quite standard:

- Someone register an account on your application.
- The user is redirected to an intermediate screen that asks to check out the inbox and click on the verification link.
- If the user tries to reach other internal urls it will be redirected to the verification screen.
- After clicking on the verification link it is finally free to navigate the private part of your application.

To implement this behavior Laravel provides us with a few components:

### User field: email_verified_at

You have to be sure your users table has the **email_verified_at** field. It stores the moment the user completes the verification flow activating the account. It is included in the standard user table migration so it will most likely already be in your database.

If you need to add it, here is the migration statement:

```php
$table->datetime('email_verified_at')->nullable();
```

### The Interface: Illuminate\\Contracts\\Auth\\MustVerifyEmail

The user model must implement this interface:

```php
class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;
 
    // ...
}
```

It doesn’t require implementing any method, it’s just a flag to let the framework know that you want to start the email verification process after user registration.

### The Middleware: \\Illuminate\\Auth\\Middleware\\EnsureEmailIsVerified

In the default middleware aliases you have this middleware: [https://laravel.com/docs/11.x/middleware#middleware-aliases](https://laravel.com/docs/11.x/middleware#middleware-aliases)

It protects the access to the application if the user has not yet verified the email. It contains the redirect to the verification page.

### The Laravel Email Verification

And finally the email that contains the link the user must click to verify the email address. The route behind the link basically will fill the **email_verified_at** column so the user will be marked as verified.

## How to fix the problem of sending multiple verification emails

As mentioned in the documentation:

*Once the interface has been added to your User model, newly registered users will automatically be sent an email containing an email verification link. This happens seamlessly because Laravel automatically registers the* ***Illuminate\\Auth\\Listeners\\SendEmailVerificationNotification*** *listener for the* ***Illuminate\\Auth\\Events\\Registered*** *event.*

This definition led me astray when I encountered the problem of receiving the verification email multiple times, because the registration of the event and listener is made on the built-in ***Illuminate\\Foundation\\Support\\Providers\\EventServiceProvider***.

If you basically extend this provider in other parts of your application it will register this hook multiple times, causing the email to be sent multiple times.

By default you have the *App\\Providers\\EventServiceProvider* in your application, that extends the *Illuminate\\Foundation\\Support\\Providers\\EventServiceProvider*.

Since I wasn’t aware that this provider contains this hook, I used to extend it in other parts of my application to leverage the built-in events/listeners registration function. But as said before, using this provider multiple times causes the additional registrations of the hook.

Check out inside your application where you are extending the EventServiceProvider of the framework and change it with the default *Illuminate\\Support\\ServiceProvider* and implement the event/listener registration by yourself in the boot method.

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or [**X**](https://x.com/Barbalerio).
