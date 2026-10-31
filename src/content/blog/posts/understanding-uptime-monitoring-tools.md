---
title: "Understanding Uptime Monitoring Tools"
slug: "understanding-uptime-monitoring-tools"
section: "inspector"
permalink: "/understanding-uptime-monitoring-tools/"
original_url: "https://inspector.dev/understanding-uptime-monitoring-tools/"
date: "2024-04-06T16:31:31Z"
updated: "2024-11-07T12:15:12Z"
author: "Valerio Barbera"
category: "Application monitoring"
categories: ["Application monitoring", "SaaS"]
tags: ["monitoring", "saas", "software development"]
description: "Discover how uptime monitoring tools function as advanced PINGs, with servers worldwide assessing your endpoints."
focus_keyword: "uptime monitoring tools"
featured_image: "../images/understanding-uptime-monitoring-tools/featured.png"
wp_id: 6270
---

We could describe the uptime monitoring tools as very sophisticated PINGs.

These tools usually provide a series of servers across various cloud regions around the world that ping your endpoints (it could be your website, or APIs) and basically measure the response of your system by crossing all the infrastructures that typically separate your user from your application.

For example, thanks to one of these tools I found that some eastern regions of Asia experienced slow access to the Inspector dashboard, whose main data center is located in Frankfurt. Everything was ok inside my application. The problem was outside.

When I finally received the first tickets reporting this slowness in even reaching the dashboard I already knew the problem, and I had the opportunity to provide immediate support to users in the geographical areas affected by the issue. It wasn't the customer's report that made me discover the problem. Otherwise it would have taken days or even weeks to identify the problem and then resolve it.

Which is precisely what we want to avoid. Monitoring must help us to *Anticipate problems and reduce or even completely avoid negative, and costly, impacts on customers.*

Remember, for one user who reports a problem to you, there are dozens who simply abandon your product, and it could take years before you see them again.

## Uptime Monitoring Tools Weaknesses

On the other hand, this type of tool is not helpful when your need is to know what’s happening inside your application.

If you receive a downtime notification caused not by external infrastructure, but by a technical problem within the application, the uptime monitoring tool notifies you about an HTTP 500 code received from your endpoint, but can't tell you anything about what happened and in what part of the application.

**View full video: [https://www.youtube.com/watch?v=o8CqrWo5wW4](https://www.youtube.com/watch?v=o8CqrWo5wW4)**
