---
title: "Replace comments with better PHP code"
slug: "replace-comments-with-better-code"
section: "inspector"
permalink: "/replace-comments-with-better-code/"
original_url: "https://inspector.dev/replace-comments-with-better-code/"
date: "2019-07-25T13:32:00Z"
updated: "2024-11-07T12:14:48Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["Laravel", "PHP"]
description: "Learn how to name functions and methods correctly, stop propagating errors in the documentation. Improve code understanding."
focus_keyword: "php better code"
seo_title: "Comments on code best practices. Name functions correctly | Inspector"
featured_image: "../images/replace-comments-with-better-code/featured.png"
wp_id: 1264
---

Hi, I'm Valerio, software engineer, founder and CTO at [Inspector](/).

Software development is collaborative by nature. If you're working for a company, regardless of size, you're obviously working with others.

I strongly believe in the comments as documentation for certain functions or entire classes to help developers in two ways:

- Navigate the code better - use comments to lead the IDE behaviour;
- Add more contextual information to avoid misunderstanding about why a code block was designed that way (increase perofmance, resolve bug, etc…)

When you are part of a team, comments in the code can cause discussions and disagreements. So, let us agree on the concept of "comments in the code".

```php
<?php

class Math
{
   public function calc() 
   {
     // Add b to a 
     $c = $this->a + $this->b;     // return the result of a + b 
     return $c;
   }
}
```

The code above could be the result of a meeting where the team is recommended to add comments on the code.

## Write expressive code

Repeating the code is the worst you can do. Add comments that describe what your code is doing when it would be much clearer to read the code itself means that you are wasting time. Other developers will spend time too to investigate useless documentation.

Junior developers rely on comments to tell stories when they should rely on code to write their stories. It's a typical appproach for less experienced developers.

We can even be more expressive taking care on the names of classes, functions and variables without writing a line of comments.

If you feel the need to write comments to explain what your function is for, the first thing you can do is consider the possibility of restructuring the code you wrote, and make it explains its purpose alone.

Take a look at the example below:

```php
<?php

/**
 * Calculate spending limit by customer income and try to find a room above that price.
 */
public function rentRoom($income)
{
    $spending = round(($income*0.15) / 12);
    foreach ($this->rooms as $room) {
        if ($room->price <= $spending) {
            return $room;
        }
    }
    throw new RoomNotFoundException();
}
```

Only one comment line could be acceptable. Or could we review the code to make it clearer, modular and avoid any comment?

```php
<?php

/**
 * Rent a room based on customer's income
 * 
 * @params integer $income
 */
public function rentRoom($income)
{
    try {
        $this->findRoomByPrice(
            $this->calculateCustomerSpending($income)
        );
    } catch (\Eception $exception) {
        // do something with error
    }
}public function findRoomByPrice($limit) 
{
    foreach ($this->rooms as $room) {
        if ($room->price <= $limit) {
            return $room;
        }
    }
    throw new RoomNotFoundException();
}public function calculateCustomerSpending($income, $percentage = 15)
{
    return round(
        ($income*($percentage/100)) / 12
    );
}
```

The code is more verbose and there is no need for comments.

The numbers now have a label and the functions have a name that clearly explains what they do. This example may seem a little excessive if taken individually. What you need to focus your attention on is the strategy. The value of explaining how and why that code exists using the code itself.

My advice is to not underestimate this aspect. If too many comments are present in the code it increases exponentially the risk that you, and the other developers, will pay less attention to their presence. The risk is to propagate wrong information in the documentation.

Comments are obviously needed to explain complex code blocks, but they are useful to improve code navigation in modern IDE too.

**Next time you feel the need to write comments you can ask yourself if it is possible to have the same readability using the code itself drastically improving maintainability**.
