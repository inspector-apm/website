---
title: "Introducing NeuronAI Workflow: The future of agentic PHP applications"
slug: "introducing-neuronai-workflow-the-future-of-agentic-php-applications"
section: "neuron-ai"
permalink: "/introducing-neuronai-workflow-the-future-of-agentic-php-applications/"
original_url: "https://inspector.dev/introducing-neuronai-workflow-the-future-of-agentic-php-applications/"
date: "2025-06-20T13:49:44Z"
updated: "2025-10-27T17:57:04Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Software development"]
tags: ["Laravel", "PHP", "codeigniter", "neuron", "software development", "symfony"]
description: "Discover NeuronAI Workflow component build Agentic applications in PHP with support for human in the loop."
focus_keyword: "neuronai workflow"
featured_image: "../images/introducing-neuronai-workflow-the-future-of-agentic-php-applications/featured.png"
wp_id: 9254
---

Three months ago, when I started building the Workflow component for [NeuronAI](https://docs.neuron-ai.dev/), I knew it would be complex. What I didn't anticipate was that it would become the most technically challenging development of my entire career—alongside Neuron itself.

The core challenge wasn't just about creating another workflow engine. It was about enabling true **human-in-the-loop patterns** while maintaining clean architecture, readable code organization, and building on interoperable components that developers could easily extend and interchange—especially the persistence layer.

Sounds interesting? Support the project starring the GitHub repository: [https://github.com/neuron-core/neuron-ai](https://github.com/neuron-core/neuron-ai)

## What is a Workflow

Think of a Workflow as a smart flowchart that describes how your AI applications should work. Instead of your AI making every decision independently, a Workflow lets you create a step-by-step process where AI handles what it does best, and humans step in when judgment or oversight is needed.

Here's what makes NeuronAI Workflows special: they're built around **interruption and human-in-the-loop capabilities**. This means your agentic system can pause mid-process, ask for human input, wait for feedback, and then continue exactly where it left off – even if that's hours or days later.

Imagine you're building a content moderation system. Instead of having AI make final decisions about borderline content, your Workflow can:

1. Analyze the content using AI
2. Flag anything uncertain
3. Pause and ask a human moderator for review
4. Wait for the human decision
5. Continue processing based on that feedback

The key breakthrough is that **interruption isn't a bug – it's a feature**. Your Workflow remembers exactly where it stopped, what data it was working with, and what question it needs answered.

## Why Use NeuronAI Workflow Instead of Regular Scripts?

You might be thinking: "This sounds great, but why can't I just write a regular PHP script with some if-statements and functions?" It's a fair question, and one I heard a lot while building NeuronAI. The answer becomes clear when you consider what happens when your process needs to pause, wait, and resume exactly where it left off.

Another scenario that is practically impossible to reproduce with a procedural approach is when you need complex workflows with many branches, several loops and intermediate checkpoints, etc. When you are at the beginning of a project and your use case is yet quite simple, it’s not easy to see the real potential of Workflow, and it's normal. Keep in mind that if things hit the fan, NeuronAI already has a solution to help you scale.

## Create a Workflow

A Workflow in NeuronAI is made up of two elements:

**Nodes**, with each node responsible for handling a unit of execution (manipulate data, call an agent, etc.).

**Edges**, responsible to define how the workflow must move from one node to the next. They can be conditional branches or fixed transitions.

*In short: Nodes do the work, Edges tell what to do next.*

As an illustrative example, let's consider a simple workflow with two nodes. The connection (Edge) tells the workflow to go from A to B to C.

```php
<?php

namespace App\Neuron\Workflow;

use App\Neuron\Workflow\InitialNode;
use App\Neuron\Workflow\MiddleNode;
use App\Neuron\Workflow\FinishNode;
use NeuronAI\Workflow\Edge;
use NeuronAI\Workflow\Workflow;

class SimpleWorkflow extends Workflow
{
    public function nodes(): array
    {
        return [
            new InitialNode(),
            new MiddleNode(),
            new FinishNode(),
        ];
    }
    
    public function edges(): array
    {
        return [
            // Tell the workflow to go to MiddleNode after InitialNode
            new Edge(InitialNode::class, MiddleNode::class),
            
            // Tell the workflow to go to FinishNode after MiddleNode
            new Edge(MiddleNode::class, FinishNode::class),
        ];
    }
    
    protected function start(): string
    {
        return InitialNode::class;
    }
    
    protected function end(): array
    {
        return [
            FinishNode::class,
        ];
    }
}
```

![](../images/introducing-neuronai-workflow-the-future-of-agentic-php-applications/workflow-abc.avif)

Learn all this concept in details on the documentation: [https://docs.neuron-ai.dev/workflow/getting-started](https://docs.neuron-ai.dev/workflow/getting-started)

## Understanding Workflow Structure: Nodes and Edges

Before diving into the interruption capabilities, it's important to understand how Workflows are structured. Think of a Workflow as a graph made up of two key components: **nodes** and **edges**.

**Nodes** are where the actual work happens – they're like individual functions or operations in your Workflow. A node might analyze text, make an API call, process data, or request human input. Each node has a specific job and produces some output.

**Edges** are the connections between nodes – they define the flow of your Workflow. But here's where NeuronAI gets interesting: edges aren't just simple arrows pointing from one node to the next. They can be conditional, and make decisions about where to route your data based on conditions, outcomes, or even dynamic logic.

For example, imagine a content moderation Workflow:

- An analysis node examines a piece of content
- Multiple edges lead out from this node: one for "clearly safe content," another for "clearly problematic content," and a third for "needs human review"
- The edge that gets taken depends on the confidence level of the AI analysis

This means your Workflow can automatically branch into different paths based on real-time conditions. An edge might route high-confidence decisions straight to approval, while routing uncertain cases through human review nodes. You can even have edges that loop back to previous nodes, creating iterative processes where content gets refined through multiple rounds of AI analysis and human feedback.

The real power comes from **conditional edges** – connections that evaluate the output of a node and decide which path to take next. This lets you build sophisticated decision trees where the Workflow adapts its behavior based on what it discovers along the way.

## Human In The Loop

NeuronAI Workflows flip this paradigm. Instead of building AI systems that try to be perfect, you build systems that are **intelligently imperfect**. They know their limitations and actively seek help when they need it.

Here's how it works technically:

**Interruption Points**: Any node in your Workflow can request an interruption by specifying what kind of human input it needs. This could be a simple yes/no decision, a content review, data validation, or creative input.

**State Preservation**: When an interruption happens, NeuronAI automatically saves the complete state of your Workflow – all variables, processed data, and context. Your Workflow essentially goes to sleep, waiting for human input.

**Resume Capability**: Once a human provides the requested input, the Workflow wakes up exactly where it left off. No data is lost, no context is forgotten. It's like the AI was never paused at all.

**External Feedback Integration**: The human input becomes part of the Workflow's data, available to all subsequent nodes. This means later steps can make better decisions based on both AI analysis and human judgment.

```php
$persistence = new FilePersistence(__DIR__);
$workflow = new Workflow($persistence, 'test_workflow');

$workflow->addNodes([
        new BeforeInterruptNode(),
        new InterruptNode(),
        new AfterInterruptNode(),
    ])
    ->addEdges([
        new Edge(BeforeInterruptNode::class, InterruptNode::class),
        new Edge(InterruptNode::class, AfterInterruptNode::class)
    ])
    ->setStart(BeforeInterruptNode::class)
    ->setEnd([AfterInterruptNode::class]);

try {
    $workflow->run(new WorkflowState(['value' => 8]));
} catch (WorkflowInterrupt $interrupt) {
    // Catch interruption as a normal exception

    // Verify interrupt signal was saved
    $savedInterrupt = $persistence->load('test_workflow');
    echo "Workflow interrupted at {$savedInterrupt->getCurrentNode()}.";
}

// Resume passing the human feedback
$result = $workflow->resume(['approved' => true]);

echo $result->get('final_value'); 
```

## Beyond One Shot Interactions

Single AI Agents work like this: you give them input, they process it using their tools or external information, and they give you output. That's it. If the AI makes a mistake, you only find out after the fact.

Working on NeuronAI, we've seen developers struggle with this limitation. They'd build sophisticated agents, but couldn't deploy them in high-stakes situations because there was no safety net. No way to verify output before they mattered. No way to inject human feedback when the Agent reached the limits of its abilities.

Traditional approaches to solving this usually involve building separate review systems, complex approval processes, or having humans check everything after the fact. These solutions are clunky, expensive, and often too slow for real-world applications.

From a developer perspective, NeuronAI Workflow solves several painful problems:

**Model and maintain complex iterations**: With these simple building blocks you will be able to create simple processes with a few steps, up to complex workflows with iterative loops and intermediate checkpoints.

**Human in the Loop**: Seamlessly incorporate human oversight. You can deploy AI in sensitive areas because humans are always in the loop for critical decisions.

**Debugging with inspector**: Instead of wondering why your AI made a particular decision, you can see exactly how humans and AI collaborated at each step.

**User Trust**: When users know a human reviewed important decisions, they're more likely to trust and adopt your AI system.

## The Future of AI Development

Creating the NeuronAI Workflow component has convinced me that the future of AI isn't about building systems that never need human help. It's about building systems that know exactly when and how to ask for help.

Instead of trying to replace human judgment, we're amplifying it. Instead of fearing AI mistakes, we're building systems that catch and correct them in real-time.

The most successful AI applications of the next decade won't be the ones that are most autonomous. They'll be the ones that are most collaborative – seamlessly blending artificial intelligence with human wisdom, creativity, and oversight.

NeuronAI Workflows it’s the first step to make this collaboration not just possible, but efficient, all in PHP.

The best part? Your users will trust these systems more because they'll know a human was involved in the important decisions. And you'll sleep better at night knowing your AI can't make critical mistakes without human oversight.

That's the power of building AI systems that know when to ask for help. Build the future of intelligent PHP applications with NeuronAI.

## Resources

If you are getting started with AI Agents, or you simply want to elevate your skills to a new level here is a list of resources to help you go in the right direction:

- **How to create a RAG Agent**: [https://inspector.dev/how-to-create-a-rag-agent-with-neuron-adk-for-php/](/how-to-create-a-rag-agent-with-neuron-adk-for-php/)
- Introducing Toolkits: [Composable AI Agent Capabilities In PHP](/introducing-toolkits-composable-ai-agent-capabilities-in-php/)
- **Newsletter**: [https://neuron-ai.dev](https://neuron-ai.dev/)
- **E-Book (Start With AI Agents In PHP)**: [https://www.amazon.com/dp/B0F1YX8KJB](https://www.amazon.com/dp/B0F1YX8KJB)
