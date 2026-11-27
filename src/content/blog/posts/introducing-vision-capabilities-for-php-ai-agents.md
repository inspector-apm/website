---
title: "Introducing Vision Capabilities for PHP AI Agents"
slug: "introducing-vision-capabilities-for-php-ai-agents"
section: "neuron-ai"
permalink: "/introducing-vision-capabilities-for-php-ai-agents/"
original_url: "https://inspector.dev/introducing-vision-capabilities-for-php-ai-agents/"
date: "2025-05-20T12:31:51Z"
updated: "2025-05-20T13:42:49Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Software development"]
tags: ["Laravel", "PHP", "codeigniter", "saas", "software development", "symfony"]
description: "Create your AI Agents in PHP with powerful image analysis capabilities. Neuron AI framework is the toolkit to create full-featured AI Agents."
focus_keyword: "php ai agents"
featured_image: "../images/introducing-vision-capabilities-for-php-ai-agents/featured.png"
wp_id: 9144
---

In the fast-evolving landscape of AI Agents development, PHP developers have often found themselves on the sidelines, watching as Python and JavaScript frameworks dominated this space. The Neuron AI framework has been steadily changing this narrative, bringing powerful Agentic capabilities directly to the PHP ecosystem. Today, we're happy to announce the support for vision capabilities in the Neuron AI framework.

## Breaking New Ground in PHP's AI Agents Development Journey

Before diving into the technical details, let's acknowledge the fundamentals of this release. For too long, PHP developers have had to resort to complex microservices architectures or mix their code in different programming languages to incorporate image understanding into their applications.

With this release, Neuron AI continues its mission of supporting AI Agents development within the PHP ecosystem, allowing developers to leverage the power of computer vision directly within their existing PHP apps.

What sets Neuron apart in this journey is its stand-alone design. While many AI solutions are tightly coupled to specific frameworks, Neuron works seamlessly across the entire PHP ecosystem. This means whether you're building with Laravel, Symfony, or any other framework, you can implement powerful AI vision capabilities without framework-specific constraints or dependencies.

## What's New: Image analysis

This latest release introduces the ability to submit images in your input messages, unlocking the vision capabilities of Large Language Models directly from your PHP code. This feature expansion enables entirely new classes of applications and solutions that were previously cumbersome or impossible to build natively in PHP.

**Image Caption and Question Answering**: Generate accurate descriptions of image content or ask specific questions about elements within images.

**Content Transcription and Analysis**: Extract and process text from images, charts, diagrams, and documents with contextual understanding.

**Object Detection**: Identify objects within images and retrieve their characteristics or bounding box coordinates for further processing or visual highlighting.

## Real-World Applications

The addition of vision capabilities opens up a multitude of practical applications for PHP developers:

### E-commerce and Product Management

Automated Product Cataloging: Process product images to automatically extract features, colors, and attributes.

Visual Search: Allow users to find products by uploading similar images.

Quality Control: Automatically detect defects or inconsistencies in product images.

### Content Management Systems

Intelligent Media Libraries: Automatically generate alt texts and descriptions for uploaded images.

Content Moderation: Filter inappropriate images before they appear on your platform.

Accessibility Improvements: Enhance accessibility by providing detailed descriptions of visual content.

### Document Processing

Automated Form Processing: Extract structured data from uploaded forms and documents.

Receipt and Invoice Scanning: Automate expense tracking and financial record-keeping.

Document Classification: Categorize uploaded documents based on visual content.

### Educational Platforms

Assignment Grading: Process and analyze student-submitted diagrams, charts, or visual work.

Interactive Learning: Create responsive educational tools that can analyze and respond to student-drawn solutions.

### Healthcare Applications

Medical Image Preliminary Analysis: Assist healthcare professionals with initial image review.

Patient Documentation Processing: Extract relevant information from uploaded medical documents.

## The Path Forward: AI Agents Development In PHP

This release is another significant step in our journey to make PHP an AI Agents friendly ecosystem. By supporting image analysis directly into the language that powers over half of the web, we're enabling new intelligent applications to emerge without requiring developers to learn new languages or rebuild their technology stacks.

For those new to AI agent development in PHP, I’ve documented the foundational patterns and progressive implementation approaches in an educational resource that walks through the basic development lifecycle — [Start With AI Agents In PHP](https://www.amazon.it/dp/B0F1YX8KJB)

### Framework Agnostic: A Core Advantage

One of Neuron AI's most important attributes is being framework agnostic. This design decision brings several significant advantages:

**Seamless Integration**: Whether you're working with Laravel, Symfony, WordPress, or any other PHP framework – or even vanilla PHP – Neuron integrates without friction or framework-specific dependencies.

**Broader Community and Ecosystem**: By not being restricted to a single framework, Neuron fosters a larger, more diverse community of developers sharing solutions across framework boundaries.

**Support For Extensive Agentic Solutions**: Developers can build sophisticated AI agents encapsulated in a decoupled module that can be executed with just one line of code, regardless of the underlying framework.

**Immunity to Framework Update Cycles**: Your AI capabilities won't break or require refactoring when your framework releases a major update, eliminating a common source of technical debt.

**Future-Proof Investment**: As frameworks evolve or new ones emerge, your AI implementation remains stable and transferable.

For Laravel, Symfony and other framework focused developers, this means you can implement complex AI vision workflows that will continue to function flawlessly through framework updates and across different projects, regardless of their framework foundation.

## Getting Started

To start using the new vision capabilities in your PHP projects install the latest version of the Neuron AI framework:

```bash
composer require inspector-apm/neuron-ai
```

You have two options to attach images to your messages: as an URL, or encoded in base64.

### Use URLs

```php
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Chat\Messages\Image;

// Ollama only support images encoded in base64
$message = (new UserMessage("Describe this image"))
    ->addImage(new Image(
        image: 'https://url_of/image.jpg', 
        type: Image::TYPE_URL
    ));
    
$response = MyAgent::make()->chat($message);
// This is image shows...
```

### Base64 enconding

```php
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Chat\Messages\Image;

$content = base64_encode(file_get_contents('/image_path.jpg'));

$message = (new UserMessage("Describe this image"))
    ->addImage(new Image(
        image: $content, 
        type: Image::TYPE_BASE64, 
        mediaType: 'image/jpeg'
    ));
    
$response = MyAgent::make()->chat($message);
// This is image shows...
```

## Conclusion

Check out the [documentation](https://docs.neuron-ai.dev/attach-images) for detailed guides and examples.

We're excited to see what the creative PHP community builds with these new capabilities. Whether you're developing e-commerce solutions, content management systems, healthcare applications, or educational platforms, Neuron AI's vision features provide the tools you need to create more intelligent, responsive, and valuable applications.

Join our [community newsletter](https://neuron-ai.dev), or share your projects, ask questions, and connect with other PHP developers in the [community forum](https://github.com/inspector-apm/neuron-ai/discussions).
