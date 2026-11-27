---
title: "Neuron 4 is Here 🚀 Welcome To The PHP Agentic Era"
slug: "neuron-4-is-here-welcome-to-the-php-agentic-era"
section: "neuron-ai"
permalink: "/neuron-4-is-here-welcome-to-the-php-agentic-era/"
original_url: "https://inspector.dev/neuron-4-is-here-welcome-to-the-php-agentic-era/"
date: "2026-10-01T09:26:00Z"
updated: "2026-10-07T15:38:30Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Product Updates", "Software development"]
tags: []
description: "Neuron AI is the first framework of the PHP ecosystem. Your next application will be Agentic. Build it with the technology you love."
focus_keyword: "neuron ai"
featured_image: "../images/neuron-4-is-here-welcome-to-the-php-agentic-era/featured.png"
old_slugs: ["neuron-4-is-here-%f0%9f%9a%80-welcome-to-the-php-agentic-era"]
wp_id: 9949
---

For the first year of this project, every conversation I had about Neuron AI started with the same question: *Can PHP really do this, or are you a few years behind Python and pretending otherwise?*

At some point in the months after Neuron 3.x, I noticed the question had stopped coming. Not because I got better in my answers, but because the people writing to me had moved on to different questions. Nobody asks whether the ground holds anymore. They ask how to build on it.

If you were here at the beginning, you know what that change cost. You remember being the person in the meeting who suggested building the agent in PHP, and the look you got across the table. You remember checking, before betting a client project on a library, whether it would still be maintained next month. Somewhere along the way you stopped explaining yourself, and you probably can't say on which day it happened. Neither can I. It arrived the way confidence usually does, one shipped feature at a time, until one morning the old question simply wasn't there anymore.

If instead you are discovering Neuron today, Welcome. You are arriving at a good moment. The ground has been tested, the rough edges of the early versions are behind us. You may read the paragraph above and think "really?", and that is a fair reaction. It is also the reason I'm glad you're here. The first developers came because they believed in their instinct. You are coming because the proof now exists, and every one of you who arrives at this stage tells me the trajectory is real, that this is no longer a bet a few of us made, but a road more and more developers are going to walk. Build something, ask when you get stuck, and if it works for you, tell the next person.

Neuron 4 is live today. Before I get into what changed, I want to spend a few paragraphs on how we got here, because the technical decisions only make sense inside that story.

## Our Official Channels

Follow the Neuron channels to stay up to date:

