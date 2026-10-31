---
title: "Error tracking tool - Laravel & PHP Bug Trap by Inspector"
slug: "error-tracking-tool-laravel-php-bug-trap-by-inspector"
section: "inspector"
permalink: "/error-tracking-tool-laravel-php-bug-trap-by-inspector/"
original_url: "https://inspector.dev/error-tracking-tool-laravel-php-bug-trap-by-inspector/"
date: "2024-04-11T08:11:56Z"
updated: "2024-11-07T12:15:12Z"
author: "Valerio Barbera"
category: "Application monitoring"
categories: ["Application monitoring", "Monitoring", "Software development"]
tags: ["monitoring"]
description: "Monitor and resolve bugs in Laravel and PHP with Inspector: your smart, efficient, and user-friendly error tracking solution."
focus_keyword: "error tracking"
featured_image: "../images/error-tracking-tool-laravel-php-bug-trap-by-inspector/featured.png"
wp_id: 6282
---

Error tracking tools can be summarized as exception traps.

This trap actually already exists in practically all technologies, and is nothing more than the exception handler.

Each programming language manages exceptions through the exception handler to which a framework or library can be hooked to intercept all exceptions circulating within the software.

Having received an error from the exception handler, the library formats it into a json object and sends it to the central platform which stores the occurrences of these errors and can send you alerts and notifications.

**View the full video: [https://www.youtube.com/watch?v=930LruZP4Ik](https://www.youtube.com/watch?v=930LruZP4Ik)**

## Error Tracking Weaknesses

Knowing and being able to consult all the exceptions that occur in the software with real-time data is already an excellent step. Then, depending on the tool, you may have many additional details that can help you understand what is happening. Whether we should worry and intervene, or simply watch for now.

That's a good thing, but there remains very limited feedback.

First of all, you don't know if your application is in trouble until an exception is explicitly thrown.

Error tracking tools do not provide the context, like trend data to measure the impact of code changes and the application growth over time. Such as resources consumption, database interactions, and performance metrics.

## Beyond Error Tracking

In the last blog posts we have defined the use cases and weak points of three categories of monitoring tools: Logs, Uptime Monitoring, and Error Tracking.

The message I want to convey to you is that there is no better or worse tool, it depends on what the various members of the team want to monitor based on the part of the application for which they are responsible. A Cloud Architect working on infrastructure might be more interested in logs and uptime monitoring tools, while the developer writing application code is more interested in error tracking.

So often the best solution is also to have a combination of tools for which both parts of the team will be responsible and benefit.

In the next articles we will analyze in more detail the last category of tools, probably the most powerful but the most controversial, for tools oriented towards the concept of Observability.
