---
title: "Not Every Prompt Needs Your Most Expensive Model - LLM Classifier in PHP"
slug: "not-every-prompt-needs-your-most-expensive-model-llm-classifier-in-php"
section: "neuron-ai"
permalink: "/not-every-prompt-needs-your-most-expensive-model-llm-classifier-in-php/"
original_url: "https://inspector.dev/not-every-prompt-needs-your-most-expensive-model-llm-classifier-in-php/"
date: "2026-06-16T17:49:27Z"
updated: "2026-06-16T18:01:34Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI"]
tags: []
description: "A pure-PHP package scores how hard a prompt is before you call a model, so a router sends easy requests to a cheap model and hard ones to your strongest."
focus_keyword: "llm"
featured_image: "../images/not-every-prompt-needs-your-most-expensive-model-llm-classifier-in-php/featured.jpg"
wp_id: 9824
---

When I shipped the Neuron AI [official router package](/routing-inference-calls-between-providers-in-neuron-ai/) a few weeks ago I received the same question from many devs, just worded differently: can it send the hard requests to the strong model and the easy ones to the cheap one? It is the most natural rule to want. It was also the one rule I could not write cleanly, and that bothered me.

The router gives you a clean place to make that decision. You register a few providers, you set a rule, and the agent never knows it is talking to a proxy. But the rule has to return a provider name, and to do that judging the prompt difficulty you first need a definition of "hard" that exists in code. That is the part nobody had. The word was doing a lot of work in conversation and none of it in the editor.

## How people fake difficulty today

If you go looking, the workarounds all have the same shape. Some people route by prompt length, on the theory that longer means harder. In practice a one line question about Italian contract law is short and genuinely hard, while a long pasted log that you want summarised is trivial. Length measures typing, not difficulty.

Others keep a list of keywords and route anything containing "legal", "code", or "calculate" to the premium tier. This works for a week. Then you are maintaining a dictionary forever, it misses every phrasing you did not anticipate, and it has no opinion at all about prompts in a language you did not hard code.

The most honest attempt is to ask an LLM to rate the difficulty of the prompt before you answer it. It even works reasonably well. The problem is that you are now paying for a model call, and waiting for it, in order to decide whether to make a model call. You have added latency and cost to the exact path you were trying to make cheaper. For something that runs on every single request, that is the wrong trade.

## A score that comes from your own models

The new package, `neuron-core/llm-classifier`, takes a different position. It builds a small classifier that reads an incoming prompt and returns a difficulty score between 0 and 1, where 0 means your models find this easy and 1 means they struggle. The important word there is *your*. The score is not a generic guess about what is hard in the abstract. It is learned from the models you actually route between, so it reflects what your lineup finds hard, which is the only thing that matters when you are deciding which of your models should answer.

It runs in pure PHP. The only requirement is `ext-mbstring`. There is no Python sidecar to deploy, no GPU, no inference server sitting next to your app waiting to be restarted at three in the morning. Training happens once, offline. Scoring runs in microseconds, in process, before you ever open a socket to a provider. On every request you get a number, and the number costs you nothing.

```bash
composer require neuron-core/llm-classifier
```

## Two phases, kept strictly apart

The mental model is two activities that happen at very different times, and the package keeps them properly separated.

The first is calibration. This is where you teach the classifier what easy and hard look like for your tasks and your models, and it happens once, offline, from a script or a console command. The output is a single `model.bin` file that you commit alongside your code. When your models improve or your prices change, you re-run calibration with the new lineup and replace the file. Nothing about this lives on the request path.

The second is scoring, and that is the only part that runs in your live application. You load `model.bin` once, ideally on boot or inside your Octane, RoadRunner, or FrankenPHP workers, and then you call it on each request to get the score. Train time and run time never touch each other, which is exactly the property you want when something runs in front of every inference call.

If you are wondering how a few hundred example prompts turn into a number, the short version is that words become numbers first. The package uses a free, downloadable word vector dictionary from fastText, which maps every word to a list of 300 numbers that capture its meaning, so that "buy" and "purchase" land close together while "king" and "carburetor" land far apart. Each prompt is reduced to one averaged fingerprint of those numbers, and that fingerprint is the classifier's only input. You do not touch any of this math directly. You provide prompts, answers, and a way to grade them, and the classifier works out which patterns are hard. The pieces of the dictionary your data actually uses get baked into `model.bin`, so the original fastText file is not needed at runtime.

## Training your first classifier in a couple of minutes

