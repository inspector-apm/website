---
title: "Your AI Agent Has Too Many Tools — Here's the Fix"
slug: "your-ai-agent-has-too-many-tools-heres-the-fix"
section: "neuron-ai"
permalink: "/your-ai-agent-has-too-many-tools-heres-the-fix/"
original_url: "https://inspector.dev/your-ai-agent-has-too-many-tools-heres-the-fix/"
date: "2026-05-21T14:07:12Z"
updated: "2026-07-20T13:26:23Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Software development"]
tags: ["Laravel", "PHP", "codeigniter", "monitoring", "neuron", "software development", "symfony"]
description: "ToolSearch is a NeuronAI middleware that lets PHP agents query their tool catalog on demand instead of loading every tool on every request."
focus_keyword: "tool call"
featured_image: "../images/your-ai-agent-has-too-many-tools-heres-the-fix/featured.png"
wp_id: 9778
---

When I started building agents in PHP, the tool list felt like a feature to celebrate. Connect an email toolkit, a calendar, a CRM, a couple of MCP servers, and suddenly your agent can do almost anything. The problem is that "almost anything" comes with a cost that doesn't show up until you put the agent in front of real users, and by then it's already shaping your token bill and your reliability metrics in ways that are hard to trace.

The mechanics are simple enough to describe. Every time the provider is invoked, Neuron AI loads every registered tool and transmits the entire catalog to the backend LLM. Each tool carries its name, description, parameter schema, and usage hints. A handful of tools is harmless. A production agent wired into a real business stack can easily reach hundreds, and at that point you're paying for the full catalog on every turn, regardless of whether the agent actually needs any of those capabilities for the current request.

The token cost is the obvious problem, and it's the one most developers notice first. The less obvious problem is the one that actually breaks agents in production. When a model sees too many tools at once, descriptions blur together, similar-sounding tools start competing for attention, and the agent begins making subtly wrong choices. It mixes up parameters between tools that look alike. It hallucinates arguments because it's trying to hold too many signatures in working memory at the same time. The failure mode isn't a clean error you can catch in a try block, it's an agent that quietly degrades as your toolkit grows, which is exactly the opposite of what you want as you scale.

[ToolSearch](https://docs.neuron-ai.dev/agent/middleware#tool-search) is the new middleware I introduced in NeuronAI to address this. The idea is to stop treating the tool catalog as something the agent carries on every request, and start treating it as something the agent queries on demand. You wrap your full set of tools, your custom tools, your toolkits, the tools exposed by your MCP connectors, inside the `ToolSearchMiddleware`, and you keep your global middleware list minimal. The agent starts each turn with a small, deliberate tool set: usually just `ToolSearch` itself, plus whatever core tools you always want available, like a web search or a calculator.

When the agent needs a capability it doesn't currently have, it calls `ToolSearch` with a natural language query. The middleware returns a ranked list of tool descriptors with their full schemas, inspects the result, looks the tools up in the internal registry, and injects their full definitions into the tools array for the next inference call. From the model's perspective, the next turn simply arrives with a richer tool list, and it can invoke any of those newly surfaced tools directly with proper schema validation, exactly as if they had been there from the start.

You havo no limits on the number of tools you can make available to the agent through search.

In the video below I walk through the middleware setup, show how `ToolSearch` interacts with the global middleware system and the core tool list, and explain the flow that takes a search query and turns it into a fully schema-validated tool call on the following turn. If you're building anything beyond a toy agent in PHP, anything connected to real business systems, real MCP servers, real customer data, this is the piece I'd encourage you to watch before your tool count gets ahead of you.

Check out the YouTube video: **[https://www.youtube.com/watch?v=qYmidHAXEYM](https://www.youtube.com/watch?v=qYmidHAXEYM)**

[Your AI Agent Has Too Many Tools — Here's the Fix (NeuronAI)](https://www.youtube.com/watch?v=qYmidHAXEYM)

## Neuron AI Resources

- Documentation for ToolSearch: [https://docs.neuron-ai.dev/agent/middleware#tool-search](https://docs.neuron-ai.dev/agent/middleware#tool-search)
- Neuron AI Repository: [https://github.com/neuron-core/neuron-ai](https://github.com/neuron-core/neuron-ai)
- Inspector (Observability Tool): [https://inspector.dev](/)

Drop a comment under the video or open a discussion on the repo. And if the project is useful to you, share and star the GitHub repository is the most effective things you can do to help other PHP developers find it.
