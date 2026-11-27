---
title: "The Neuron Facade: Talking to Your AI Agent in Laravel"
slug: "the-neuron-facade-talking-to-your-ai-agent-in-laravel"
section: "neuron-ai"
permalink: "/the-neuron-facade-talking-to-your-ai-agent-in-laravel/"
original_url: "https://inspector.dev/the-neuron-facade-talking-to-your-ai-agent-in-laravel/"
date: "2026-07-15T14:20:39Z"
updated: "2026-07-15T14:20:57Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI"]
tags: ["Laravel", "PHP", "neuron", "software development"]
description: "Discover the Neuron facade in the Neuron AI Laravel SDK: a ready-to-use entry point for chat, streaming, and structured LLM output in Laravel."
focus_keyword: "neuron ai facades"
featured_image: "../images/the-neuron-facade-talking-to-your-ai-agent-in-laravel/featured.png"
wp_id: 9846
---

Before this release, using [Neuron AI inside Laravel](https://github.com/neuron-core/neuron-laravel) meant creating a dedicated agent class, extending `Agent`, implementing a `provider()` method, and wiring the system prompt yourself. That pattern is the right one once your agent has a personality, a set of tools, and a role in your application. But it is a lot of ceremony for a developer who just wants to check whether Claude, or GPT, or Gemini responds well to a given prompt, or who is prototyping a small internal feature that talks to an LLM once and does not need to be a first class citizen of the codebase.

Laravel developers already know a pattern for this kind of situation: facades. A facade gives you a short, expressive entry point to a service that Laravel has already configured and bound into the container, without forcing you to resolve it manually every time. That is precisely the role the `Neuron` facade plays here. It reads the default AI provider and the system instructions from your `config/neuron.php` file, so the agent is already configured by the time you touch it in your code. You are not instantiating a provider, you are not wiring credentials, you are just asking a question.

## Setting it up

If you have not published the configuration file yet, do it once:

```bash
php artisan vendor:publish --tag=neuron-config
```

Then set your provider and credentials in the environment file, the same way you would for any other Laravel service:

```properties
NEURON_AI_PROVIDER=anthropic
ANTHROPIC_KEY=your-key-here
ANTHROPIC_MODEL=claude-sonnet-5
```

From here on, the facade is ready to use anywhere in your application code.

## Three ways to talk to the agent

The facade exposes the three interaction modes that cover most real world use cases, and they read the same way you would already write a controller. A synchronous chat, for when you want the full answer at once:

```php
namespace App\Http\Controllers;

use NeuronAI\Laravel\Facades\Neuron;
use NeuronAI\Chat\Messages\UserMessage;

class AskController extends Controller
{
    public function __invoke(Request $request)
    {
        $response = Neuron::chat(
            new UserMessage($request->input('question'))
        )->getMessage();

        return response()->json([
            'answer' => $response->getContent(),
        ]);
    }
}
```

A streaming mode, for when you want to push tokens to the frontend as they arrive instead of making the user stare at a spinner:

```php
namespace App\Http\Controllers;

use NeuronAI\Laravel\Facades\Neuron;
use NeuronAI\Chat\Messages\UserMessage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AskStreamController extends Controller
{
    public function __invoke(Request $request): StreamedResponse
    {
        return response()->stream(function () use ($request) {
            foreach (Neuron::stream(new UserMessage($request->input('question')))->events() as $event) {
                echo $event->content;
                ob_flush();
                flush();
            }
        });
    }
}
```

If your frontend already speaks a real streaming protocol instead of raw text chunks, you don't have to write that translation layer yourself. Neuron ships adapters that turn its internal stream into the event format your frontend framework expects, and [AG-UI](https://docs.ag-ui.com/introduction) is one of them. Pass an `AGUIAdapter` instance to `events()` and the facade takes care of formatting text, tool calls, reasoning, and lifecycle events the way the protocol requires:

```php
namespace App\Http\Controllers;

use NeuronAI\Laravel\Facades\Neuron;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Chat\Messages\Stream\Adapters\AGUIAdapter;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AgUiStreamController extends Controller
{
    public function __invoke(Request $request): StreamedResponse
    {
        $adapter = new AGUIAdapter();
        $handler = Neuron::stream(new UserMessage($request->input('question')));
        $stream = $handler->events($adapter);

        return response()->stream(function () use ($stream) {
            foreach ($stream as $line) {
                echo $line;
                ob_flush();
                flush();
            }
        }, 200, $adapter->getHeaders());
    }
}
```

If you are building on the Vercel AI SDK instead, swap in `VercelAIAdapter` and the controller stays the same shape. Either way, your agent logic does not change, only the wire format does, which means you can point the same endpoint at different frontends without rewriting the streaming code every time.

And structured output, for when you do not want prose back but a typed object you can actually work with in your application logic. This is a good fit for background jobs, where you want the LLM's answer stored as data rather than as text:

```php
namespace App\Jobs;

use App\Models\Lead;
use NeuronAI\Laravel\Facades\Neuron;
use NeuronAI\Chat\Messages\UserMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class QualifyLead implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Lead $lead) {}

    public function handle(): void
    {
        $profile = Neuron::structured(
            new UserMessage($this->lead->notes),
            LeadProfile::class
        );

        $this->lead->update([
            'budget' => $profile->budget,
            'intent' => $profile->intent,
        ]);
    }
}
```

That last example matters more than it looks. A lot of the friction people feel with LLMs in production comes from parsing free text into something a program can trust. Structured output turns the model's answer into a PHP object, which means the job can update the `Lead` record directly instead of scraping a paragraph for the information it needs.

## Configuring a single call without touching the shared instance

This is the part I paid the most attention to while designing the facade, because it is also the part most likely to bite someone in production if it is not handled carefully. `Neuron` resolves a singleton from the container. If configuration methods mutated that singleton directly, attaching a tool or a middleware in one request could leak into the next one, since the same instance would be reused across the application lifecycle. So instead, methods like `tools()` and `middleware()` return a fresh, independent copy that you chain into your call, and the original shared instance stays untouched.

```php
namespace App\Http\Controllers;

use NeuronAI\Laravel\Facades\Neuron;
use NeuronAI\Chat\Messages\UserMessage;

class SupportSearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $response = Neuron::tools(new SearchTool())
            ->chat(new UserMessage($request->input('question')))
            ->getMessage();

        return response()->json(['answer' => $response->getContent()]);
    }
}

// Elsewhere in the app, the shared instance is untouched and still has no tools attached
Neuron::chat(new UserMessage('Hello!'));
```

Middleware works the same way, and it targets the specific node responsible for the step you want to observe or control. If you want a human to approve every tool execution before it runs, you attach the middleware to `ToolNode`:

```php
namespace App\Http\Controllers;

use NeuronAI\Laravel\Facades\Neuron;
use NeuronAI\Agent\Middleware\ToolApproval;
use NeuronAI\Agent\Nodes\ToolNode;
use NeuronAI\Chat\Messages\UserMessage;

class ServerOpsController extends Controller
{
    public function __invoke(Request $request)
    {
        $response = Neuron::middleware(ToolNode::class, new ToolApproval())
            ->chat(new UserMessage($request->input('command')))
            ->getMessage();

        return response()->json(['answer' => $response->getContent()]);
    }
}
```

Each interaction mode is backed by its own node, `ChatNode` for `chat()`, `StreamingNode` for `stream()`, `StructuredOutputNode` for `structured()`, so you can be precise about which part of the pipeline your middleware is supposed to watch.

## Knowing when to graduate to a dedicated agent class

The facade is not meant to replace agent classes, it is meant to sit next to them. Once your use case grows past a single call, once you need a custom memory strategy, multiple middleware working together, or a recurring identity with its own tools and instructions, the right move is to run:

```php
php artisan neuron:agent MyAgent
```

and let that agent own its behavior properly. Think of the facade as the on ramp: fast to reach, honest about what it configures for you, and happy to hand things off once your idea has earned a class of its own.

## Try it and tell me what is missing

The Neuron AI Laravel SDK is open source, and the facade is one of those features that got better because people using it in real projects pushed back on the rough edges. If you build something with it, or if you hit a case it does not cover yet, the repository is the right place to bring it: **[github.com/neuron-core/neuron-laravel](https://github.com/neuron-core/neuron-laravel)**. Open an issue if something feels off, or send a pull request if you already know how to fix it. PHP is not late to the agentic conversation, we are just having it in our own syntax.
