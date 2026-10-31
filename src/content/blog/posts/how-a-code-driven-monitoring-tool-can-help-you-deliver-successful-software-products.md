---
title: "Why code-driven monitoring tools can help you deliver successful software products"
slug: "how-a-code-driven-monitoring-tool-can-help-you-deliver-successful-software-products"
section: "inspector"
permalink: "/how-a-code-driven-monitoring-tool-can-help-you-deliver-successful-software-products/"
original_url: "https://inspector.dev/how-a-code-driven-monitoring-tool-can-help-you-deliver-successful-software-products/"
date: "2021-11-09T09:06:07Z"
updated: "2024-11-07T12:14:11Z"
author: "Valerio Barbera"
category: "Application monitoring"
categories: ["Application monitoring", "Software development"]
tags: []
description: "Why software developers prefer code-driven instead of infrastructure-driven monitoring tools. Learn more about their different approaches."
focus_keyword: "code driven monitoring"
seo_title: "What Code-Driven monitoring tools are and why developers love them"
featured_image: "../images/how-a-code-driven-monitoring-tool-can-help-you-deliver-successful-software-products/featured.png"
wp_id: 4086
---

Hi, I’m Valerio, software engineer, founder & CTO at Inspector.

In this article I would like to share my experience with you about why software developers should always prefer *code-driven* instead of *infrastructure-driven* monitoring tools.

Understanding their different approaches can help you better organize your team, stay agile and fast during delivery times, and quickly identify issues before your customers are aware of them.

As CTO of a Code Execution Monitoring product I have the opportunity to discuss this topic every week with companies of all sizes.

Due to software bugs and downtimes I have witnessed firsthand disputes between teams, angry customers, canceled contracts, lawsuits, and many other disasters.

In most cases, the software development team was simply not in the right condition to do its job.

In this article you will find my real life experience that you can use to make the life of your developers easier, and avoid losing customers and money due to unexpected technical problems in your applications.

## Why Monitoring Matter

The time many developers feel the need to monitor their applications often is when they first start working on a medium / large project.

The reason is simple: when a software becomes complex, or serves highly valuable customers, software bugs become expensive; doubly so when your customers find them! Customers may rate you as unreliable and look around for alternatives.

*Monitoring is the way for developers to avoid unexpected incidents and retain happy customers as long as possible – which means stable income over time.*

## Infrastructure-driven monitoring tools

The most known monitoring platforms like DataDog, Dynatrace, NewRelic, AppDynamics, and others, require to be installed and configured at the server level or on the IT infrastructure in general, but many developers hate to deal with it, and instead they love to stay focused on coding.

The tools mentioned above require a lot of assistance and training or even a dedicated engineering team (familiar with servers and infrastructure stuff) for configuration and maintenance, and tend to be too complex and expensive for small/medium teams that need to stay focused only on application development.

Dealing with infrastructure is a concern for many developers for two reasons:

### 1) Work overload

Managing IT operations is a profession in itself. It requires a lot of vertical skills about server environments, and involves complicated technologies (like Kubernetes).

For basic needs developers tend to rely on external tools to automate server provisioning like Cloud Hosting panels, PaaS platforms, or similar, in order to reduce this concern.

But in mid-large organizations, or when the company scales up, it may be necessary to have a dedicated team to take care of the infrastructure, leaving developers free to spend their time working on the application’s code and implementing new features.

### 2) Everything configured at the server level tend to be out of the developers control

Whether you’re using infrastructure automation tools, or even have external teams to take care of it, everything configured at the server level is out of the software development lifecycle, and developers tend to lose their autonomy against other teams.

Each team in your company has its own monitoring needs (Kubernetes, Cyber Security, Networking & Infrastructure, Privacy & Compliance, application, etc.). Something that works in one scenario may be a bottleneck in another.

Recently during a conference call with the management of one of the largest utility companies in Europe ([Terna S.P.A](https://www.terna.it/en).) I saw the heads of the software development team and the infrastructure operations team meeting for the first time in years of working within the company.

Because sharing tools across different teams was not easy, instead of depending on the operations team for any configuration or customization, software developers continued to rely on logs to monitor their applications.

Forcing the collaboration of different teams with different goals on the same tool can create confusion, constant email exchanges across teams to adjust configurations, or make customizations, and in the end software developers almost always have the worst because they have no control over everything that is installed inside the infrastructure.

If developers aren't in the right conditions to do their job, they'll waste hours or days in front of any issue.

This is a perfect example for better understanding the drawbacks *infrastructure-driven* monitoring tools can create for software developers.

## Code-driven monitoring tool

Code-driven monitoring tools instead provide you with a software library that you can install and use like any other application dependencies (*a composer package for PHP applications, an npm module for nodejs, etc.*).

The idea behind a code-driven monitoring tool is to create a monitoring environment specifically designed for software developers avoiding any server or infrastructure configuration that many developers hate to deal with.

This technical difference (*rely on an application library instead of an agent at the server level*) has many implications on the ability of the software developers to identify bugs and bottlenecks within applications quickly, before they become downtimes.

Thanks to a tool that can be installed, configured and customized freely, without depending on any external team, developers will be able to identify and solve problems within applications faster:

- With no interaction with other teams;
- Without endless tickets or email exchanges that are bounced on multiple levels inside the company;
- Without delays for your customers.

One of the most important things customers pay for is "have no problems".

Making sure the software development team can work quickly and independently is critical to having:

- Less bug reports;
- Faster bug fix;
- More happy customers.

For several months I shared our idea about Inspector as a code-driven monitoring tool by giving talks at events of the Italian PHP communities, and discussing with other CTOs. On this page I have collected the reviews of the developers who use Inspector in their daily work: [https://inspector.dev/testimonials/](/testimonials/)
