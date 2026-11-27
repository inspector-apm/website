---
title: "Storing LLM Context the Laravel Way: EloquentChatHistory in Neuron AI"
slug: "storing-llm-context-the-laravel-way-eloquentchathistory-in-neuron-ai"
section: "neuron-ai"
permalink: "/storing-llm-context-the-laravel-way-eloquentchathistory-in-neuron-ai/"
original_url: "https://inspector.dev/storing-llm-context-the-laravel-way-eloquentchathistory-in-neuron-ai/"
date: "2025-11-04T18:16:31Z"
updated: "2025-11-04T18:16:31Z"
author: "Valerio Barbera"
category: "NeuronAI"
categories: ["NeuronAI", "Product Updates"]
tags: ["Laravel", "PHP", "neuron", "saas", "software development"]
description: "EloquentChatHistory brings native Laravel integration to Neuron AI, storing LLM context as Eloquent models for seamless integration."
focus_keyword: "eloquent"
featured_image: "../images/storing-llm-context-the-laravel-way-eloquentchathistory-in-neuron-ai/featured.jpeg"
wp_id: 9565
---

I've spent the last few weeks working on one of the most important components of [Neuron](https://neuron-ai.dev) the Chat History. Most solutions treat conversation history in AI Agents forcing you to build everything from scratch. When I saw Laravel developers adopting Neuron AI, I realized they deserved better than that.

The current implementation of the ChatHisotry already allows developers to store the agent context on file or in a general SQL table. The new [EloquentChatHistory](https://docs.neuron-ai.dev/the-basics/chat-history-and-memory#eloquentchathisotry) component changes how you manage LLM context in Laravel applications. Instead of fighting with custom storage solutions or maintaining parallel data structures, you now work with conversation history the same way you handle any other data in your application: through Eloquent models.

It could be a starting point for future imporvements, so if you are working on Laravel and you think this integration can be improved feel free to let us know posting on the [repository discussion](https://github.com/neuron-core/neuron-ai). We are glad to receive any feedback. Other Laravel integrations can eventually be bundled into a dedicated integration package.

## Why This Matters for Your Laravel Projects

When you're building AI features into a real application, context management quickly becomes a practical problem. You need to show conversation history in admin panels, filter chats by user or project, run background jobs that reference past interactions, or export data for analytics. With traditional approaches, you're constantly translating between your AI framework's storage format and your application's data layer.

`EloquentChatHistory` want to mitigates or even eliminates that friction. Your chat history lives in your database as a proper Eloquent model, which means it integrates naturally with everything else in your Laravel ecosystem. Need to scope conversations by organization? Use query builders you already know. Building an admin panel with Filament or Nova? Your chat history is just another resource.

```php
namespace App\Neuron;

use App\Models\ChatMessage;
use NeuronAI\Agent;
use NeuronAI\Chat\History\ChatHistoryInterface;
use NeuronAI\Chat\History\EloquentChatHistory;

class MyAgent extends Agent
{
    ...
    
    protected function chatHistory(): ChatHistoryInterface
    {
        return new EloquentChatHistory(
            thread_id: 'THREAD_ID',
            modelClass: ChatMessage::class,
            contextWindow: 50000
        );
    }
}
```

The component works with your existing database structure. You define the Eloquent model, specify which columns map to message roles and content, and Neuron handles the rest. It's a thin adapter that respects how Laravel developers actually work.

## Real Integration, Not Just Storage

Your chat messages become first-class citizens in your application architecture. You can attach them to tickets, orders, or support conversations through standard Eloquent relationships. Background jobs can query relevant context without special handling. Your testing suite can seed and verify conversation flows using factories and assertions you already use for everything else.

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'thread_id', 'role', 'content', 'meta'
    ];
    
    protected $casts = [
        'content' => 'array', 
        'meta' => 'array'
    ];
    
    /**
     * The conversation that owns the chat message.
     *
     * @return BelongsTo<Conversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class, 'thread_id');
    }
}
```

## Starting Point, Not Final Destination

I'm releasing `EloquentChatHistory` as a foundation you can build on. The implementation handles the common case: storing and retrieving messages with proper threading. But your application probably has specific requirements around metadata, search, etc. The component is designed to be extended, not prescribed.

I'm particularly interested in seeing how the community extends this. The [Neuron GitHub repository](https://github.com/neuron-core/neuron-ai) is where improvements and variations can evolve. If you build something useful on top of `EloquentChatHistory` , sharing that helps everyone building AI features in Laravel apps.

## Getting Started

The [documentation](https://docs.neuron-ai.dev/the-basics/chat-history-and-memory#eloquentchathisotry) walks through setup and configuration. You'll need to create a migration for your chat messages table, define your Eloquent model, and configure the field mappings. From there, it's standard Neuron AI workflow.

Create the migration script:

```bash
php artisan make:migration create_chat_messages_table --create=chat_messages
```

The schema below is the basic starting point:

```php
Schema::create('chat_messages', function (Blueprint $table) {
     $table->id();
     $table->string('thread_id')->index();
     $table->string('role');
     $table->json('content');
     $table->json('meta')->nullable();
     $table->timestamps();

     $table->index(['thread_id', 'id']); // For efficient ordering and trimming
});
```

The real test isn't whether EloquentChatHistory covers every edge case perfectly. It's whether it helps you move faster when building AI features in Laravel applications you already maintain. If you've been putting off adding AI capabilities because the integration overhead seemed too high, this might lower that barrier enough to start experimenting.

Try it out, see what works for your use case, and let me know what could be better. The framework improves when people building real applications share what they learn.
