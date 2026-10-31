---
title: "How to group array by date in PHP - Fast Tips"
slug: "how-to-group-array-by-date-in-php-fast-tips"
section: "inspector"
permalink: "/how-to-group-array-by-date-in-php-fast-tips/"
original_url: "https://inspector.dev/how-to-group-array-by-date-in-php-fast-tips/"
date: "2024-05-04T16:02:19Z"
updated: "2024-11-07T12:15:12Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Fast tips", "Software development"]
tags: ["Laravel", "PHP", "software development", "ui"]
description: "How to group array by date field in PHP, Laravel blade, and Laravel collection. Also support filtering with array_filter."
focus_keyword: "group array by date in php"
featured_image: "../images/how-to-group-array-by-date-in-php-fast-tips/featured.jpg"
featured_image_alt: "group array by date in php"
wp_id: 6334
---

I use this technique to group the bug fixes array by date in the Inspector dashboard, and I thought it could be a good code snippet idea for others. I also wrote an implementation for Laravel blade templates and a more detailed implementation that supports filtering.

I decided to implement this code because it makes a list of items so easy to scroll based on their history.

## Group array by date in pure PHP

This implementation uses the **[array_reduce](https://www.php.net/manual/en/function.array-reduce.php)** function. It allows to progressively create a new array where each date becomes a key, with the corresponding element as its value.

```php
$data = [
    ['date' => '2023-06-01', 'value' => 10],
    ['date' => '2023-06-02', 'value' => 20],
    ['date' => '2023-06-01', 'value' => 30],
    ['date' => '2023-06-03', 'value' => 40],
    ['date' => '2023-06-02', 'value' => 50],
];

$groupedData = array_reduce($data, function ($result, $item) {
    $date = new DateTime($item['date']);
    $formattedDate = $date->format('Y-m-d');
    
    if (!isset($result[$formattedDate])) {
        $result[$formattedDate] = [];
    }
    
    $result[$formattedDate][] = $item;
    
    return $result;
}, []); // <-- Start with an empty array
```

Thanks to the DateTime object and the [format](https://www.php.net/manual/en/datetime.formats.php) method you can customize the grouping logic by month, or year, by simply changing the format string: ‘Y-m’ for month, or ‘Y’ for year.

## Filtering and grouping

You can also introduce a filter function to filter the elements before grouping them by the date field.

```php
$groupedData = array_reduce(array_filter($data, function ($item) use ($filter) {
		// Filter condition: keep elements with value greater than 20
		return $item['value'] > $filter;
	}), 
	function ($result, $item) {
		$date = new DateTime($item['date']);
		$formattedDate = $date->format('Y-m-d');
		
		if (!isset($result[$formattedDate])) {
			$result[$formattedDate] = [];
		}
		
		$result[$formattedDate][] = $item;
		
		return $result;
	}, []);
```

Inside the callback function of array_filter(), we specify the filter condition. In this example, we keep only the elements where the 'value' field is greater than **$filter**. You can modify this condition based on your specific use case.

## Showing results in the UI with Laravel blade

Obviously you can take inspiration and use the same strategy in your specific technology (like Symfony + Twig, or similar).

To keep the data manipulation statements separated from the view I keep the filtering and grouping process at the controller level, and I implement only the data structure iteration on the template side.

Here is the Controller:

```php
<?php

namespace App\Http;


use Illuminate\Http\Request;


class DashboardController extends Controller
{
    /**
     * The dashboard.
     *
     * @param ImpersonatesUsers $impersonator
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index(Request $request)
    {
		$data = $this->getData();
		
		$data = array_reduce(array_filter($data, function ($item) use ($filter) {
			// Filter condition: keep elements with value greater than 20
			return $item['value'] > $filter;
		}), 
		function ($result, $item) {
			$date = new DateTime($item['date']);
			$formattedDate = $date->format('Y-m-d');
			
			if (!isset($result[$formattedDate])) {
				$result[$formattedDate] = [];
			}
			
			$result[$formattedDate][] = $item;
			
			return $result;
		}, []);
		
        return view('dashboard', compact('data'));
    }
}
```

And here is the blade view:

```php
<ul>
    @foreach ($groupedData as $date => $items)
        <li>
            <strong>{{ $date }}</strong>
            <ul>
                @foreach ($items as $item)
                    <li>Value: {{ $item['value'] }}</li>
                @endforeach
            </ul>
        </li>
    @endforeach
</ul>
```

## Group a Laravel Collection by date

Thanks to the builtin utilities provided by the [Laravel Collection](https://laravel.com/docs/11.x/collections#main-content) class it’s really straightforward:

```php
$groupedData = collect($data)->groupBy(function ($item) {
    return Carbon::parse($item->date)->format('Y-m-d');
});
```

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**. I post about building my SaaS business.
