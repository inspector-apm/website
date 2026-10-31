---
title: "PHP array_map for associative array  - Fast Tips"
slug: "php-array_map-for-associative-array-fast-tips"
section: "inspector"
permalink: "/php-array_map-for-associative-array-fast-tips/"
original_url: "https://inspector.dev/php-array_map-for-associative-array-fast-tips/"
date: "2024-08-23T10:52:02Z"
updated: "2024-11-07T12:06:16Z"
author: "Valerio Barbera"
category: "Fast tips"
categories: ["Fast tips"]
tags: ["Laravel", "PHP", "software development", "symfony"]
description: "How to use array_map on array with string keys. Get the key-value pair in the callback to extract information."
focus_keyword: "array_map"
featured_image: "../images/php-array_map-for-associative-array-fast-tips/featured.png"
wp_id: 6976
---

If you are here you are probably already aware that the *array_map* function doesn’t allow access to array keys in the callback. Having the key other than the value can be extremely useful dealing with associative arrays (arrays with string keys).

I will show you my use case for this solution and the new function I implemented.

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.

## array_map Use Case

A common real-world use case for the PHP *array_map* function is transforming data from a database query or an API response. For example, suppose you have an array of user data, and you want to format the names of the users or extract a specific piece of information from each user record.

Imagine you have an array of user records, and each record is an associative array with keys like *first_name*, *last_name*, and *email*:

```php
// Array of user data (e.g., from a database query)
$users = [
    [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@example.com'
    ],
    [
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'email' => 'jane.smith@example.com'
    ],
    [
        'first_name' => 'Bob',
        'last_name' => 'Johnson',
        'email' => 'bob.johnson@example.com'
    ]
];
```

### Scenario 1: extract information

You can easily extract the list of email addresses to send a notification to:

```php
$emails = array_map(function($user) {
    return $user['email'];
}, $users);
// Result: ['john.doe@example.com', 'jane.smith@example.com', 'bob.johnson@example.com']
```

### Scenario 2: add information

You can use the **array_map** function to add new fields to the user object based on their information:

```php
// Using array_map to add the avatar field to each user
$result = array_map(function($user) {
    return array_merge(
        $user,
        [
            'avatar' => 'https://eu.ui-avatars.com/api/?background=ff7511&color=fff&name='.$user['first_name']
        ]
    );
}, $users);


// Output the result
var_dump($result);
```

## Use Case For Associative Array

I made a data extraction from a NoSQL database to create a chart on my product dashboard. The data I receive from the NoSQL database looks like this:

```php
$data = [
    "2024-08-25" => ["doc_count" => 523, "score" => 0.2, "skipped" => 0],
    "2024-08-24" => ["doc_count" => 423, "score" => 0.2, "skipped" => 0],
    "2024-08-23" => ["doc_count" => 453, "score" => 0.2, "skipped" => 0],
    "2024-08-22" => ["doc_count" => 267, "score" => 0.2, "skipped" => 0],
    "2024-08-21" => ["doc_count" => 378, "score" => 0.2, "skipped" => 0],
    "2024-08-20" => ["doc_count" => 325, "score" => 0.2, "skipped" => 0],
    "2024-08-19" => ["doc_count" => 501, "score" => 0.2, "skipped" => 0],
];
```

Because of the javascript library used to visualize charts I need to transform this data into the format below to make the life easier for the frontend developer:

```php
$result = [
    [
        "label" => "2024-08-25",
        "value" => 523
    ],
    [
        "label" => "2024-08-24",
        "value" => 423
    ],
	
    ...
];
```

But to perform this transformation I need access to the key of the original array to put it into the "label" field. But the default *array_map* function only allows access the value.

Here's an implementation of the **array_map_assoc** function that works with associative arrays. It provides both the key and value as arguments of the callback:

```php
/**
 * Apply a mapping callback receiving key and value as arguments.
 * The standard array_map doesn't pass the key to the callback. But in the case of associative arrays,
 * it could be really helpful.
 *
 * array_map_assoc(function ($key, $value) {
 *  ...
 * }, $items)
 *
 * @param callable $callback
 * @param array $array
 * @return array
 */
function array_map_assoc(callable $callback, array $array): array
{
    return array_map(function($key) use ($callback, $array){
        return $callback($key, $array[$key]);
    }, array_keys($array));
}
```

Now I can transform the original user array in the data format for the javascript chart library:

```php
$histogram = array_map_assoc(function ($key, $value) {
    return [
        'label' => $key,
        'value' => $value['doc_count']
    ];
}, $data);
```

**Note**

Be careful because the **array_map_assoc** function does not preserve the state of the string keys, but it generates a completely new standard array.

I also added this function into the global namespace in my Laravel application as a new helper function:

[Laravel custom helper functions - Fast Tips](/laravel-custom-helper-functions-fast-tips/)

## Why do not use foreach?

More experienced developers are maybe thinking that you can access the key and value simply using a foreach statement:

```php
foreach ($data as $date => $value) {
    ...
}
```

Using *foreach* you have to use an additional variable to save the resulting transformation and you can't structure the code in a "one line" statement.

```php
// Using foreach
$result = [];

foreach ($data as $date => $value) {
    $result[] = [
        'label' => $date,
        'value' => $value['doc_count']
    ];
}

return $result;


// Using array_map_assoc
return array_map_assoc(function ($key, $value) {
    return [
        'label' => $key,
        'value' => $value['doc_count']
    ];
}, $data);
```

It's short and easier to read for me.

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.