You do not have to assemble your own dataset to see this working, and I would not recommend starting there. The package ships with a ready to use dataset derived from the public RouterBench benchmark, a stratified sample of around 1,845 prompts that already carries a precomputed difficulty label for each one. Because the difficulty is already known, this path needs no model panel, no graders, and no API calls at all. You only need the fastText vectors and a few seconds of CPU.

```bash
# 1) one-time: download the fastText vectors
curl -O https://dl.fbaipublicfiles.com/fasttext/vectors-crawl/cc.en.300.vec.gz
gunzip cc.en.300.vec.gz
mv cc.en.300.vec storage/

# 2) run calibration, which writes storage/model.bin
php script/routerbench.php
```

That is your first model trained. Loading it and scoring a prompt is two lines.

RouterBench records, for \~36k prompts, whether  
each of 11 of the most used LLMs answered correctly RouterBench records, for \~36k prompts, whether  
each of 11 of the most used LLMs answered correctly (models from OpenAI, Anthropic, Mistral, and other common providers). If you use a subset of this models it's already a reliable dataset. We turn that into a ready to use dataset to train your classifier.

. If you use a subset of this models it's already a reliable dataset. We turn that into a ready to use dataset to train your classifier.

```php
use NeuronCore\Classifier\Classifier;

$scorer = Classifier::load('storage/model.bin');
$score  = $scorer->overall($userPrompt); // 0 = easy, 1 = hard
```

`overall()` gives you one number to threshold against. Under the hood it is the maximum across the per-capability scores, not the average, and that choice is deliberate. A prompt that is hard at one thing and trivial at five others should be treated as hard, and an average would quietly water that down.

## Plugging it into the router

This is the part I had been waiting to write. The score on its own is just a number. It becomes useful the moment the router can act on it, and the wiring is small. Here is the explicit version using the router's `CallbackRule`, which makes every step visible.

```php
use NeuronAI\Router\Rules\DifficultyRule;
use NeuronCore\Classifier\Classifier;


class MyAgent extens Agent
{
    protected function provider(): AIProviderInterface
    {
        // Load the classifier ONCE (e.g. on app boot or under a long-lived worker).
        $scorer = Classifier::load('storage/model.bin');

        return RouterProvider::make()
            ->addProvider('mini', new OpenAI(key: 'OPENAI_API_KEY', model: 'gpt-4o-mini'))
            ->addProvider('4o', new OpenAI(key: 'OPENAI_API_KEY', model: 'gpt-4o'))
            ->addProvider('o1', new OpenAI(key: 'OPENAI_API_KEY', model: 'o1'))
            ->setRule(
                (new DifficultyRule($scorer))
                    ->outOfDomain('o1', coverage: 0.4) // unfamiliar prompt → most capable
                    ->easy('mini', maxScore: 0.33)     // overall() < 0.33 → cheap & fast
                    ->medium('4o', maxScore: 0.70)     // overall() < 0.70 → solid all-rounder
                    ->hard('o1')                       // otherwise → most capable
            );
    }
}
```

The router now ships a `DifficultyRule` that wraps exactly this pattern. You give it the loaded classifier and your providers, it performs the coverage guard and the threshold routing for you, and the whole block above collapses into a single rule on the router.

As far as I know this is the first time a prompt difficulty classifier has been wired into a production framework in pure PHP, and it's the part I am quietly pleased about.

## Two knobs, and how to turn them

There are only two things to tune, and you tune them with data rather than intuition. The difficulty cut-offs, the 0.33 and 0.70 above, decide where easy ends and hard begins. The coverage cut-off, the 0.4, decides how unfamiliar a prompt has to be before you stop trusting the score. The way to set them is to log three things for real traffic: the difficulty score, the coverage, and the provider you would have chosen, then adjust until you are happy with the balance. If cheap-model answers start coming back wrong, lower the hard threshold so more requests climb to a stronger model. If out of domain prompts are leaking through to the cheap tier, raise the coverage cut-off. You are not guessing. You are reading your own logs.

## Where this leaves us

For a long time the practical answer to "which model should answer this?" in PHP was either a static choice, or a pile of string matching you maintained by hand. Now there is a measured answer that costs microseconds and comes from your own models, and it drops into a router that was already part of the framework. The same quality where it matters, a smaller bill everywhere else, and no delay at runtime.

The package is `neuron-core/llm-classifier`, it is MIT licensed, and the RouterBench dataset is in the box so you can have a working model before you finish your coffee.

Train your first LLM classifier now: [**https://github.com/neuron-core/llm-classifier**](https://github.com/neuron-core/llm-classifier)
