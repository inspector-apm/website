---
title: "How to Stop a Streamed AI Response Mid-Flight in Neuron AI v3"
slug: "how-to-stop-a-streamed-ai-response-mid-flight-in-neuron-ai-v3"
section: "neuron-ai"
permalink: "/how-to-stop-a-streamed-ai-response-mid-flight-in-neuron-ai-v3/"
original_url: "https://inspector.dev/how-to-stop-a-streamed-ai-response-mid-flight-in-neuron-ai-v3/"
date: "2026-04-13T18:04:28Z"
updated: "2026-04-14T10:48:06Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Software development"]
tags: ["Laravel", "PHP", "codeigniter", "neuron", "saas", "software development", "symfony", "ui"]
description: "Implement a stop button for streaming AI responses in NeuronAI v3. This article walks through a real GitHub discussion and a clean solution."
focus_keyword: "ai agent"
featured_image: "../images/how-to-stop-a-streamed-ai-response-mid-flight-in-neuron-ai-v3/featured.png"
wp_id: 9752
---

One thing I didn't anticipate when building [Neuron AI](https://neuron-ai.dev) was how many edge cases would surface not from the AI integration itself, but from the UI layer sitting on top of it. Developers don't just want agents that work. They want agents that feel right to use. And the moment you start building chat interfaces on top of streaming responses, you quickly realize that "feeling right" involves a lot of details that never show up in framework documentation.

