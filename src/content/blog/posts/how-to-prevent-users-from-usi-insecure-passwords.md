---
title: "How to prevent users from registering into your app with insecure passwords"
slug: "how-to-prevent-users-from-usi-insecure-passwords"
section: "inspector"
permalink: "/how-to-prevent-users-from-usi-insecure-passwords/"
original_url: "https://inspector.dev/how-to-prevent-users-from-usi-insecure-passwords/"
date: "2021-09-12T15:49:17Z"
updated: "2024-11-07T12:14:11Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["Laravel", "PHP", "authentication", "passwords", "security", "software development"]
description: "How to implement a custom validation rule to prevent users from registering an account using insecure passwords."
focus_keyword: "application account security"
seo_title: "How to prevent users from using insecure passwords in your application"
featured_image: "../images/how-to-prevent-users-from-usi-insecure-passwords/featured.jpg"
wp_id: 3946
---

Hi, I'm Valerio, software engineer and CTO at Inspector.

About one year ago one of our accounts on an external platform has been hacked. Our credit card was attached to this account so we had to warn the bank to block it. Fortunately, there were no consequences, neither for our bank account, nor for our customers in terms of data security.

It was a really important experience which helped us understand the needs to increase our security policy to prevent similar incidents from leading to worse consequences. I wrote about our roadmap to increase our security standards in this post: [https://inspector.dev/how-to-turn-a-credentials-breach-into-a-development-opportunity/](/how-to-turn-a-credentials-breach-into-a-development-opportunity/)

Recently we added the weak passwords filter mentioned in the security roadmap and in this article I'll show you how to implement the same mechanism in your application.

How many people still use "password" as a password. Also in tech companies because sometimes the account is shared by many people that they choos an obvious word.

Inspector provides two factor authentication as additional security layer, but prevent users from registering an account with one of these insecure passwords will greatly increase the level of security for all users.

## Find a weak passwords list

Before starting with code we need to find a reliable list of most common passwords used by malicious attackers.

There are many source, you can find them in a dedicated wikipedia page: [https://en.wikipedia.org/wiki/List_of_the_most_common_passwords](https://en.wikipedia.org/wiki/List_of_the_most_common_passwords)

Almost any password management software provides its own list based on their data. I made a combination of some of them to get the most complete list.

Here is my not permitted passwords array:

```php
[
    'picture1',
    'password',
    'password1',
    '12345678',
    '111111',
    '123123',
    '12345',
    '1234567890',
    'senha',
    '1234567',
    'qwerty',
    'abc123',
    'Million2',
    'OOOOOO',
    '1234',
    'iloveyou',
    'aaron431',
    'qqww1122',
    '123',
    'omgpop',
    '123321',
    '654321',
    '123456789',
    'qwerty123',
    '1q2w3e4r',
    'admin',
    'qwertyuiop',
    '555555',
    'lovely',
    '7777777',
    'welcome',
    '888888',
    'princess',
    'dragon',
    '123qwe',
    'sunshine',
    '666666',
    'football',
    'monkey',
    '!@#$%^&*',
    'charlie',
    'aa123456',
    'donald',
]
```

## Create a custom validation rule

We use Laravel as application framework but you are free to implement the same logic in any language or framework.

Laravel provides an easy create your own validation rules out the rules available by default. To generate a new rule object, you may use the `make:rule` Artisan command.

```php
php artisan make:rule RejectWeakPasswords
```

Once the rule has been created, we are ready to define its behavior. A rule object contains two methods: **passes** and **message**.

The passes method receives the attribute value and name, and should return true or false depending on whether the value is valid or not. The **message** method should return the validation error message that should be used when validation fails:

```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class RejectUnsecurePassword implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return !in_array($value, [
            'picture1',
            'password',
            'password1',
            '12345678',
            '111111',
            '123123',
            '12345',
            '1234567890',
            'senha',
            '1234567',
            'qwerty',
            'abc123',
            'Million2',
            'OOOOOO',
            '1234',
            'iloveyou',
            'aaron431',
            'qqww1122',
            '123',
            'omgpop',
            '123321',
            '654321',
            '123456789',
            'qwerty123',
            '1q2w3e4r',
            'admin',
            'qwertyuiop',
            '555555',
            'lovely',
            '7777777',
            'welcome',
            '888888',
            'princess',
            'dragon',
            '123qwe',
            'sunshine',
            '666666',
            'football',
            'monkey',
            '!@#$%^&*',
            'charlie',
            'aa123456',
            'donald',
        ]);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The chosen password is not strong enough. Try again with a more secure string.';
    }
}
```

This rule was added to verify the registration information and also in the change password process.

## Conclusion

People can’t be expected to create and remember dozens of unique, complex passwords. Instead, there are tools you can use. There are multiple password manager services that generate strong passwords for you and store them securely.

I personally use the password generator built into google chrome. When compile a new signup form use the right click on the password field. You'll find the "Suggest a strong passowd" menu that will automatically generate a secure password for you and store it securely in your google account to automatically fill the log-in form the next time you access the same web site.
