---
title: "Mixing LLM Providers Inside a Neuron AI Agent"
slug: "routing-inference-calls-between-providers-in-neuron-ai"
section: "neuron-ai"
permalink: "/routing-inference-calls-between-providers-in-neuron-ai/"
original_url: "https://inspector.dev/routing-inference-calls-between-providers-in-neuron-ai/"
date: "2026-05-27T16:56:42Z"
updated: "2026-06-03T07:51:25Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI"]
tags: ["Laravel", "PHP", "codeigniter", "neuron", "saas", "software development", "symfony"]
description: "Neuron AI Router forwards chat, stream and structured calls to different LLM providers based on rules you define, while the agent stays unchanged."
focus_keyword: "Neuron AI"
featured_image: "../images/routing-inference-calls-between-providers-in-neuron-ai/featured.png"
wp_id: 9815
---

When I started the v3 of Neuron AI, the first big decision I had to make was not about agents or tools, but about messages. Each LLM provider has its own way of describing a conversation: OpenAI uses one shape, Anthropic another, Gemini and Ollama add their own variations on top. I could have written thin wrappers and let each provider speak its native dialect, pushing the complexity back to the application developer. Instead, I spent a lot of time on what I now call the Unified Messaging Layer: a single representation of messages, content blocks, and tools, that every provider knows how to translate into its own format.

That work felt almost invisible from the outside. People want to see agents, RAG, workflows, the visible parts of a framework. A messaging layer is plumbing, and plumbing is boring until the day it lets you do something you didn't plan for. Last week, while sketching out a few changes requested by developers running production agents, I realized that this old design choice had quietly enabled a feature I hadn't explicitly designed: routing a single inference call to different providers, transparently to the agent itself.

That's what the new [neuron-core/router](https://github.com/neuron-core/router) package is. It exposes a `RouterProvider` that implements `AIProviderInterface`, the same contract every Neuron provider implements. From the agent's perspective, it is just another provider. Under the hood, every call to `chat()`, `stream()`, or `structured()` is delegated to one of several registered providers, chosen by a routing rule you control.

It's like OpenRouter but inside your code :). Here is the smallest example I can write:

```php
use NeuronAI\Agent\Agent;
use NeuronAI\Router\RouterProvider;
use NeuronAI\Router\Rules\RoundRobinRule;
use NeuronAI\Providers\Anthropic\Anthropic;
use NeuronAI\Providers\OpenAI\OpenAI;
use NeuronAI\Providers\AIProviderInterface;

class MyAgent extends Agent
{
    protected function provider(): AIProviderInterface
    {
        return RouterProvider::make()
            ->addProvider('anthropic', new Anthropic(
                key: 'ANTHROPIC_API_KEY',
                model: 'claude-sonnet-4-20250514',
            ))
            ->addProvider('openai', new OpenAI(
                key: 'OPENAI_API_KEY',
                model: 'gpt-4o',
            ))
            ->setRule(
                new RoundRobinRule(['anthropic', 'openai'])
            );
    }
}
```

The agent class is unchanged in every other way. Instructions, tools, observers, RAG: they all keep working exactly as before. The router is a drop-in replacement for a single provider.

## Why this matters in practice

I want to walk through the scenarios that came up most often in conversations with people building real things on top of Neuron AI, because the value of the router only becomes clear when you see it next to a concrete problem.

The first one is structured output. Some models follow JSON schemas more reliably than others, especially when the schema gets nested or strict. A team I was talking to a few weeks ago had standardized on Claude for the conversational quality of their agent, but kept hitting edge cases when extracting structured data. The honest answer is: use a different model for that specific call. Until now, that meant maintaining two agents or branching the code at the call site. With the router, you can just pass a rule:

```php
$router->setRule(
    new MethodRule('anthropic')->structured('openai')
);
```

Every `chat()` goes to Claude, every `structured()` goes to GPT, and the agent code stays the same.

The second scenario is multimodality. Providers don't all support the same content blocks, and even when they do, the quality and pricing vary. Gemini handles video natively, OpenAI does well with some file formats, others are at their best on plain reasoning. The `ContentRule` inspects the message content and routes accordingly:

```php
$router->setRule(
    new ContentRule('anthropic')
        ->image('gemini')
        ->video('gemini')
        ->file('openai')
);
```

When a user attaches a video to the agent, the request silently lands on Gemini. When the same user sends a plain text question right after, it goes back to Anthropic. The agent has no idea this is happening, and neither does the application code that drives it.

The third scenario is cost and resilience. Round-robin distribution between two providers can spread load across rate limits and reduce the blast radius of a temporary outage on one side. When the logic gets more nuanced, the `CallbackRule` lets you write any custom decision you want, with access to the method being called, the messages, and the tools attached to the request:

```php
$router->setRule(new CallbackRule(
    function (string $method, array $messages, array $tools): string {
        return count($tools) > 0 ? 'anthropic' : 'openai';
    }
));
```

For anything beyond what callbacks comfortably express, you can implement `RoutingRuleInterface` directly and use any signal you want, including request metadata, token estimates, time of day, or whatever your application exposes.

## Why this works at all

I mentioned earlier that the [Unified Messaging Layer](https://docs.neuron-ai.dev/agent/messages) is what made this package possible. It is worth being concrete about why.

Routing between providers only works if the same message can be sent to any of them without the agent code adapting to each one. In Neuron AI, a `UserMessage` carries a list of `ContentBlock` objects: text, image, file, audio, video, reasoning. Each provider implementation knows how to map these blocks into its own request and response format. The router doesn't need to know anything about the messages it forwards, because the providers themselves take care of the translation step at the boundary.

The fact that I can ship a small proxy that works with every existing Neuron provider, including future ones, is a direct consequence of a decision made when a few months ago approaching v3.

That's the part I find more interesting than the package itself. Small architectural choices made early on tend to compound. The Unified Messaging Layer was not designed with routing in mind, it was designed to keep agent code independent of the LLM behind it. But the same property that makes the agent independent of one provider also makes it indifferent to which provider answers each call. The router is the natural extension of that property.

## Getting started

Install the package with composer:

```bash
composer require neuron-ai/router
```

The [README](https://github.com/neuron-core/router) on GitHub covers the built-in rules in detail, including the use of a default provider for the cases where the agent needs access to the underlying message and tool mappers before any inference call has been made. If you build something interesting with custom rules, in particular logic involving cost estimation or fallback behaviors, please share it on the community channels. There is a clear space for community-contributed rules, and `neuron-ai/router` is built so that adding one is just an implementation of a single interface.

[**https://github.com/neuron-core/router**](https://github.com/neuron-core/router)
