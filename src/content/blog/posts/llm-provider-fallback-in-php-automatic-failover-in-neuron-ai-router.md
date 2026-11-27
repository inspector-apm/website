---
title: "LLM Provider Fallback in PHP: Automatic Failover in Neuron AI Router"
slug: "llm-provider-fallback-in-php-automatic-failover-in-neuron-ai-router"
section: "neuron-ai"
permalink: "/llm-provider-fallback-in-php-automatic-failover-in-neuron-ai-router/"
original_url: "https://inspector.dev/llm-provider-fallback-in-php-automatic-failover-in-neuron-ai-router/"
date: "2026-07-03T09:14:56Z"
updated: "2026-09-15T13:16:08Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Software development"]
tags: ["Laravel", "PHP", "codeigniter", "neuron", "saas", "software development", "symfony"]
description: "Neuron Router adds fallback to PHP: define an ordered list of LLM providers, and transient failures like rate limits are retried on the next one."
focus_keyword: "llm provider"
featured_image: "../images/llm-provider-fallback-in-php-automatic-failover-in-neuron-ai-router/featured.png"
wp_id: 9839
---

When I published the first article about the [Neuron AI Router](/routing-inference-calls-between-providers-in-neuron-ai/), I expected questions about routing rules. Which rule to use for structured output, how to write a custom one, how the round robin behaves under load. Some of those questions arrived, but the most frequent one was different, and it wasn't really about routing at all. It was about failure. What happens to my agent when the provider goes down?

It is a fair question, and if you are new to building AI applications it deserves a proper answer before we look at any code.

Here is the short version. The new fallback strategy in Neuron AI Router lets you define an ordered list of LLM providers for your PHP agent. When an inference call fails with a transient error, such as a rate limit, a timeout, or an overloaded server, the same request is automatically retried on the next provider in the list. The failover is transparent: the agent never knows it happened, and the conversation continues without losing state. The rest of this article explains why this problem exists, why the usual solutions fall short, and how to configure it.

## Why LLM providers fail in production

An LLM provider is an external service you talk to over HTTP. Every time your agent thinks, it is making a network call to a machine you don't control, operated by a company that is currently serving millions of other requests. These services fail in very ordinary ways. You hit a rate limit because your traffic spiked. The provider returns an "overloaded" error because their traffic spiked. A request times out. A deployment on their side causes a few minutes of elevated error rates. None of this means you did something wrong, and none of it is rare. If you keep an agent in production long enough, you will see all of these.

In a classic web application, a failed call to a third party API is usually a corner of the system. You log it, maybe retry it in a queue, and the rest of the page still works. In an agent based application the inference call is not a corner, it is the heart. If the call fails, the feature is down. And agents make the situation worse in a subtle way: a single user request can trigger many inference calls, because the agent loops through tool executions, reasoning steps, and follow up messages. Every loop iteration is another chance to hit a bad moment on the provider side. The more capable your agent becomes, the more exposed it is.

The instinctive fix is a try/catch with a retry. It helps with a single timeout, but it has a structural weakness: when a provider is having a bad five minutes, retrying against the same provider just means failing more slowly. What you actually want in that moment is a different provider. And this is where things used to get uncomfortable, because switching providers meant either maintaining a second configuration of your agent, or branching your application code around the failure. The failure happens deep inside the agent execution, in the middle of a tool loop, so catching it at the application level and starting over throws away everything the agent had already done.

## Automatic failover at the provider boundary

The reason I'm writing about this in the context of the router package is that the router already sits at exactly the right layer to solve it. The `RouterProvider` is a proxy that implements `AIProviderInterface`, the same contract as every Neuron provider. It intercepts every `chat()`, `stream()`, and `structured()` call at the boundary between the agent and the outside world. If a provider fails at that boundary, the router is the one component in the system that can catch the error and forward the exact same request to another provider, without the agent ever knowing that anything happened.

That is what the new fallback strategy does. You define an ordered list of providers. The router sends the request to the first one. If the call fails with a transient error, the request moves to the next provider in the list, transparently. The agent receives a response as if nothing happened. The tool loop keeps running. The conversation state is untouched.

The word transient matters here. Not every error deserves a retry. If your API key is invalid or your request is malformed, sending the same request to the same provider again will fail in the same way, and the router doesn't waste time pretending otherwise. Rate limits, timeouts, and server side errors are a different story: they are tied to a moment in time on a specific provider, and the same request has a good chance of succeeding somewhere else right now. The fallback logic only reacts to this second category.

## LLM fallback in PHP with Neuron AI

With this update, routing rules become optional. If all you want is resilience, the configuration is two providers and a fallback order:

```php
use NeuronAI\Agent\Agent;
use NeuronAI\Router\RouterProvider;
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
            ->setFallback(['anthropic', 'openai']);
    }
}
```

Every call goes to Anthropic. If Anthropic answers with a transient error, the same call goes to OpenAI. Your agent code, your tools, your instructions, your RAG setup: nothing else changes. This is the same drop-in property the router had from day one, applied to a new problem.

Fallback and routing rules also compose. The rule decides where a request should go under normal conditions, and the fallback order decides what happens when that decision meets a failing provider:

```php
use NeuronAI\Router\Rules\MethodRule;

RouterProvider::make()
    ->addProvider('anthropic', new Anthropic(...))
    ->addProvider('openai', new OpenAI(...))
    ->addProvider('gemini', new Gemini(...))
    ->setRule(
        new MethodRule('anthropic')->structured('openai')
    )
    ->setFallback(['anthropic', 'openai', 'gemini']);
```

Here structured output goes to OpenAI and everything else to Anthropic, but if either of them is temporarily unavailable, the request finds its way to a working provider following the fallback order. The two mechanisms answer two different questions. The rule answers "who should handle this?", the fallback answers "who can handle this right now?".

One practical note. A fallback that works silently is great for your users and dangerous for your awareness. If Anthropic has been failing for two hours and every request has been quietly served by OpenAI, you want to know, because you are probably paying different prices and getting different model behavior. Keep an eye on your monitoring when you introduce fallback, and treat a spike of fallback activations as a signal worth investigating, not just a problem the system already solved for you.

## Why the LLM Router can exist as a composer package

In other ecosystems this job usually lives outside the application. You put a gateway service like OpenRouter between your code and the providers, and the gateway handles failover for you. That works, but it means adding another network hop, another vendor, another dashboard, and another place where your prompts travel.

Here the whole mechanism is a composer package inside your codebase. It is versioned with your application, configured in plain PHP, and testable with your own test suite. The reason this is possible is the same one I described in the first article of this series: the Unified Messaging Layer. Because every Neuron provider knows how to translate the same message representation into its own API format, the router can take a request that just failed on Anthropic and hand it to OpenAI without any translation work in between. The fallback strategy is not a feature bolted onto the router, it is the second consequence of the same architectural property. Routing was the first.

## Getting started

Update the package with composer:

```bash
composer require neuron-core/router
```

The [README on GitHub](https://github.com/neuron-core/router) covers the full configuration options, including how fallback interacts with each built-in rule, and the [Neuron AI documentation](https://docs.neuron-ai.dev) covers everything about providers and agents if you are starting from scratch. If you run agents in production and you have opinions about which errors should or should not trigger a fallback, open an issue or share your experience on the community channels. This feature came out of conversations with people running Neuron AI in production, and that is exactly how I'd like it to keep evolving.
