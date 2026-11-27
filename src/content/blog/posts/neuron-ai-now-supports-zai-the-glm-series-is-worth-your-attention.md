---
title: "Neuron AI Now Supports ZAI — The GLM Series Is Worth Your Attention"
slug: "neuron-ai-now-supports-zai-the-glm-series-is-worth-your-attention"
section: "neuron-ai"
permalink: "/neuron-ai-now-supports-zai-the-glm-series-is-worth-your-attention/"
original_url: "https://inspector.dev/neuron-ai-now-supports-zai-the-glm-series-is-worth-your-attention/"
date: "2026-03-12T17:44:56Z"
updated: "2026-03-12T17:55:16Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Product Updates"]
tags: ["Laravel", "PHP", "codeigniter", "neuron", "software development", "symfony"]
description: "Build powerful multimodal agents with Neuron AI's new ZAI integration. Features native support for GLM-5 reasoning, image generation, and audio workflows."
focus_keyword: "ZAI"
featured_image: "../images/neuron-ai-now-supports-zai-the-glm-series-is-worth-your-attention/featured.png"
wp_id: 9706
---

There's a pattern I've noticed over the past year while working on Neuron AI: the decisions that matter most are rarely about chasing trends. They're about quietly recognizing something that works, testing it seriously, and integrating it so that other developers can benefit without having to do that work themselves.

That's the honest story behind adding **[ZAI](https://z.ai)** platform integration to [Neuron AI](https://neuron-ai.dev).

I started evaluating the GLM models, because the numbers made me curious. GLM-5 is a 744 billion parameter Mixture-of-Experts model, with 40 billion parameters active per token, trained on 28.5 trillion tokens. For context: it currently holds the top spot among open-weight models on several banchmarks, and places competitively against frontier closed models on reasoning tasks. You can read more about their amazing job in this article: [https://z.ai/blog/glm-5](https://z.ai/blog/glm-5)

It's also open-weight. There's a real case to be made that GLM-5 represents the most capable open model available right now, and that matters if you care about the ability to self-host, audit, and control what runs inside your applications.

I tested it. It earned its place in the framework.

## A note on ZAI

This integration is also the beginning of a collaboration with [ZAI](https://z.ai). They've offered to help spread the word about Neuron within their developer community, which I'm genuinely grateful for. The PHP ecosystem sometimes feels isolated from the broader AI conversation — most of the tooling, the tutorials, and the discourse assumes Python. Partnerships like this one help change that. I want Neuron to be where PHP developers go when they're serious about building agentic systems, and having ZAI's support is a meaningful step in that direction. More will follow.

## Using ZAI as an AI Provider

The core integration is straightforward. You swap in the `ZAI` provider and you're done — all of Neuron's agentic capabilities, including **tools, streaming, structured output, middleware, MCP connectors, and RAG**, work exactly as they do with any other provider.

- **Advanced Reasoning Models**: Unlocking complex, multi-step agentic workflows.
- **Multimodal Input & Output**: Allowing agents to natively perceive and interact with the world.
- **Image Generation**: Giving your agents the ability to create visual assets on the fly.
- **Audio Transcription**: Bridging the gap between voice and agentic action.

```php
namespace App\Neuron;

use NeuronAI\Agent\Agent;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\ZAI\ZAI;

class MyAgent extends Agent
{
    protected function provider(): AIProviderInterface
    {
        return new ZAI(
            key: 'ZAI_API_KEY',
            model: 'glm-5',
        );
    }
}

$message = MyAgent::make()
    ->chat(new UserMessage("Analyze the performance bottleneck in this query..."))
    ->getMessage();

echo $message->getContent();
```

The GLM series also supports reasoning models. If you want the model to think through a problem before responding, you pass the appropriate parameters through the `parameters` array, as you would with any other provider in Neuron.

Full documentation: [docs.neuron-ai.dev/providers/ai-provider#zai](https://docs.neuron-ai.dev/providers/ai-provider#zai)

## Image Generation

ZAI exposes an image generation endpoint through the `glm-image` model. In Neuron, this is implemented as a dedicated `ZAIImage` provider that implements the same `AIProviderInterface` used by all other providers. This means you can drop it directly into an agent, and it participates in the same middleware and workflow infrastructure.

```php
namespace App\Neuron;

use NeuronAI\Agent\Agent;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\ZAI\Image\ZAIImage;

class ImageAgent extends Agent
{
    protected function provider(): AIProviderInterface
    {
        return new ZAIImage(
            key: 'ZAI_API_KEY',
            model: 'glm-image',
        );
    }
}

$message = ImageAgent::make()
    ->chat(new UserMessage("Generate a diagram of a distributed caching architecture"))
    ->getMessage();

// Returns the URL of the generated image
echo $message->getImage()->getContent();
```

If you prefer to use the provider directly, without wrapping it in an agent class, that's supported too:

```php
use NeuronAI\Providers\ZAI\Image\ZAIImage;

$provider = new ZAIImage(
    key: 'ZAI_API_KEY',
    model: 'glm-image',
);

$message = $provider->chat(new UserMessage("A technical illustration of an event-driven system"));

echo $message->getImage()->getContent();
```

Full documentation: [docs.neuron-ai.dev/providers/image#zai-image](https://docs.neuron-ai.dev/providers/image#zai-image)

## Audio Transcription

The ZAI audio integration covers speech-to-text transcription via the `glm-asr-2512` model. The pattern is consistent with how all audio providers work in Neuron: you pass an `AudioContent` object inside a `UserMessage`, and the provider returns a standard message whose text content contains the transcription.

```php
use NeuronAI\Providers\ZAI\Audio\ZAITranscription;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Chat\Messages\Content\AudioContent;
use NeuronAI\Chat\Messages\Content\SourceType;

$provider = new ZAITranscription(
    key: 'ZAI_API_KEY',
    model: 'glm-asr-2512',
);

$message = $provider->chat(
    new UserMessage(
        new AudioContent(__DIR__ . '/assets/recording.mp3', SourceType::URL)
    )
);

echo $message->getContent();
```

This fits naturally into workflows that involve voice input, meeting transcription, or any pipeline where audio needs to feed into an agent. Because the transcription provider implements the standard `AIProviderInterface`, you can also embed it inside a larger agentic workflow and apply middleware — rate limiting, logging, guardrails — the same way you would anywhere else in Neuron.

Full documentation: [docs.neuron-ai.dev/providers/audio#zai](https://docs.neuron-ai.dev/providers/audio#zai)

## What comes next

This is a first step. The collaboration with ZAI opens up the possibility of going deeper: more model capabilities, more joint content, more visibility for PHP developers who are building serious agentic applications. I'm not going to over-promise what that looks like in practice, but the intention on both sides is to keep building.

If you're already using Neuron, you can start experimenting with ZAI models today. The [full documentation](https://docs.neuron-ai.dev) covers everything you need. Feel free to open an issue on the Neuron repository or contribute if you find possible improvements: [https://github.com/neuron-core/neuron-ai](https://github.com/neuron-core/neuron-ai)
