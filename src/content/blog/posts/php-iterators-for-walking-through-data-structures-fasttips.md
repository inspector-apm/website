---
title: "PHP Iterators for walking through data structures - FastTips"
slug: "php-iterators-for-walking-through-data-structures-fasttips"
section: "inspector"
permalink: "/php-iterators-for-walking-through-data-structures-fasttips/"
original_url: "https://inspector.dev/php-iterators-for-walking-through-data-structures-fasttips/"
date: "2023-09-13T13:54:02Z"
updated: "2024-11-07T12:13:33Z"
author: "Valerio Barbera"
category: "Fast tips"
categories: ["Fast tips", "Software development"]
tags: ["Laravel", "PHP", "software development"]
description: "Traversing, filtering and manipulating data with PHP iterators. How to create custom Iterator and FilterIterator."
focus_keyword: "php iterators"
seo_title: "PHP Iterators for walking through data structures - Inspector.dev"
featured_image: "../images/php-iterators-for-walking-through-data-structures-fasttips/featured.jpg"
featured_image_alt: "php-iterators-inspector"
wp_id: 5969
---

PHP Iterators are essential tools for efficiently traversing and manipulating data structures like arrays, objects, and more. They provide a clean and memory-efficient way to work with large datasets without loading the entire dataset into memory at once. In this tutorial, we will explore PHP iterators and how to use them for walking through various data structures.

## Introduction to PHP Iterators

An iterator is an object that implements the Iterator or IteratorAggregate interface. It allows you to loop through a collection of items one at a time, without the need to load the entire collection into memory. This is especially useful when dealing with large lists, as it conserves memory and improves performance.

## Built-in PHP Iterators

PHP provides several built-in iterators for common data structures. Later in the article we will also see how to create custom iterator classes. Let's explore the built in classes:

### ArrayIterator

The **ArrayIterator** is one of the simplest iterators and is used for traversing arrays. Here's an example:

```php
$array = [1, 2, 3, 4, 5];
$iterator = new ArrayIterator($array);

foreach ($iterator as $item) {
    echo $item . " ";
}
// Output: 1 2 3 4 5
```

### DirectoryIterator

The **DirectoryIterator** is useful for iterating through the files and directories in a directory.

```php
$directory = new DirectoryIterator('/path/to/directory');

foreach ($directory as $fileInfo) {
    echo $fileInfo->getFilename() . PHP_EOL;
}
```

### RecursiveIteratorIterator

The **RecursiveIteratorIterator** is used for recursively iterating through nested iterators, such as arrays with sub-arrays. It's often used with the **RecursiveArrayIterator**.

```php
$nestedArray = [
    'item1',
    'item2',
    ['subitem1', 'subitem2'],
    'item3',
    ['subitem3' => ['subsubitem1', 'subsubitem2']],
];

$iterator = new RecursiveIteratorIterator(new RecursiveArrayIterator($nestedArray));

foreach ($iterator as $item) {
    echo $item . PHP_EOL;
}
```

## Creating Custom Iterators

You can also create custom iterators by implementing the **Iterator** or **IteratorAggregate** interface. This is useful when you want to traverse your own data structures:

```php
class MyIterator implements Iterator 
{
    private $data = [1, 2, 3];

    private $position = 0;

    public function current() 
    {
        return $this->data[$this->position];
    }

    public function key() 
    {
        return $this->position;
    }

    public function next() 
    {
        $this->position++;
    }

    public function rewind() 
    {
        $this->position = 0;
    }

    public function valid() 
    {
        return isset($this->data[$this->position]);
    }
}

// How to use it in your code

$myIterator = new MyIterator();

foreach ($myIterator as $key => $value) {
    echo "Key: $key, Value: $value" . PHP_EOL;
}
```

## Filtering Iterators

Filtering iterators are a subset of PHP iterators that allow you to iterate over data structures while applying filters or conditions to include or exclude elements. This selective processing can help streamline your code and improve performance by reducing unnecessary data processing.

PHP provides several built-in filtering iterators. Let's explore a few of them.

### FilterIterator

The **FilterIterator** is a base class for creating custom filtering iterators. You extend it and override the `accept` method to implement your filtering logic.

```php
class EvenFilter extends \FilterIterator 
{
    public function accept() 
    {
        // Filter even numbers
        return $this->current() % 2 === 0;
    }
}

$array = [1, 2, 3, 4, 5, 6];
$iterator = new EvenFilter(new ArrayIterator($array));

foreach ($iterator as $item) {
    echo $item . " "; // Output: 2 4 6
}
```

### RegexIterator

The **RegexIterator** allows you to filter elements based on regular expressions. It's commonly used for filtering files in a directory.

```php
$files = new \DirectoryIterator('/path/to/files');
$regexIterator = new \RegexIterator($files, '/\.txt$/');

foreach ($regexIterator as $fileInfo) {
    echo $fileInfo->getFilename() . PHP_EOL;
    // Output: Only files with .txt extension
}
```

### CallbackFilterIterator

The **CallbackFilterIterator** lets you define custom filtering logic using a callback function. This provides flexibility to filter elements based on complex conditions.

```php
$array = [10, 20, 30, 40, 50];

$callbackFilter = new \CallbackFilterIterator(
    new \ArrayIterator($array),
    function ($current, $key, $iterator) {
        // Filter elements greater than 30
        return $current > 30;
    }
);

foreach ($callbackFilter as $item) {
    echo $item . " "; // Output: 40 50
}
```

## Creating Custom Filtering Iterators

To create a custom filtering iterator, you can extend the **FilterIterator** class and implement the **accept** method to define your filtering logic. This is particularly useful when you need to filter elements from your own data structures or objects:

```php
class MyCustomFilter extends \FilterIterator
{
    public function accept(): bool 
    {
        // Your logic here...
    }
}
```

You can use filtering iterators with arrays, as shown in the examples above. This is useful for quickly selecting and processing specific elements. They are also commonly used for working with directories and files. You can filter files by extension, modification date, size, or any other criteria that your application requires.
