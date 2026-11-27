---
title: "Neuron AI Laravel SDK"
slug: "neuron-ai-laravel-sdk"
section: "neuron-ai"
permalink: "/neuron-ai-laravel-sdk/"
original_url: "https://inspector.dev/neuron-ai-laravel-sdk/"
date: "2026-01-06T16:01:28Z"
updated: "2026-01-13T14:28:43Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Product Updates", "Software development"]
tags: ["Laravel", "PHP", "neuron", "software development"]
description: "Integrate agentic AI into your Laravel apps with the Neuron AI SDK, featuring Artisan commands and Eloquent support."
focus_keyword: "neuron ai"
featured_image: "../images/neuron-ai-laravel-sdk/featured.png"
wp_id: 9596
---

For a long time, the conversation around "agentic AI" seemed to happen in a language that wasn't ours. If you wanted to build autonomous agents, the industry nudge was often to step away from the PHP ecosystem and move toward Python. But for those of us who have built our careers, companies, and products on Laravel, that's not just a technical hurdle, it’s a disruption to our livelihoods and the stable assets we’ve maintained for years.

I’ve been watching the Laravel community dive into AI recently, and it’s clear we don’t want to leave our ecosystem; we want to bring the power of AI into it. That is why I’ve released the **[Neuron AI Laravel SDK](https://github.com/neuron-core/neuron-laravel)**.

## Introduction to Neuron AI

Neuron is the leading PHP framework for creating and orchestrating AI Agents. It allows you to integrate AI entities in your PHP applications with a powerful and flexible architecture. We provide tools for the entire agentic application development lifecycle, from LLM interfaces, data loading, to multi-agent orchestration, monitoring and debugging. In addition, we provide tutorials and other educational content to help you get started using AI Agents in your projects.

[Create AI Agents in Laravel With NeuronAI](https://www.youtube.com/watch?v=oSA1bP_j41w)

This package isn’t an attempt to rewrite how you work with Neuron. Instead, it’s a bridge designed to integrate the the most common framework components directly into the Laravel container, along with other useful configurations.

It provides:

- **A configuration-driven service class** to manage AI providers.
- **Artisan commands** to scaffold agents and reduce boilerplate.
- **Eloquent-backed Chat History** components for persistent memory.
- **A ready-to-use configuration file** that follows standard Laravel conventions.
- **100% typed interfaces** to ensure your IDE remains your best friend.

## Is PHP Ready for the Agentic Era?

When we talk about whether PHP is "ready" for agentic applications, we aren't just talking about syntax. We are talking about the infrastructure of the web. Millions of businesses run on PHP. Families are supported by PHP-based SaaS products. Decades of business logic are wrapped in PHP objects and Service classes. Forcing a migration to a different language to stay relevant in the AI agents trend is a high-risk, low-reward move for most production environments.

The [Neuron AI Laravel SDK](https://github.com/neuron-core/neuron-laravel) is built on the belief that the most efficient way to build agentic systems is to do it where your data already lives. Neuron itself uses a very lean approach, there are no invasive abstractions that hide what’s happening under the hood. In this package we put our focus on a couple od Laravel integration points without limiting the access to the Neuron native components.

You can also use our code as an inspiration to design your own custom integration pattern.

### Building Your First Agent in Laravel

The integration is designed to feel native. After installing the package, you can define your agents and interact with them using the service container. You don’t have to worry about manually managing API keys or complex provider instantiations every time you want to trigger a task.

First install the package:

```bash
composer require neuron-core/neuron-laravel
```

Now you can run the command to create your first agent class, just like the native Neuron AI experience:

```bash
php artisan neuron:agent MyAgent
```

This command will create a new agent class: `App\Neuron\MyAgent`

## AI Provider

Neuron allows you to implement AI agents using many different providers, like Anthropic, Gemini, OpenAI, Ollama, Mistral, and many more. Learn more about supported providers in the Neuron AI documentation: **[https://docs.neuron-ai.dev/the-basics/ai-provider](https://docs.neuron-ai.dev/the-basics/ai-provider)**

To get an instance of the AI Provider you want to attach to your agent, you can use the `NeuronAI\Laravel\Facades\AIProvider` facade.

```php
namespace App\Neuron;

use NeuronAI\Agent;
use NeuronAI\SystemPrompt;
use NeuronAI\Laravel\Facades\AIProvider;
use NeuronAI\Providers\AIProviderInterface;

class YouTubeAgent extends Agent
{
    protected function provider(): AIProviderInterface
    {
        // return an instance of Anthropic, OpenAI, Gemini, Ollama, etc...
        return AIProvider::driver('anthropic');
    }
    
    public function instructions(): string
    {
        return (string) new SystemPrompt(...config('neuron.system_prompt');
    }
}
```

You can see all the available providers in the documentation: **[https://docs.neuron-ai.dev/the-basics/ai-provider](https://docs.neuron-ai.dev/the-basics/ai-provider)**

This package also provides you with a configuration file you can use to store all the confogiration options for ai providers. You can use the environment variable below to connect the agent with your preferred service:

```apacheconf
# Support for: anthropic, gemini, openai, openai-responses, mistral, ollama, huggingface, deepseek
NEURON_AI_PROVIDER=anthropic

ANTHROPIC_KEY=
ANTHROPIC_MODEL=

GEMINI_KEY=
GEMINI_MODEL=

OPENAI_KEY=
OPENAI_MODEL=

MISTRAL_KEY=
MISTRAL_MODEL=

OLLAMA_URL=
OLLAMA_MODEL=

# And many others
```

Here is a quick look at how you might implement a simple agent within a standard Laravel controller:

```php
use App\Neuron\MyAgent;
use NeuronAI\Chat\Messages\UserMessage;

class AgentController extends Controller
{
    public function __invoke(Request $request)
    {
        // Get a configured instance of an agent
        $agent = MyAgent::make();

        // Run the agent
        $response = $agent->chat(
            new UserMessage($request->input('prompt'))
        );

        return response()->json([
            'answer' => $response->getContent(),
        ]);
    }
}
```

This approach respects the Laravel lifecycle. Because Neuron is 100% typed and relies on clear interfaces, you can build custom plugins or extensions without guessing what the data structures look like. It handles the "agentic" part, the reasoning, the tool calling, and the memory, while you focus on the business logic.

## Eloquent Chat History

An additional Laravel specific component we provide is a predictable way to store chat histories in your existing database. The included **[Eloquent Chat History component](https://docs.neuron-ai.dev/the-basics/chat-history-and-memory#eloquentchathisotry)**, for example, allows you to treat AI interactions just like any other database record, making debugging and auditing straightforward.

Once you run the appropriate database migration you can use it in your agent with a simple line of code:

```php
namespace App\Neuron;

use App\Models\ChatMessage;
use NeuronAI\Agent;
use NeuronAI\Chat\History\ChatHistoryInterface;
use NeuronAI\Chat\History\EloquentChatHistory;

class MyAgent extends Agent
{
    ...
    
    protected function chatHistory(): ChatHistoryInterface
    {
        return new EloquentChatHistory(
            threadId: 'THREAD_ID',
            modelClass: ChatMessage::class,
            contextWindow: 50000
        );
    }
}
```

You don’t need to learn a new stack to build sophisticated AI workflows. You just need the right integration points. I encourage you to explore the Neuron AI documentation and start experimenting. Whether you're building a simple support bot or a complex multi-agent system, see how it feels to build "agentic" within the comfort of php.

[**https://docs.neuron-ai.dev**](https://docs.neuron-ai.dev)
