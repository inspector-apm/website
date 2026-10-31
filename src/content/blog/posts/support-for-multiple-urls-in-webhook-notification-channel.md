---
title: "Support for multiple URLs in Webhook Notification Channel"
slug: "support-for-multiple-urls-in-webhook-notification-channel"
section: "inspector"
permalink: "/support-for-multiple-urls-in-webhook-notification-channel/"
original_url: "https://inspector.dev/support-for-multiple-urls-in-webhook-notification-channel/"
date: "2020-08-06T18:18:00Z"
updated: "2025-01-21T17:34:47Z"
author: "Valerio Barbera"
category: "Application monitoring"
categories: ["Application monitoring", "Product Updates"]
tags: []
description: "As integration becomes central to the way that our customers automate their processes, we have released a brand new Webhook Channel."
focus_keyword: "Webhook Notification Channel"
seo_title: "Webhook Notification Channel now support multiple URL | Inspector"
featured_image: "../images/support-for-multiple-urls-in-webhook-notification-channel/featured.jpg"
wp_id: 1373
---

Hi, I’m Valerio CTO at Inspector.

As integration becomes increasingly central to the way that our customers automate their internal process, we have recently released a new feature for our Webhook Notification Channel.

## Before

Before this product upgrade you could configure the URL of the external system to which you wanted to send the notifications.

![](../images/support-for-multiple-urls-in-webhook-notification-channel/webhook-channel-screenshot.png)

The URL will receive notification in form of an http POST request with a specific headers and body based on the type of event detected.

## What you can do now

Now you can assign multiple URLs to the same Webhook Channel, as shown in the image below:

![Webhook configuration](../images/support-for-multiple-urls-in-webhook-notification-channel/webhook-channel-configuration.png)

Inspector will send the same http POST request to all external URLs attached to the channel.
