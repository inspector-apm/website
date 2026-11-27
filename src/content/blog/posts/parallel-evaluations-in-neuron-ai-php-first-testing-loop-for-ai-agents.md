---
title: "Parallel Evaluations in Neuron AI: PHP First Testing Loop for AI Agents"
slug: "parallel-evaluations-in-neuron-ai-php-first-testing-loop-for-ai-agents"
section: "neuron-ai"
permalink: "/parallel-evaluations-in-neuron-ai-php-first-testing-loop-for-ai-agents/"
original_url: "https://inspector.dev/parallel-evaluations-in-neuron-ai-php-first-testing-loop-for-ai-agents/"
date: "2026-07-31T07:13:33Z"
updated: "2026-07-31T07:18:45Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Product Updates"]
tags: ["Laravel", "PHP", "codeigniter", "neuron", "saas", "software development", "symfony"]
description: "Neuron AI now runs agent evaluations in parallel, forking dataset items into separate processes to cut run time on large datasets. See how to enable it."
focus_keyword: "evaluations"
featured_image: "../images/parallel-evaluations-in-neuron-ai-php-first-testing-loop-for-ai-agents/featured.png"
wp_id: 9902
---

Some of the most useful features in Neuron AI did not come from a roadmap meeting, they came from someone hitting a wall in their own project and opening an issue about it. That is exactly how parallel execution for evaluations was born. A community member filed [issue #485](https://github.com/neuron-core/neuron-ai/issues/485), describing the problem: the evaluation command ran every evaluator, and every dataset item inside it, strictly one after another. On a small dataset that is barely noticeable. On anything realistic, with dozens or hundreds of test cases, it turns into a coffee break every time you want to check whether your agent still behaves the way it should.

Reading that issue felt familiar, because it is the kind of bottleneck you only notice once you start taking evaluations seriously as part of your daily workflow rather than something you run once before a release. So we built parallel execution directly into the evaluation command, and I want to walk you through what it is, why it matters even if you have never run an AI evaluation in your life, and how to start using it today.

## What evaluations actually are, in plain terms

If you have never worked with AI agents before, the word "evaluation" might sound abstract. Think of it as PHPUnit for non-deterministic services. When you write a normal unit test, you know exactly what output to expect from a given input, because the function is deterministic. An AI agent is not deterministic in the same way. Ask it the same question twice and you might get two answers that are both correct but worded differently. So you cannot just assert equality anymore. What you can do is define a dataset of realistic inputs, run your agent against each one, and assert that the output meets some criteria: it contains certain keywords, it stays within a length range, it matches a regex, or it passes judgment from another AI agent acting as a reviewer. That is what the Neuron AI evaluation module does.

This is also where evaluations stop being a developer convenience and start being a business tool. Once an agent is running in front of real customers, someone above you, a product owner, a client, an executive, is going to ask how well it actually works. "It works great" is not an answer that survives a serious conversation, and it is not one you should want to give. A dataset with a passed and failed count, a success rate, and an execution time attached to it is. If you change a prompt, swap a model, or add a new tool to an agent, you can run the same dataset again and point at a number that either went up or down, instead of describing a vague impression from a few manual tests. For a company that has to justify a production agent to a customer, or defend a change during a review, that number is the difference between a technical opinion and a traceable fact. It is the same reason we treat monitoring as a requirement once an agent reaches production rather than an afterthought: numbers you can show are worth more than confidence you can only describe.

## Why sequential execution becomes a real bottleneck

Here is the part that is easy to underestimate until you hit it yourself. An evaluator does not spend its time doing CPU work. It spends almost all of its time waiting for a response from an AI provider, whether that is OpenAI, Anthropic, or anything else you have wired into your agent. A single call might take one or two seconds. That sounds harmless until you multiply it by a hundred dataset items, and then multiply that by every evaluator you have written for every agent in your application. Suddenly a five minute wait becomes normal, and a five minute wait during your CI pipeline, right before a deploy, is the kind of thing that quietly discourages people from running evaluations often enough to matter. The fix is not to make the LLM call faster, because you do not control that. The fix is to stop waiting for one call to finish before starting the next one.

## Getting started with evaluations

If you have not touched the evaluation module yet, here is the minimum setup. Open your project's `composer.json` and register a dedicated namespace for your evaluators, the same way you would set up a `tests` folder for PHPUnit:

```json
"autoload-dev": {
    "psr-4": {
        "App\\Evaluators\\": "evaluators/"
    }
}
```

Create the `evaluators` directory in your project root, then scaffold your first evaluator with the Neuron CLI:

```bash
vendor/bin/neuron make:evaluator App\\Evaluators\\AgentEvaluator
```

This generates a class with three methods that map directly to the mental model I described above: `getDataset()` returns the list of test cases, `run()` executes your agent against one of those cases, and `evaluate()` checks the output against whatever assertion makes sense for your use case, from a simple `StringContains` to an `AgentJudge` that uses a second AI agent to score the response against a custom criteria. Once you have at least one evaluator in place, you run the whole suite with:

```bash
vendor/bin/neuron evaluations --path=evaluators
```

## Turning it on: the concurrency flag

This is where the new feature comes in, and the developer experience is deliberately boring in the best sense of the word. You do not restructure your evaluators, you do not learn a new API, you add one flag:

```bash
vendor/bin/neuron evaluation path/to/evaluators --concurrency=3
```

With `--concurrency=3`, up to three dataset items run at the same time, each one forked into its own PHP process. On a dataset where each item makes a two second LLM call, a hundred items go from roughly two hundred seconds down to roughly sixty six. The math is not magic, it is just Amdahl's law applied to something that was previously wasting all its time on I/O wait instead of doing useful work in parallel.

Two things make this practical rather than a toy. First, it degrades gracefully. Process forking depends on the `pcntl` extension, which exists on Linux and macOS but not on Windows, and on the `spatie/fork` package, which you install as a dev dependency with `composer require --dev spatie/fork`. If either one is missing, the command prints a notice and falls back to running sequentially, so the same command behaves correctly everywhere, it just runs slower where parallelism is not available. Second, the results are unaffected by the change in execution model. Items are evaluated independently, the report keeps the original dataset order, and the final numbers are identical to what you would get from a sequential run.

There are a couple of things worth knowing before you crank the concurrency value up. Each dataset item runs in a forked copy of your evaluator, starting from the state it had right after `setUp()`. That means state is not shared across items: if your evaluator increments a counter or appends to a file as a side effect of processing one item, that change is invisible to the other items running in parallel. If your evaluator logic depends on accumulating state across the dataset, keep it sequential. The other detail is about what `run()` returns. That value has to cross a process boundary through PHP's `serialize()`, so if it contains something like a closure or an open database connection, the assertion results are still preserved correctly, but the output shown in the report gets replaced with a placeholder string instead of the real value.

On choosing a number for `--concurrency`, treat it as a dial connected to your AI provider's rate limits, not to your CPU core count. Every item in flight is an active request against that provider. Start around three to five, and only push higher if you are not seeing rate limit errors show up as test failures. If you do see them, that is your signal to lower it, not a sign that something is broken.

## Why this matters beyond the runtime savings

The real value here is not the sixty six seconds instead of two hundred. It is what a faster feedback loop does to your habits. An evaluation suite that takes five minutes gets run before a big release. An evaluation suite that takes one minute gets run every time you touch a prompt, a tool definition, or a model choice, which is exactly when you need it most. As far as I know, this is the first evaluation tool of its kind built directly into a production PHP agent framework, with a CLI, a dataset abstraction, built-in assertions, and now parallel execution, all without asking you to leave PHP or bolt on a Python side project just to test the AI part of your application. Evaluations stop being a chore you postpone and start being part of the loop you run, which is the only way they actually get used in a real projects.
