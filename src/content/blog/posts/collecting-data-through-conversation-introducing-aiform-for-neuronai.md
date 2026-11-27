---
title: "Conversational Data Collection: Introducing AIForm"
slug: "collecting-data-through-conversation-introducing-aiform-for-neuronai"
section: "neuron-ai"
permalink: "/collecting-data-through-conversation-introducing-aiform-for-neuronai/"
original_url: "https://inspector.dev/collecting-data-through-conversation-introducing-aiform-for-neuronai/"
date: "2026-04-01T10:36:53Z"
updated: "2026-04-01T11:12:42Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Product Updates", "Software development"]
tags: ["Laravel", "PHP", "codeigniter", "neuron", "software development", "symfony"]
description: "AIForm replaces rigid HTML forms in PHP with multi-turn AI conversations. Define a data class, and let the agent collect information naturally."
focus_keyword: "AI"
featured_image: "../images/collecting-data-through-conversation-introducing-aiform-for-neuronai/featured.png"
wp_id: 9731
---

One of the more interesting things about building an open-source framework is that the community often knows what to build next before you do. When I started Neuron AI, I had a fairly clear picture in my head of the core primitives: agents, tools, workflows, structured output. What I didn't fully anticipate was how quickly developers would start pushing those primitives toward very specific, practical use cases. The feature requests and questions that come through GitHub and the [newsletter](https://neuron-ai.dev) are often the most honest signal I have about where real-world PHP developers are actually trying to go.

Over the past few months, one request kept surfacing in different forms: how do I use Neuron AI to collect information from a user through a conversation instead of a traditional form? The details varied, a registration flow here, a support intake there, a booking assistant somewhere else — but the underlying need was the same. People were trying to build this themselves on top of the agent and workflow components, and it was working, but it required a non-trivial amount of plumbing.

So today I'm releasing [**AIForm**](https://github.com/neuron-core/ai-form), a Neuron AI component that handles exactly this use case.

## What it does

The idea is straightforward. You define the data you want to collect as a plain PHP class using the same `#[SchemaProperty]` attributes you already know from Neuron AI's structured output system. You attach validation rules where needed. Then you extend `AIForm`, wire up a provider, and it's done. The component takes care of the rest: managing the conversation across multiple turns, tracking which fields have been collected, retrying on validation failures, and calling your callback once everything is in order.

```php
class RegistrationData
{
    #[SchemaProperty(description: 'User full name', required: true)]
    #[NotBlank]
    public string $name;

    #[SchemaProperty(description: 'Email address', required: true)]
    #[Email]
    public string $email;

    #[SchemaProperty(description: 'Phone number')]
    public ?string $phone = null;
}
```

```php
class RegistrationForm extends AIForm
{
    protected string $formDataClass = RegistrationData::class;

    protected function provider(): AIProviderInterface
    {
        return new Anthropic(
            key: env('ANTHROPIC_API_KEY'),
            model: env('ANTHROPIC_MODEL'),
        );
    }

    protected function callback(): mixed
    {
        return function (RegistrationData $data) {
            $this->userService->register($data);
        };
    }
}
```

In a controller, you process each incoming message through the form instance and get back a state object telling you the current status, completion percentage, and any missing fields, everything you need to drive the UI.

```php
$form = RegistrationForm::make()
    ->setChatHistory(new FileChatHistory("/tmp/chats/{$sessionId}"));

$handler = $form->process(new UserMessage($request->input('message')));
$state = $handler->run();

return response()->json([
    'status'          => $state->getStatus()->value,
    'message'         => $handler->getLastResponse(),
    'completion'      => $state->getCompletionPercentage(),
    'missing_fields'  => $state->getMissingFields(),
    'is_complete'     => $form->isComplete(),
]);
```

## The confirmation step

Something that came up during the build was the question of what to do once all required data is collected but before the callback fires. In many real flows: registrations, bookings, checkout-adjacent interactions, you want the user to review what was collected and confirm before anything is committed. AIForm handles this with `requireConfirmation()`, which causes the workflow to throw a `FormInterruptRequest` instead of submitting immediately. You can serialize that interrupt into the session, present the AI-generated summary to the user, and then resume the workflow with the user's response. If they confirm, the callback runs. If they want to change something, the form drops back into collection mode.

```php
$form = RegistrationForm::make()->requireConfirmation();

$handler = $form->process(new UserMessage($request->input('message')));
$state = $handler->run();

if ($handler->getInterrupt() instanceof FormInterruptRequest) {
    $_SESSION['form_interrupt'] = serialize($handler->getInterrupt());
    // return the AI-generated summary to the user
}

// on the next request, resume:
$interrupt = unserialize($_SESSION['form_interrupt']);
$handler = $form->process(new UserMessage($request->input('message')), $interrupt);
```

This is built on the same human-in-the-loop interruption mechanism introduced in Neuron AI v2 workflows, so the pattern will feel familiar if you've used that before.

## Why this matters beyond the obvious

The instinct when you first see this is to think of it as a chatbot wrapper around a form. That's a reasonable first impression, but it slightly misses the point. The more interesting aspect is what happens with users who don't fill in forms cleanly: they skip optional fields, mistype emails, answer questions out of order, or abandon the flow halfway through because the interface felt rigid. A conversational flow handles all of this naturally, the AI asks follow-up questions, flags validation failures in plain language, and keeps state across turns without you writing any of that logic yourself.

There's also a less obvious benefit for mobile and voice-adjacent interfaces, where long forms are genuinely painful to use. If your PHP application already has an API layer and a frontend consuming it, plugging AIForm into a controller gives you a conversation endpoint you can connect to any interface, including ones that don't have keyboard input as their primary interaction model.

## Built on the existing stack

AIForm is a Neuron AI workflow under the hood, which means it inherits everything the workflow system already provides. That includes native Inspector integration, if you have `INSPECTOR_INGESTION_KEY` set in your environment, every form conversation will appear in your Inspector dashboard with the full execution timeline. This matters in production when a conversation stalls or a validation loop behaves unexpectedly and you need to understand exactly what happened.

The package is available now on GitHub at `neuron-core/ai-form`. Install it with:

```bash
composer require neuron-ai/ai-form
```

Documentation for the structured output system and workflow components that AIForm builds on is at [docs.neuron-ai.dev](https://docs.neuron-ai.dev). If you build something with it, I'd genuinely like to hear about the use case, the community feedback is what shaped this component in the first place.
