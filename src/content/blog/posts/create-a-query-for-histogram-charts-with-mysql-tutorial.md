---
title: "Create Histogram Charts With MySQL - Tutorial"
slug: "create-a-query-for-histogram-charts-with-mysql-tutorial"
section: "inspector"
permalink: "/create-a-query-for-histogram-charts-with-mysql-tutorial/"
original_url: "https://inspector.dev/create-a-query-for-histogram-charts-with-mysql-tutorial/"
date: "2024-02-19T11:51:17Z"
updated: "2024-08-26T15:33:03Z"
author: "Valerio Barbera"
category: "Database"
categories: ["Database", "Fast tips", "Software development"]
tags: ["database", "software development"]
description: "Detailed explaination on how to build query for create histogram chart with MySQL filling the gaps in the resultset. Code examples."
focus_keyword: "histogram query"
featured_image: "../images/create-a-query-for-histogram-charts-with-mysql-tutorial/featured.png"
wp_id: 6203
---

To create a statistical query to build a histogram chart with MySQL, you can use the COUNT() function along with GROUP BY to count occurrences of values within a specified range or category created by the grouping constraint.

Especially for time series data there are a lot of use cases for histograms like monitoring the number of users registered on a daily interval in the last 30 days. We use these queries in our administration backend to monitor some important KPIs.

Unfortunately SQL databases have never had native support for representing histograms, but they are among the most used charts for tracking metrics of all kinds.

In this article I’ll show you how to create queries for this purpose and overcome some limitations. Let's say you have a table named *sales* with a column named *sale_date* containing the date and time of each sale. You want to create a histogram chart showing the distribution of sales over monthly intervals.

```sql
SELECT 
    DATE_FORMAT(sale_date, '%Y-%m') AS sales_month,
    COUNT(*) AS count
FROM 
    sales
GROUP BY 
    DATE_FORMAT(sale_date, '%Y-%m');
```

In this query:

- **DATE_FORMAT(sale_date, '%Y-%m')** formats the sale_date column into year-month format (e.g., "2024-01" for January 2024).
- **COUNT(\*)** counts the number of sales occurrences within each month.
- **FROM sales** specifies the table from which to retrieve the data.
- **GROUP BY DATE_FORMAT(sale_date, '%Y-%m')** groups the sales data into monthly intervals based on the formatted sale dates.

This query will give you the count of sales occurrences within each monthly interval, allowing you to create a histogram chart to visualize the distribution of sales over time.

## How to fill gaps in the histogram query

Running this query you will probably see some missing months in the resultset, probably because in certain months you have no sales, so the GROUP BY function can’t generate data for these intervals.

How can the query be adjusted to fill these gaps with a default zero value? Otherwise the histogram remains incomplete.

To fill the gaps in the result set and ensure that all months are represented, even if there are no sales in certain months, you can dynamically generate the months for the selected calendar interval using a [recursive common table expression](https://www.mysqltutorial.org/mysql-basics/mysql-recursive-cte/) (CTE).

It generates a sequence of dates covering the desired time range. Then, you can LEFT JOIN this sequence of dates with your sales data to include all months in the result set.

```sql
WITH RECURSIVE DateRange AS (
    SELECT 
        DATE_FORMAT(DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 11 MONTH), '%Y-%m-01') AS min_date,
        DATE_FORMAT(NOW(), '%Y-%m-01') AS max_date
    UNION ALL
    SELECT 
        DATE_FORMAT(DATE_ADD(min_date, INTERVAL 1 MONTH), '%Y-%m-01'),
        max_date
    FROM 
        DateRange
    WHERE 
        DATE_ADD(min_date, INTERVAL 1 MONTH) <= max_date
)
SELECT 
    DATE_FORMAT(DateRange.min_date, '%Y-%m') AS sales_month,
    COUNT(sales.sale_date) AS count
FROM 
    DateRange
LEFT JOIN 
    sales ON DATE_FORMAT(DateRange.min_date, '%Y-%m') = DATE_FORMAT(sales.sale_date, '%Y-%m')
GROUP BY 
    sales_month
ORDER BY 
    sales_month;
```

The DateRange CTE (common table expression) recursively generates a sequence of months covering the time range between the minimum and maximum sale dates in your sales table.

This query dynamically generates the months for the selected calendar interval based on the minimum and maximum sale dates in your sales table, ensuring that all months are represented in the result set.

## Fill the gaps with code

The SQL solution may be a little less comfortable for developers, and also the need for more customizations may lead to preferring a code-based solution.

In this case you can achieve the same result in three simple steps:

- Create the array with the time interval of your interests;
- Get the result from the GROUP BY query;
- Merge them.

Here is the code snippet using Laravel and the Carbon library:

```php
$dates = [];

// Create the array with the time interval of your interests
for(
    $day = now()->subDays(31);
    $day->startOfDay()->lte(now());
    $day->addDay()
) {
    $dates[] = [
        'day' => $day->format('Y-m-d'),
        'total' => 0,
    ];
}

// Get the result from the GROUP BY query
$sales = $product->sales()->select(DB::raw('DATE(sale_at) as day, CAST(SUM(qty) AS UNSIGNED) as total'))
    ->where('sale_at', '>=', now()->subDays(31))
    ->groupBy('day')
    ->get();

// Merge them
return array_map(function ($date) use ($sales) {
    foreach ($sales as $sale) {
        if ($date['day'] === $sale['day']) {
            return $sale;
        }
    }
}, $dates);
```

If you are interested in reading more posts about database you can check out the articles below:

- [How to scale a SQL database](/how-i-handled-the-scalability-of-the-sql-database-at-inspector/)
- [MySQL duplicate table – Fast Tips](/mysql-duplicate-table/)
- [\[Resolved\] Integrity constraint violation – Fast tips](/resolved-integrity-constraint-violation-fast-tips/)
- [Save 1.2 million queries per day with Laravel Eager Loading](/save-1-2-million-queries-per-day-with-laravel-eager-loading/)
- [How to accelerate application performance with smart SQL queries](/how-to-accelerate-application-performance-with-smart-sql-queries/)
- [Make your application scalable optimizing the ORM performance](/make-your-application-scalable-optimizing-the-orm-performance/)
- [\[Resolved\] – MySQL lock wait timeout exceeded using Laravel queues and jobs](/resolved-mysql-lock-wait-timeout-exceeded-using-laravel-queues-and-jobs/)