A developer posted a [new discussion](https://github.com/neuron-core/neuron-ai/discussions/444) on the Neuron AI GitHub repository asking about something deceptively simple: *how do you let a user stop a streaming response while it's still in progress?*

You ask a question, the model starts generating a long answer, you realize mid-way through that it's going in the wrong direction, and you want to interrupt it. ChatGPT has a stop button. Claude has one too. From a user experience standpoint it's a small thing. From an implementation standpoint, it's trickier than it looks.

The developer, had already built a reasonable first attempt. His approach was to set a cache key when the user clicked stop, then check that key inside the streaming loop before processing each chunk. The code was clean and the idea was sound:

```php
public function newMessage(Request $request, Chat $chat): StreamedResponse
{
    Cache::forget("chat_stop_{$chat->id}");

    return new StreamedResponse(function () use ($chat) {
        $stream = $this->agent->stream(new UserMessage($request->prompt));

        foreach ($stream as $chunk) {
            if (Cache::get("chat_stop_{$chat->id}")) {
                Cache::forget("chat_stop_{$chat->id}");
                echo 'data: '.json_encode(['status' => 'stopped'])."\n\n";
                flush();
                break;
            }

            echo 'data: '.json_encode(['content' => $chunk])."\n\n";
            flush();
        }
    });
}
```

The problem was that breaking out of the loop early bypassed the part of the framework responsible for saving the `AssistantMessage` to chat history. The message was never persisted, leaving the conversation state inconsistent. He asked whether there was a recommended way to handle this properly, and whether partial responses could be saved on interruption.

My initial answer was honest about the state of things: in earlier versions of the framework it would have been difficult to hook deeply enough into the streaming mechanism to solve this cleanly. But with v3, the architecture changed in a way that made this kind of customization straightforward. Every AI provider now accepts an injectable HTTP client, which means you can intercept the connection at a lower level than the application loop.

The developer upgraded to v3, read the [upgrade guide](https://docs.neuron-ai.dev/overview/upgrade), and came back a few days later with a solution that I think deserves to be documented properly.

## The Architecture Behind the Fix

In Neuron AI v3, every provider component accepts an `httpClient` parameter. By default the framework uses `GuzzleHttpClient`, but you can pass in any class that implements `HttpClientInterface`. This was introduced primarily to support async execution, but it opens the door to a wider range of customizations, this being a good example.

The key insight is that streaming in the framework is not just a PHP `foreach` loop iterating over chunks. Under the hood, the provider calls `$httpClient->stream()`, which returns a `StreamInterface` object. The framework then reads from that stream until `eof()` returns `true`. This means that if you control the `StreamInterface` implementation, you control when the stream ends, from the framework's perspective.

The developer implemented two classes: `StoppableHttpClient` and `StoppableStream`. The HTTP client is a decorator around the default Guzzle client. It delegates all standard operations to the inner client but intercepts the `stream()` call to wrap the result in

```php
class StoppableHttpClient implements HttpClientInterface
{
    public function __construct(
        private readonly string $chatId,
        private readonly HttpClientInterface $inner = new GuzzleHttpClient,
    ) {}

    public function request(HttpRequest $request): HttpResponse
    {
        return $this->inner->request($request);
    }

    public function stream(HttpRequest $request): StreamInterface
    {
        return new StoppableStream($this->inner->stream($request), $this->chatId);
    }

    public function withHeaders(array $headers): HttpClientInterface
    {
        return new self($this->chatId, $this->inner->withHeaders($headers));
    }

    public function withBaseUri(string $baseUri): HttpClientInterface
    {
        return new self($this->chatId, $this->inner->withBaseUri($baseUri));
    }

    public function withTimeout(float $timeout): HttpClientInterface
    {
        return new self($this->chatId, $this->inner->withTimeout($timeout));
    }
}
```

Notice that `withHeaders`, `withBaseUri`, and `withTimeout` all return a new `self` instance, preserving the decorator pattern and keeping the `chatId` context intact through any configuration the framework might apply to the client internally.

The real logic lives in `StoppableStream`. Its `eof()` method does something simple but effective: before delegating to the inner stream, it checks a cache key. If the key is set, it marks itself as stopped, clears the flag, closes the underlying connection, and returns `true`. Returning `true` from `eof()` signals to the framework that the stream has ended naturally, which means the normal post-stream behavior runs, including saving the partial `AssistantMessage` to history:

```php
class StoppableStream implements StreamInterface
{
    private bool $stopped = false;

    public function __construct(
        private readonly StreamInterface $inner,
        private readonly string $chatId,
    ) {}

    public function eof(): bool
    {
        if ($this->stopped) {
            return true;
        }

        if (Cache::get("chat_stop_{$this->chatId}")) {
            $this->stopped = true;
            Cache::forget("chat_stop_{$this->chatId}");
            $this->inner->close();

            return true;
        }

        return $this->inner->eof();
    }

    public function read(int $length): string
    {
        return $this->inner->read($length);
    }

    public function readLine(): string
    {
        return $this->inner->readLine();
    }

    public function close(): void
    {
        $this->inner->close();
    }
}
```

The `$stopped` flag is a small but important detail. Once the stream decides it's done, subsequent calls to `eof()` return `true` immediately without touching the cache again. This avoids any ambiguity if the framework calls `eof()` multiple times after the interruption.

## Wiring It Into the Agent

Injecting the custom client into an agent is exactly as straightforward as you'd expect. You pass the `chatId` into the agent constructor and use it when building the provider:

```php
class BlogAgent extends Agent
{
    public function __construct(protected string $chatId)
    {
        parent::__construct();
    }

    protected function provider(): AIProviderInterface
    {
        return new Gemini(
            key: config('services.gemini.api_key'),
            model: 'gemini-3-flash-preview',
            httpClient: new StoppableHttpClient($this->chatId),
        );
    }

    protected function chatHistory(): ChatHistoryInterface
    {
        return new EloquentChatHistory(
            threadId: $this->chatId,
            modelClass: ChatMessage::class,
            contextWindow: 75000
        );
    }

    public function instructions(): string
    {
        return (string) new SystemPrompt(
            background: BlogAgentPrompt::getBackgroundPrompt($this->chatId),
            output: BlogAgentPrompt::OUTPUT,
        );
    }
}
```

On the HTTP side, the stop endpoint remains exactly what the developer originally had: a simple controller action that sets the cache key, which the `StoppableStream` will pick up on its next `eof()` check:

```php
public function stop(Chat $chat): JsonResponse
{
    Cache::put("chat_stop_{$chat->id}", true, 60);
    return response()->json(['status' => 'stopping']);
}
```

### Why This Approach Works Well

What I find most interesting about this solution is where the logic lives. The developer's original approach tried to solve the problem at the application loop level, after the stream had already been read by the framework. This created the side effect of bypassing history persistence. By moving the logic down into the `StreamInterface` layer, the interruption becomes invisible to the rest of the framework. As far as Neuron AI is concerned, the stream simply ended. Everything that normally happens at the end of a stream still happens.

It also keeps the agent class clean. The `BlogAgent` doesn't know or care that its stream can be stopped externally. That concern lives entirely in `StoppableHttpClient` and `StoppableStream`, which can be reused across any agent in the application that needs the same behavior.

After seeing this solution I noted is a well-composed solution that works cleanly within the existing extension points v3 provides.

## Resources

If you are getting started with AI Agents, or you simply want to elevate your skills to a new level here is a list of resources to help you go in the right direction:

- **Repository**: [https://github.com/inspector-apm/neuron-ai](https://github.com/inspector-apm/neuron-ai)
- **Newsletter**: [https://neuron-ai.dev](https://neuron-ai.dev/)
- **E-Book (Start With AI Agents In PHP)**: [https://www.amazon.com/dp/B0F1YX8KJB](https://www.amazon.com/dp/B0F1YX8KJB)
