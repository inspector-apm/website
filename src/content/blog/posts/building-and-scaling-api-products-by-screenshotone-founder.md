---
title: "Building and scaling API products - by ScreenshotOne founder"
slug: "building-and-scaling-api-products-by-screenshotone-founder"
section: "inspector"
permalink: "/building-and-scaling-api-products-by-screenshotone-founder/"
original_url: "https://inspector.dev/building-and-scaling-api-products-by-screenshotone-founder/"
date: "2023-06-18T15:18:35Z"
updated: "2024-11-07T12:13:33Z"
author: "Valerio Barbera"
category: "Application Scalability"
categories: ["Application Scalability", "SaaS"]
tags: ["saas", "scalability", "software development"]
description: "Building and scaling an API as a product. by the ScreenshotOne founder. What tech stack they use, what are the common mistakes you can avoid."
focus_keyword: "scaling API"
featured_image: "../images/building-and-scaling-api-products-by-screenshotone-founder/featured.png"
wp_id: 5830
---

API products are a new economy—there are plenty of them. And I'm at the stage when I have enough experience to share about building and scaling APIs and avoiding common pitfalls.

I am the technical founder of [ScreenshotOne—a screenshot API](https://screenshotone.com/) that allows you to render screenshots of any website, HTML, or Markdown in JPG, PNG, WebP, or PDF format.  
And I want to share with you how I scaled my API from scratch up to generate hundreds of screenshots per minute. I didn't change any API parameters significantly for a year but could keep up with all the new demands of my users.

But first of all, a few real numbers about ScreenshotOne:

1. More than 1500 registered users.
2. Generated more than 1,000,000 screenshots in the past 12 months. With an average of \~115 screenshots per minute.
3. Paying for more than $300 monthly for servers.
4. 99.9999% uptime.
5. A regular website screenshot rendering time of 1-5 seconds.
6. Team size is 1.

And my tech. stack:

1. Go for Dashboard and Internal API.
2. Hugo static site generator for the landing page.
3. Puppeteer (TypeScript) for rendering services.
4. Cloudflare Workers as an API gateway.
5. Google Cloud Run for rendering.
6. DigitalOcean for internal API and managed database, which is MySQL.

Now, let's talk about scaling an API product and what you can learn from my journey.

## Lessons

Developers usually start counting from zero.

### 0. Your API product is a product, not an API

We are discussing API as a self-contained public product, not an internal API, in some enterprise-level companies.

Building and scaling an API as a product is completely different from building an internal API. You must apply principles for building products **and** for building APIs.

It is twice as hard then you might expect, so don't fool yourself.

### 1. Start small

Build only one core feature, but make it work extremely well.  
For ScreenshotOne, it was rendering a website screenshot, setting browser dimensions, and a few other options. No more. You need to start as soon as possible to validate your hypothesis that there is a demand for your product.

Once you have the first users, you can start scaling. That means that you can omit Edge functions and Kubernetes clusters at the beginning. You can start with one small server and see if you have any users.

ScreenshotOne started with the DigitalOcean droplet, then moved to Render for autoscaling, and then to Google Cloud Run for extreme scalability. But all this took a lot of time and was done when it was necessary.

Don't waste your time—start small. Please.

### 2. Keep your core API small and release features in phases

Again, stay small. But this time, adding more features means more bugs and more support demands from you.

Even if you want to add a new feature, release it to a small group of customers, make sure they are satisfied. And only then open it to everybody. Once your feature is in public, it is super hard to rollback. Because you have an API product, and people rely on it.

### 3. API gateway for the rescue

If you are not familiar with the API gateway pattern, you must. Basically, it is the main service of your API through which all incoming requests are going.

In complex and huge APIs, the API gateway is usually responsible for rate-limiting, caching, validating signatures, and even combining responses from a few APIs. But if you start small, consider making your API in a way that it could be easily separable to a gateway and "business" logic of your service later.

Why?

Because once you start scalilng your API, having a separate service like gateway can help you to isolate and execute tasks I already listed effectively, like rate-limiting and others, without duplicating this code in your services.

In ScreenshotOne, it saved me a lot of time, especially when I could change the API interface without changing services that actually render screenshots.

### 4. Consider running your API gateway as edge serverless functions

If you want extreme performance and scalability for your API gateway, consider running it as an edge serverless function.

I use Cloudflare Workers for my screenshot API as an API gateway, and it helps me to reject invalid requests early, executing requests in close proximity to my API users. I also use edge caching and can run a ton of logic fast and near my API consumers.  
Give it a chance.

### 5. Aim at 100% uptime

Yes, never fail. Find a way to build your API in a way that never fails and always delivers promised results to your consumers. And they will thank you.

I don't want to say that [ScreenshotOne has 100% uptime](https://status.screenshotone.com/). It can't be true. But I tried to scale an API that never fails by design.

How?

If my database is not available, or Redis or any other third-party API. I try to satisfy the request anyway, even if it costs me money.

Something that is probably not acceptable in enterprise development. You will usually just see "500 Internal Application Error".

But please, don't DDoS me.

### 6. Once ready, add infinite scalability

You don't need that at the beginning, but once people start using your API, build a scalable solution. You want to sleep well at night, so do it.

A few easy options to consider: Fly.io, AWS Fargate or Google Cloud Run. They allow you to run your containers quickly without worrying about scaling and setup. The cheapest scalable options would probably be Kubernetes clusters, and that's in my plans.

But for now, Google Cloud Run is enough to spin up and run containers for me, even when API usage spikes.

Actually, setting up Google Cloud Run was so easy with running only command (`gcloud run deploy`) that I would seriously consider starting any new service with it if money is not your problem.

### 7. No monitoring—no customers

I can't tell you how many times my monitoring system helped me to prevent and proactively react to problems before my customers and their customers even noticed them. You can't underestimate that.

I use a variety of tools for that. Starting from in-house ones provided by Google Cloud and proprietary tools.

Consider using [Inspector](/). It is a simple code execution monitoring tool built for developers. They help you identify bugs and bottlenecks in your server-side code before your users do.

And yes, you need that status monitoring and your personal status page. I personally use [BetterStack](https://betterstack.com/) and can't recommend them enough.

### 8. Don't write docs

Generate them. Choose one popular format—e.g., OpenAPI specification and find a service that can generate docs based on that, e.g., [Bump.sh](https://bump.sh/).

That's, unfortunately, the lesson I learned from pain. I write my docs manually, and it takes a lot of time to do.

I hope I will find some time to move to automatic document generation.

### 9. Versioning is a hard problem

I would avoid versioning at all costs and try to keep the API without any version. Once you start adding versions, you can be sure your customers will never migrate, and you will need to support all of them.

If you anyway need it, then… don't do it. Remember my words.

## Summary

Creating and growing ScreenshotOne, an API product, has been a challenging yet incredible adventure for me.

One of the most critical lessons I've learned is to treat your API as a product rather than just a technical service.

You **must (!)** give as much thought to building an API as you would for developing a traditional product, so don't underestimate the complexity and depth of the task at hand.
