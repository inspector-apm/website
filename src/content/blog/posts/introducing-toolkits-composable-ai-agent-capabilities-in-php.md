---
title: "Introducing Toolkits: Composable AI Agent Capabilities In PHP"
slug: "introducing-toolkits-composable-ai-agent-capabilities-in-php"
section: "neuron-ai"
permalink: "/introducing-toolkits-composable-ai-agent-capabilities-in-php/"
original_url: "https://inspector.dev/introducing-toolkits-composable-ai-agent-capabilities-in-php/"
date: "2025-06-09T15:33:36Z"
updated: "2025-06-13T09:51:36Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Software development"]
tags: ["Laravel", "PHP", "codeigniter", "neuron", "software development", "symfony"]
description: "Neuron PHP toolkits bundle AI agent capabilities into reusable components, enabling PHP developers to add tool sets with single-line code."
focus_keyword: "toolkits"
featured_image: "../images/introducing-toolkits-composable-ai-agent-capabilities-in-php/featured.png"
wp_id: 9224
---

The philosophy behind Neuron's toolkit system emerged from a fundamental observation during AI Agents development: while individual tools provide specific capabilities, real-world AI agents often require coordinated sets of related functionalities. Rather than forcing developers to manually assemble collections of tools for common use cases, Neuron introduces toolkits as an abstraction layer that transforms how we think about agent capability composition.

The traditional approach requires instantiating each tool individually. Imagine you want to build agents that need mathematical reasoning – addition, subtraction, multiplication, division, and exponentiation tools must all be declared separately in the agent's tool configuration. This granular approach quickly becomes unwieldy when agents require comprehensive functionality sets.

Toolkits represent Neuron's solution to this complexity, packaging tools created around the same scope into a single, coherent interface that can be attached to any agent with a single line of code.

Here is an example of the CalculatorToolkit:

```php
namespace NeuronAI\Tools\Toolkits\Calculator;

use NeuronAI\Tools\Toolkits\AbstractToolkit;

class CalculatorToolkit extends AbstractToolkit
{
    public function guidelines(): ?string
    {
        return "This toolkit allows you to perform mathematical operations. You can also use this functions to solve
        mathematical expressions executing smaller operations step by step to calculate the final result.";
    }

    public function provide(): array
    {
        return [
            SumTool::make(),
            SubtractTool::make(),
            MultiplyTool::make(),
            DivideTool::make(),
            ExponentiateTool::make(),
        ];
    }
}
```

The `AbstractToolkit` base class establishes a consistent interface that all toolkits inherit, ensuring predictable behavior across the framework.

The `guidelines()` method provides contextual information that helps the underlying language model understand not just what tools are available, but how they should be used together. In the case of the CalculatorToolkit, the guidelines explicitly suggest that complex mathematical expressions can be solved through step-by-step operations, guiding the agent toward effective problem-solving strategies.

The `provide()` method returns the array of tools included in the toolkit by default. When a toolkit is attached to an agent, the individual tools become available exactly as if they had been added separately, but without the cognitive overhead of managing multiple tool declarations. Here is how you can add it to your agent:

```php
<?php

namesoace App\Neuron;

use NeuronAI\Agent;
use NeuronAI\Tools\Calculator\CalculatorToolkit;

class MyAgent extens Agent
{
    ...
	
    public function tools(): array
    {
        return [
            CalculatorToolkit::make(),
        ];
    }
}
```

This approach maintains consistency with individual tool usage while providing the organizational benefits of grouped functionalities.

If you want to learn from a practical implementation read the article below about creating a Data Analyst Agent with the `MySQLToolkit`:

[Create A Data Analyst Agent In PHP - NeuronAI MySQL Toolkit](/mysql-ai-toolkit-bringing-intelligence-to-your-database-layer-in-php/)

## Exclude Tools

One of the most powerful aspects of Neuron's toolkit system is the selective exclusion capability. During development of complex agents, I've frequently encountered scenarios where a toolkit provides mostly the right functionality but includes tools that could lead to undesired behavior in specific contexts. The `exclude()` method addresses this challenge elegantly, allowing developers to exclude a subset of tools from the toolkit. This becomes particularly useful when working with specialized agents that require limited capabilities, so you can reduce the probability of an agent to make mistakes, and why not reduce tokens consumption.

```php
<?php

namespace App\Neuron;

use NeuronAI\Agent;
use NeuronAI\Tools\Calculator\CalculatorToolkit;
use NeuronAI\Tools\Toolkits\Calculator\DivideTool;
use NeuronAI\Tools\Toolkits\Calculator\ExponentiateTool;
use NeuronAI\Tools\Toolkits\Calculator\MultiplyTool;

class MyAgent extends Agent
{
    ...
	
    public function tools(): array
    {
    	return [
            CalculatorToolkit::make()->exclude([
                DivideTool::class,
                ExponentiateTool::class,
                MultiplyTool::class,
            ]),
        ];
    }
}
```

The exclusion mechanism operates at the class level, using fully qualified class names to identify tools for removal. This selective approach eliminates the need to create custom toolkit variations for every possible combination of required tools.

## Extensibility & Ecosystem Opportunity

From an extensibility perspective, the toolkit system opens remarkable opportunities for community contribution and ecosystem growth. The consistent interface means that third-party developers can create domain-specific toolkits that integrate seamlessly with Neuron's architecture. A developer building agents for financial applications might create a `FinancialToolkit` that includes tools for currency conversion, interest calculation, and risk assessment. Similarly, a WebScrapingToolkit could package HTTP request tools, HTML parsing capabilities, and data extraction utilities into a single, reusable component.

The implications for development velocity are profound. In my experience building production agents with Neuron, the toolkit system reduces the cognitive load of capability management while maintaining the flexibility that professional development demands. Instead of researching and configuring multiple individual tools, developers can leverage pre-built, tested toolkit combinations that represent common functionality patterns. This approach accelerates the initial development phase while providing clear extension points for customization as requirements evolve.

The toolkit architecture also promotes better code organization and maintainability. Related tools naturally cluster together in the same namespace, making it easier to understand an agent's capabilities at a glance. When debugging or extending agent behavior, developers can reason about functionality at the toolkit level before diving into individual tool implementations.

We know that production agents need reliable, well-tested combinations of capabilities rather than just single tools. By providing both the flexibility of individual tools and the convenience of pre-assembled toolkits, Neuron accommodates both rapid prototyping and sophisticated production deployments within a single, coherent architecture.

The future potential of this system extends beyond current implementations. As the Neuron ecosystem grows, community-contributed toolkits could emerge as specialized capability libraries, much like how package ecosystems have evolved in other domains. A marketplace of verified, tested toolkits could dramatically accelerate agent development across industries, with each toolkit representing accumulated expertise in specific problem domains. This is our vision of NeuronAI as a platform for shared AI capability development, positioning PHP developers at the forefront of business-grade AI agent development.

## Resources

If you are getting started with AI Agents, or you simply want to elevate your skills to a new level here is a list of resources to help you go in the right direction:

- **E-Book (Start With AI Agents In PHP)**: [https://www.amazon.com/dp/B0F1YX8KJB](https://www.amazon.com/dp/B0F1YX8KJB)
- **Neuron AI – Agent Development Kit for PHP**: [https://github.com/inspector-apm/neuron-ai](https://github.com/inspector-apm/neuron-ai)
- **Newsletter**: [https://neuron-ai.dev](https://neuron-ai.dev/)
