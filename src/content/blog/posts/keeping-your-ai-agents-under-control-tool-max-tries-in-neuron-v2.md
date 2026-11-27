---
title: "Keeping Your AI Agents Under Control: Tool Max Tries in Neuron V2"
slug: "keeping-your-ai-agents-under-control-tool-max-tries-in-neuron-v2"
section: "neuron-ai"
permalink: "/keeping-your-ai-agents-under-control-tool-max-tries-in-neuron-v2/"
original_url: "https://inspector.dev/keeping-your-ai-agents-under-control-tool-max-tries-in-neuron-v2/"
date: "2025-09-04T16:53:05Z"
updated: "2025-09-04T16:53:06Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Software development"]
tags: ["Laravel", "PHP", "codeigniter", "monitoring", "neuron", "software development", "symfony"]
description: "Neuron V2's Tool Max Tries feature prevents AI agent loops and runaway tool calls in production PHP applications."
focus_keyword: "ai tool"
featured_image: "../images/keeping-your-ai-agents-under-control-tool-max-tries-in-neuron-v2/featured.png"
wp_id: 9384
---

When you're building AI agents in PHP, one question keeps surfacing in production environments: what happens when your agent gets stuck in a loop? Whether it's an external API that's down, an LLM that's having an off day, or a tool that's returning unexpected responses, runaway tool calls can quickly turn a helpful agent into a resource-draining problem.

Neuron V2 introduces [Tool Max Tries](https://docs.neuron-ai.dev/getting-started/tools#max-tries), a straightforward guardrail that puts you back in control of your agent's behavior. This feature sets a hard limit on how many times an agent can invoke any single tool during a conversation, preventing the cascading failures that can occur when AI reasoning goes sideways.

## The Problem: When AI Gets Stuck

Picture this scenario: you've built an agent that helps customers track their orders. It uses a *GetOrderStatus* tool to fetch information from your backend API. Everything works perfectly in testing, but in production, your API occasionally returns a 500 error. Instead of gracefully handling the failure, your agent decides the best course of action is to keep trying the same tool call, over and over.

Without proper constraints, you might see something like this in your logs:

```php
[2024-09-04 10:15:23] Tool call: getOrderStatus(order_id: 12345)
[2024-09-04 10:15:24] API Error: Internal Server Error
[2024-09-04 10:15:25] Tool call: getOrderStatus(order_id: 12345)
[2024-09-04 10:15:26] API Error: Internal Server Error
[2024-09-04 10:15:27] Tool call: getOrderStatus(order_id: 12345)
// ... continues indefinitely
```

This isn't just annoying—it's dangerous. Each failed tool call still consumes tokens, and if you're paying per API call to your LLM provider, those costs add up quickly. More importantly, it creates a terrible user experience as customers wait for responses that never come.

## Simple but Effective Solution

Tool Max Tries addresses this by letting you set a maximum number of attempts for each tool in your agent's toolkit. Here's how you configure it:

```php
try {

    $result = YouTubeAgent::make()
        ->toolMaxTries(5) // Max number of calls for each tool
        ->addTool(
            // It takes precedence over the global setting
            GetOrderStatus::make()->setMaxTries(2)
        )
        ->chat(...);
        
} catch (ToolMaxTriesException $exception) {
    // do something
}
```

By default the limit is 5 calls, and it count for each tool individually. You can customize this value with the `toolMaxTries()` method at agent level, or use `setMaxTries()` on the tool level. Setting max tries on single tool takes precedence over the global setting.

Now when your agent encounters that problematic API, it will attempt the call up to three times before giving up and informing the user that the service is currently unavailable. The conversation continues, but within reasonable bounds.

You can also apply this configuration for tools included in toolkit [using the with method](https://docs.neuron-ai.dev/getting-started/tools#with):

```php
class MyAgent extends Agent
{
    ...
	
    public function tools(): array
    {
    	return [
            MySQLToolkit::make()
                ->with(
                    MySQLSchemaTool::class, 
                    fn (ToolInterface $tool) => $tool->setMaxTries(1)
                ),
        ];
    }
}
```

## Getting Started

Setting up Tool Max Tries is straightforward, and you can configure different limits for different tools based on their risk profiles and expected behavior. A tool that performs simple calculations might never need retries, while one that calls external APIs might benefit from two or three attempts.

The beauty of this approach is that it's opt-in and granular. You can set limits only where you need them, and adjust them based on your actual usage patterns. If you find that five attempts aren't enough for a particular tool, you can increase the limit. If you want to be more aggressive about preventing loops, you can set it to one or two.

The framework handles the operational complexities while letting you focus on solving business problems.

If you want to learn more about how to get started your AI journey in PHP check out the [**learning section in the documentation**](https://docs.neuron-ai.dev/overview/fast-learning-by-video).

## Monitoring & Debugging

Many of the Agents you build with Neuron will contain multiple steps with multiple invocations of LLM calls, tool usage, access to external memories, etc. As these applications get more and more complex, it becomes crucial to be able to inspect what exactly your agent is doing and why.

The Deep Research Agent integrates with [Inspector](/) for comprehensive observability:

```bash
INSPECTOR_INGESTION_KEY=fwe45gtxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

This monitoring reveals the complete execution timeline, showing which agents made decisions, how long each phase took, and where any issues occurred. For multi-agent systems, this visibility proves essential for optimization and debugging.
