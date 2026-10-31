---
title: "How to group array by date in Javascript - Fast Tips"
slug: "how-to-group-array-by-date-in-javascript-fast-tips"
section: "inspector"
permalink: "/how-to-group-array-by-date-in-javascript-fast-tips/"
original_url: "https://inspector.dev/how-to-group-array-by-date-in-javascript-fast-tips/"
date: "2024-05-04T18:18:21Z"
updated: "2024-11-07T12:15:12Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Fast tips", "Software development"]
tags: ["javascript", "software development", "ui", "vuejs"]
description: "Group array by date in javascript overcoming the limitations of native functions. Use it also in a Vuejs component."
focus_keyword: "group array by date in javascript"
featured_image: "../images/how-to-group-array-by-date-in-javascript-fast-tips/featured.png"
featured_image_alt: "group-array-by-date-javascript"
wp_id: 6339
---

I use this technique to group the bug fixes array by date in the Inspector UI, and I thought it could be a good code snippet idea for other developers. I also wrote an implementation for Vuejs and a more detailed implementation that supports filters.

I needed to implement this solution to make a list of items history easy to scroll for users.

## Use native groupBy function

```javascript
const items = [
    {"created_at": "2023-06-01", "value": 10},
    {"created_at": "2023-06-02", "value": 20},
    {"created_at": "2023-06-01", "value": 30},
    {"created_at": "2023-06-03", "value": 40},
    {"created_at": "2023-06-02", "value": 50},
];

let groups = Object.groupBy(items, item => moment(item.created_at).format('YYYY-MM-DD'));
```

I decided to use moment as a date library because the standard javascript Date object doesn’t provide an easy way to format dates. Thanks to the moment’s format method you could customize the grouping string by the month or the year, simply by changing the format string: ‘YYYY-MM’ for month, or ‘YYYY’ for year.

## Things to know

The native groupBy() function returns a [null-prototype object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects). This means that the resulting object does not have the native object methods you could expect like **hasOwnProperty()**.

If you call the method it will result in a “not a function error”:

```javascript
// TypeError: groups.hasOwnProperty is not a function
console.log(groups.hasOwnProperty("2023-06-01"));
```

To overcome this limitation you can implement the grouping strategy by yourself using the reduce function and get a fully functional object in return.

## Grouping with the reduce function

If you want more control on the new object creation process you can implement the raw strategy using the [**reduce**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) function. It allows you to progressively create a new object where each date becomes a key of the resulting object, with the corresponding element as its value.

```javascript
let groups = items.reduce((group, item) => {
    let date = moment(item.created_at).format('YYYY-MM-DD');
		
    if (!group[date]) {
        group[date] = [];
    }
		
    group[date].push(item);
		
    return group;
}, {}); // <-- Start with an empty object
```

## Support Filtering

You can also introduce a filter function to filter the elements of the resulting object before grouping.

```php
let groups = items.filter(item => {
    // Filtering before grouping
    return item.value > 20;
}).reduce((group, item) => {
    let date = moment(item.created_at).format('YYYY-MM-DD');
		
    if (!group[date]) {
        group[date] = [];
    }
		
    group[date].push(item);
    
    return group;
}, {}); // <-- Start with an empty object
```

Inside the callback function of filter(), we specify the filter condition. In this example, we keep only the elements where the 'value' field is greater than a threshold. You can modify this condition based on your specific use case.

## Use it inside a Vuejs component

To preserve the reactivity of the data manipulation statements I use a [computed property](https://vuejs.org/guide/essentials/computed.html), so it will change if the underlying collection changes. I implement only the data structure iteration on the template side.

Here is the component structure:

```php
<template>
    <div v-for="(group, date) in groups">
        <h4>{{date}}</h4>
		
        <ul>
            <li v-for="item in group">{{item.value}}</li>
        </ul>
		
        </br>
    </div>
</template>

<script>
import moment from "moment";

export default {
    data() {
        return {
            threshold: 0,
            items: [
                {"created_at": "2023-06-01", "value": 10},
                {"created_at": "2023-06-02", "value": 20},
                {"created_at": "2023-06-01", "value": 30},
                {"created_at": "2023-06-03", "value": 40},
                {"created_at": "2023-06-02", "value": 50},
            ],
        }
    },

    computed: {
        groups() {
            return this.items.filter(item => {
                return item.value > this.threshold;
            }).reduce((group, item) => {
                let date = moment(item.created_at).format('YYYY-MM-DD');
                if (!group[date]) {
                    group[date] = [];
                }
                group[date].push(item);
                return group;
            }, {});
        }
    },
}
</script>
```

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or [**X**](https://x.com/Barbalerio). I post about building my SaaS business.
