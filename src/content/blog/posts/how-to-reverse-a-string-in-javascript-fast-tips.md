---
title: "How to reverse a string in Javascript - Fast tips"
slug: "how-to-reverse-a-string-in-javascript-fast-tips"
section: "inspector"
permalink: "/how-to-reverse-a-string-in-javascript-fast-tips/"
original_url: "https://inspector.dev/how-to-reverse-a-string-in-javascript-fast-tips/"
date: "2023-06-22T09:22:11Z"
updated: "2024-11-07T12:13:33Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Fast tips", "Software development"]
tags: ["javascript", "software development"]
description: "Three basic ways to reverse a string in JavaScript: utilizing the built-in reverse() method, a for loop, and the spread operator + reverse()."
focus_keyword: "reverse a string in Javascript"
featured_image: "../images/how-to-reverse-a-string-in-javascript-fast-tips/featured.jpg"
wp_id: 5814
---

In this article, we'll look at three basic ways to reverse a string in JavaScript: utilizing the built-in **reverse()** method, a **for loop**, and the **spread operator + reverse()**. We'll go over the advantages and disadvantages of each method and show you how to use them in your code.

## Method 1: Using the reverse() function

The built-in array **reverse()** method is the simplest way to reverse a string in JavaScript. This method alters the original string by reversing the character order. Here's an illustration:

```javascript
let original = "Hello World";
let reversed = original.split('').reverse().join('');

console.log(reversed);
```

We begin by transforming the string into an array of characters using the **split()** method. Then we use the **reverse()** method to reverse the order of the characters in the array. Finally, the array is converted back into a string using **join()**. "dlroW olleH" is the resulting reversed string 😅.

**Pros**

- It can be written in one line of code.
- It alters the original array in place, thus no new variable is needed to store the reversed array

**Cons**

- It alters the original string, which can be troublesome if other sections of your code rely on the original string.

## Method 2: Using a for loop

```javascript
let original = "Hello World";
let reversed = "";

for (let i = original.length - 1; i >= 0; i--) {
    reversed += original[i];
}

console.log(reversed);
```

In this example a for loop is used to go through the **original** string, beginning with the final character and finishing with the first. We add the current character to the **reversed** string on each iteration.

**Pros**

- It is a versatile approach that can be used to add intermediate manipulations during the reverse process.
- It does not change the original string, it can be used when the original string must be retained.

**Cons**

- It necessitates the use of an **additional variable** (reversed) to record the reversed string, which can consume additional memory.
- When compared to the **reverse()** function, it takes **more** **code** to be written.

## Method 3: Using the Spread Operator and reverse()

This is the same concept of the "Method 1" using the Spread Operator instead of the **split()** method. Here's an example:

```php
let original = "Hello World";
let reversed = [...original].reverse().join('');

console.log(reversedString);
```

**Pros**

- It is a very concise way that may be accomplished with a single line of code
- it does not change the original string, it can be used when the original string must be retained

**Cons**

- This approach is incompatible with Internet Explorer or older version of other browsers. So it may not be appropriate for browsers compatibility.

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or [**X**](https://x.com/Barbalerio). I post about building my SaaS business.