- [Newsletter](https://neuron-ai.dev/)
- [LinkedIn](https://www.linkedin.com/company/neuron-ai-php-framework)
- [NeuronHub](https://neuronhub.dev/)
- [X](https://x.com/neuronai_php)
- [Instagram](https://www.instagram.com/neuronai_php_adk/)

## What is Neuron AI

If you are hearing about Neuron AI for the first time, Neuron is the first agentic framework of the PHP ecosystem. It lets developers build full-featured AI agents and agentic applications with the language and the stack they already work with. An agent is a plain PHP class where you choose the model provider (OpenAI, Anthropic, Gemini, or local models through Ollama), write its instructions, and attach the tools it can use to act on your application. When you need more, the same framework gives you RAG on your own documents, structured output mapped onto your PHP classes, tools from any MCP server, and Workflows that can pause and wait for human approval before continuing. It installs with Composer in any PHP project, whether it runs on Laravel, Symfony, WordPress or no framework at all. Neuron has more than a million downloads on Packagist, and 2.1k stars on GitHub.

[Neuron AI Repository](https://github.com/neuron-core/neuron-ai)

## The next step

I don't pretend to know about where software is going, no one knows, but I can share with you the next step we see in front of us. We believe the PHP ecosystem can become the best place to build what we call **agentic-native applications**. Not traditional web applications with an AI interaction bolted on the side, but applications where the agent is the architecture. Where the reasoning loop, agent capabilities, memory, and the human checkpoints are the shape of the software itself.

V3 was our first real test of that idea. When we shipped the Workflow as the foundational architecture, it felt like an all-in bet. We had studied other ecosystems, listened to your experiences, and made a design choice that nobody else had made, not only in the PHP space. As far as I know, it is something unique, even compared to other technology ecosystems. If it was wrong, we would have known quickly.

What came back was better than anything I could have ever imagined. Developers built products beyond what I expected, and they did it by starting with the simple "[Start With One Prompt](https://docs.neuron-ai.dev/overview/getting-started#start-with-one-prompt)" guide, while still finding room to grow when their product demanded more. That combination, easy to start and no ceiling to hit, was the whole point of the bet. Companies moved agents into production, consultants closed deals they used to pass on, and **the gap with other ecosystems stopped being the first thing people asked me about**. As a framework maintainer, that is the best answer I could have received. Neuron 4 is the moment where we stop proving and start building on solid ground.

## Who I am talking to

I have talked with a lot of you since V3, and three kinds of conversations keep coming back.

The first is with the developers who have 10+ years of PHP behind them and has been quietly wondering whether those years are about to be declared obsolete. They are not. The skills you have are the skills this work requires, and the products shipped on V3 are the proof that the ground you are standing on is solid and safe.

The second is with the consultant who used to build AI projects for someone else because before Neuron saying yes meant learning a second stack (Python, Typescript) under a client's deadline. Today they say yes, but they build it in the stack their team already masters, and they close new deals at a faster pace.

The third is with the person in charge of signing off on a dependency for a whole team. Their worry is different: adopting an AI framework must not mean maintaining two stacks, retraining everyone for new technologies, or freezing the roadmap every time a major bottleneck arises. V4 is built with that worry in mind. Skills learned building agents in Neuron AI travel with your people across projects and frameworks, so training is done once. And the migration from V3 is a task you hand to a coding agent in an afternoon.

We decided to take a step further in helping you start your team on Neuron. **A kickstart training session for your team: [https://www.neuron-ai.dev/kickstart](https://www.neuron-ai.dev/kickstart)**

PHP itself deserves a large share of the credit for where we are. I have been a professional PHP developer since 2011, and I still started Neuron with serious doubts about whether we could match what had been done in Python. I was subject to the same bias as everyone else. Working at the level of a framework engine gives you the chance to see the language from a different perspective. When you build high-level applications you may not fully notice it, but when you work on systemic architectures you appreciate the low-level capabilities and the robustness of modern PHP, which keeps improving with every release. PHP is, and always was, one of the best environments for building software products. I'm more confident in its future today than I was eighteen months ago.

## What is inside Neuron AI v4

Now the juicy part. What's new in this version?

### A reengineered component architecture

The internal Workflow engine was rebuilt from the ground up to simplify the public API. V3 exposed too much of the machinery needed to control an execution. It worked, but it made developers feel a complexity that a better framework design can remove. In V4, running an agent, handling a tool approval, and resuming it are short, readable operations.

Chat history has undergone a major refactor to achieve two goals:

- Separate the message store from the history and context window management
- Making Neuron integration in your application easier

`ChatHisotryInterface` was removed. The new public APIs are backed by the new `MessageStoreInterface`. As the name says, the message store is responsible only for storing your messages in a persistence layer. It marks messages that fall out of the context window as archived instead of deleting them, so the model sees a trimmed thread while your storage keeps the full history.

### Performance

Streaming is faster and more reliable, and if your application depends on it you should upgrade as soon as you can. We conducted an extensive review of the internal streaming flow to remove every source of performance degradation, and several bugs and bottlenecks in the streaming system were fixed along the way. I also removed Guzzle as a dependency. The new deault HTTP client is a low level implementation using the PHP `ext-curl` that maximize perormance.

### UI protocols

UI protocols integration was extended to support the rendering of custom events and human-in-the-loop automatically.

We believe the frontend integration is critical for the ecosystem to connect agentic entities to the user interface as easily as possible. Neuron AI already provides the best-in-class support for frontend communication protocols. However, certain architectural limitations in v3 make the full implementation of some aspects of these protocols difficult.

The frontend community is expanding rapidly, and user experience cannot stay in the background when you build a real product. In V4 the streaming adapter system moves out of the Agent and becomes part of the underlying Workflow component, which is what gives adapters like AG-UI and Vercel AI, access to the full execution lifecycle of the framework, including approval events, interruptions, and errors.

[Generative UI](https://github.com/neuron-core/generative-ui-demo) [Demo](https://github.com/neuron-core/generative-ui-demo)

### Streaming Channels

Your agent can run in a background worker and still stream its response to the browser in real time.

As Agents become more interactive and capable, developers are increasingly forced to run them outside the HTTP request lifecycle because of its timeout limits, which leaves the streamed output with no way to reach the UI. V4 introduces Streaming Channels, a component to deliver the streamed output of the Agent to the user interface through external real-time streaming systems such as Pusher, websockets, a Redis queue, or whatever your application already uses. Backed by its own interface, customizable and extendable.

[Documentation](https://docs.neuron-ai.dev/agent/streaming#streaming-channels)

### Frontend Tools

Until now a tool was a single thing: a representation of a PHP function the model can ask to run and the backend executes. `FrontendTool` allows you to define tools that will be executed by the frontend of your application. Once completed they will sent back the result to the Agent. Neuron will resume the execution continuing the loop.

Just to give you an idea, this is how backend agents can get access to the browser APIs, or the device capabailities in a mobile app, transparently. `FrontendTool` makes this pattern a first-class concept in Neuron. The model sees it and can call it, but the backend never executes it. When the model calls a frontend tool, the agent suspends the run, hands the pending calls to you, and continues from exactly that point once you submit the results.

**This feature ships with AG-UI and Vercel AI support already built-in.**

### Long-term semantic memory

Your agent can now remember what matters to a person across multiple conversations. Users with multiple active threads can see the agent remember their past conversations and preferences.

V4 introduces the `SemanticMemoryRetrieval` component, which automatically stores and recalls memories across user sessions. It belongs to the RAG agent can be customized or replaced to fit your application logic.

### Observability

Neuron AI now emits its events through a standard PSR-14 event dispatcher, so it connects natively with the dispatcher architecture your application probably already use, whether Symfony, Laravel, or other framework. The PHP-native observer system was deprecated in favor of this interface. More interoperability, more freedom to build.

In the same spirit, Inspector is no longer a dependency of the framework. Inspector is the company that funds this work and pays my salary, and until V3 its monitoring client shipped inside Neuron by default. It doesn't anymore. Observability is a choice you make with the tools you trust.

### Classifier

A classifier has no conversation and no text to stream. The Neuron AI Classifier is has its own contract, ClassifierInterface, for asking closed questions about some input and receiving probabilities back. You can use it to take decision inside your Agents or Workflow like guardrails, prompt injections, score the quality of a response, atc.

[Classifier](/typesafe-ai-and-jev-in-php-model-routing-and-classifier-with-neuron-ai/)

### Upgrading with your coding agent

The repository ships with an `upgrade` directory containing a step by step plan written for your AI coding assistant. It felt right that an agentic framework should be upgraded by an agent.

[Upgrade Guide](https://docs.neuron-ai.dev/overview/upgrade)

## The community

Neuron AI has passed one million downloads on Packagist and 2.1K stars on GitHub. Behind those numbers there are people I want to thank.

Issues and pull requests keep flowing, and many of them strengthen the framework in directions I would never have explored on my own. Someone hits an edge case in production, opens a discussion, and a week later the fix is in the core with tests attached. This is how a framework stops being one person's idea and becomes a shared infrastructure.

Around the core, the ecosystem is growing in ways that make us optimistic. [NeuronHub](https://neuronhub.dev/) launched as a community registry for Neuron extensions. Companies are joining the [Neuron Partner Network](https://www.neuron-ai.dev/partners), which gives the project the long-term support and visibility it needs to be a safe choice for teams planning years ahead, not just months. We hosted our first in-person event, "AI Agents in Action", and I left the room convinced that the most valuable thing we are building is not the framework but the network of people who trust each other enough to share what actually works in production.

I also want to thank the people who write, record, and teach. Every article, every video, every talk at a local meetup lowers the barrier for the next developer who is standing where many of us stood a year ago, unsure whether their skills still had a place in this new landscape. They do. You are proving it.

If you have not contributed yet, there is always room for you. Open a [discussion](https://github.com/neuron-core/neuron-ai/discussions) about the problem you are stuck on. Share what you built, even if it is small. Answer someone else's question. Publish a package on [NeuronHub](https://neuronhub.dev/). Bring your company into the [Partner Network](https://www.neuron-ai.dev/partners). Every one of these is a contribution, and every one of them makes the next person's path a little shorter.

## Moving forward together

Neuron 4 is a big milestone in the road we're on. The engine is durable, the API is simpler, the framework connects to your UI and to your event system with less friction than ever.

I am here to help, in person, in chat, and in code. Feel free to reach me on [LinkedIn](https://www.linkedin.com/in/valeriobarbera/) or [X](https://x.com/Barbalerio).

Always send your feedback to us, good or bad, it's too important to help us build the best agentic framework in the world.

[Official Documentation](https://docs.neuron-ai.dev/)

Valerio
