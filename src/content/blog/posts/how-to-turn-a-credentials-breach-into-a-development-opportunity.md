---
title: "How to turn a credentials breach in a development opportunity"
slug: "how-to-turn-a-credentials-breach-into-a-development-opportunity"
section: "inspector"
permalink: "/how-to-turn-a-credentials-breach-into-a-development-opportunity/"
original_url: "https://inspector.dev/how-to-turn-a-credentials-breach-into-a-development-opportunity/"
date: "2020-09-02T10:22:48Z"
updated: "2025-07-01T16:29:11Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["monitoring", "ui", "ux"]
description: "How to turn a credentials breach in a development opportunity! How we developed Two Factor authentication system, and logged-in devices check"
focus_keyword: "inspector development"
seo_title: "How to turn a credentials breach in a development opportunity - Inspector"
featured_image: "../images/how-to-turn-a-credentials-breach-into-a-development-opportunity/featured.png"
old_slugs: ["how-to-turn-a-credentials-breach-in-a-development-opportunity"]
wp_id: 1232
---

Hi, I’m Valerio founder and CTO at Inspector.

Recently my personal account on one of our external tools was cracked. My credentials have been stolen so the attackers have had access to this service with our credit card attached.

**There were no risks for our users security, but only for our bank account,** because attackers could use up our credits or use our account for public spam activities.

This experience has made us much more aware of the value of using (and develop) safe tools. We have therefore decided to bring some new features into Inspector that allow our customers to keep their account more secure, avoiding being victims of these violations as we have.

## Regaining control

As soon as we realized that something was wrong with our tool, we’ve immediately disabled the credit card and removed the tool from our stack.

There were no risks for our users security, but only for our bank account.

Compromised credentials will always present a risk, but there are policies that can mitigate that risk.

The first step is to establish policies for the strength and management of passwords. Not all credentials are created equal.

For accessing sensitive information and for administrative access to internal working tools, stronger, more complex passwords and additional factors such as biometrics, cryptographic keys or 2FA confirmation codes are now required by default in our company.

This includes also all social media accounts of the entire team.

Now it’s time to bring what we have learned on Inspector. Below I present you the next security features we have decided to implement in Inspector.

## Control Logged-in devices

This feature should allows our users to check the logged-in devices and easily log-out from a specific device with a simple click.

Below the detail of what we want to develop:

- Displays currently logged in devices for a user in the profile section.
- Log out from any specific device from the list of currently logged-in devices.
- An option to log out from all other devices except the currently logged-in device.
- An option to disable multiple device logins altogether. This means that a user can only be logged in from one device at a time.

If you will log in Inspector from your smartphone, you will see this new device in the logged-in devices list. This will allow you to identify unknown devices in the list, disconnect them with a simple click, and change your password to protect your account from unexpected authentications.

## 2FA Authentication

Are you using the same password for multiple websites including Inspector? Are you accessing Inspector from public or shared computers?

Such action weaken your password and make it easier to steal.

That’s why we’ll implement two step verification. An optional security feature that helps protect your account even if your password is stolen or cracked.

This feature will improve security because signing in requires two things:

- Something you know: **Your Password**
- Something you have: **Your Phone**

If an attacker crack your credentials he cannot authenticate into your Inspecotr account because he doesn’t have your phone to provide us the security code.

## Reject insecure passwords

In order to increase the average security of our users account we'll also plan a password filter to avoid weak passwords to be used when developers create their account on Inspector.

According to Wikipedia many accounts are created with passwords that require just a few seconds to be hacked putting privacy and security at risk. Think about how sensitive are the data collected by a monitoring system, database queries, server information, and many other application details that an attacker could use for malicious purpose.

## Conclusion

While a startup grows fast some incident can happen, but the most important thing is to learn from mistakes and put the experience at the disposal of the customers.

I hope you appreciate our work to make Inspector a safer and more efficient product with the aim of helping you reach your goals quickly and easily.
