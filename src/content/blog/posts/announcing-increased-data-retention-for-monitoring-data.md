---
title: "Announcing increased data retention for monitoring data"
slug: "announcing-increased-data-retention-for-monitoring-data"
section: "inspector"
permalink: "/announcing-increased-data-retention-for-monitoring-data/"
original_url: "https://inspector.dev/announcing-increased-data-retention-for-monitoring-data/"
date: "2023-08-16T09:20:37Z"
updated: "2025-01-21T17:32:01Z"
author: "Valerio Barbera"
category: "SaaS"
categories: ["Product Updates", "SaaS"]
tags: ["monitoring", "saas"]
description: "We've achieved great results in the code architecture and infrastructure to pass this value to you in the form of a longer data retention."
focus_keyword: "data retention"
seo_title: "Increased data retention for monitoring data on Inspector.dev"
featured_image: "../images/announcing-increased-data-retention-for-monitoring-data/featured.png"
wp_id: 5921
---

Long story short: In the last 2 months of work we've achieved great results in cost optimization by refactoring both our infrastructure and code architecture, and we want to pass this value to you in the form of a longer data retention for your monitoring data.

Thanks to these changes we are increasing our computational capacity, and data processing performance, in order to provide more support for your business growth.

We’ve extended the data retention period by one week for all subscription plans, and the free tier from 3 days of data retention to a week.

## Faster data ingestion pipeline

We made some optimization in the data ingestion process in order to reduce database queries and function calls to make the code run by the PHP interpreter more smoothly.

Since we process more than 30 million requests per day even small changes have a remarkable impact on the efficiency and speed the code runs.

## Migrating to ARM machines

The most important change was the adoption of ARM instances for our infrastructure instead of traditional x86 servers.

You can read more about the migration results in the article below:

[Adoption of AWS Graviton ARM instances (and what results we've seen)](/inspector-adoption-of-graviton-arm-instances-and-what-results-weve-seen/)

ARM doesn’t support hyperthreading so each vCPU is a physical core instead of a thread. This guarantees better performance at lower costs.

## New to Inspector? Try it for free now

Are you responsible for application development in your company? Consider trying my product [**Inspector**](/) to find out bugs and bottlenecks in your code automatically. Before your customers stumble onto the problem.

Inspector is usable by any IT leader who doesn’t need anything complicated. If you want effective automation, deep insights, and the ability to forward alerts and notifications into your preferred messaging environment try Inspector for free. [**Register your account**](https://app.inspector.dev/register).

Or learn more on the website: [**https://inspector.dev**](/)
