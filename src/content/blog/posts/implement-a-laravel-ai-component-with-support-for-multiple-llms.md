---
title: "Implementing a Laravel AI component with support for multiple LLMs"
slug: "implement-a-laravel-ai-component-with-support-for-multiple-llms"
section: "inspector"
permalink: "/implement-a-laravel-ai-component-with-support-for-multiple-llms/"
original_url: "https://inspector.dev/implement-a-laravel-ai-component-with-support-for-multiple-llms/"
date: "2024-08-24T15:39:36Z"
updated: "2024-11-07T12:06:12Z"
author: "Valerio Barbera"
category: "Components"
categories: ["Components", "SaaS", "Software development"]
tags: ["Laravel", "PHP", "software development"]
description: "How to implement a Laravel AI integration for OpenAI, Anthropic etc. Learn how to structure your code to create a new Laravel AI service."
focus_keyword: "Laravel AI"
featured_image: "../images/implement-a-laravel-ai-component-with-support-for-multiple-llms/featured.jpeg"
wp_id: 6989
---

In this article I’ll show you my implementation of a Laravel AI component that powers the integration between Inspector and LLMs providers.

As many product owners today I’m experimenting a lot with AI too. Inspector is an utility tool for developers and I think it is in a great position to implement a specialized AI agent to help developers create better software products quickly, and with even less effort.

I spent a couple of months experimenting with several AI models and one thing was clear to me. They have a lot of constraints, and they constantly evolve. So I realized that I didn’t have to rely on a single provider. I need to implement a component where I can easily change the underlying AI model to be able to switch to a better LLM without refactoring the code implementation, just changing a simple configuration file.

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.

## Inspector Laravel AI agents

At this stage we are running two AI agents:

### AI Analysis

The Inspector AI agent is able to analyze the monitoring data for you, and suggest code changes that you can implement to make your application more reliable and performant. At the end of the day it’s an assistant that helps you create a better experience for your customers.

### AI Bug Fix

The AI Bug Fixer comes into play when your application fires an unhandled exception. The agent will use the gathered information to generate a solution starting from your original source code that may fix the error immediately.

You will receive the first bug fix solution without having to ask your collaborators for time, or wait to be in front of the desk to analyze the problem manually.

To make AI Bug Fixer works you should first connect Inspector to your source control provider. We support GitHub and GitLab repositories.

Check out the [**documentation**](https://docs.inspector.dev/concepts/ai-bug-fixer) for more details.

## Laravel AI component

Laravel has a perfect architecture to build such a flexible system.

The goal is to implement a service like other Laravel built-in services like Session, Log, or Cache. Take the Cache service as an example. Basically the Cache class provides a unified interface with methods like “*get*” and “*put*”, but the underlying technology that powers your cache system could be Redis, Memcached, a SQL database, etc. You can changethe value of the environment variable *CACHE_DRIVER* to switch from one technology to another. The rest of your application doesn’t need to change.

This is exactly the developer experience I need to interact with LLM providers.

### Laravel AI Interface

I usually put all these additional components I build into a dedicated namespace of my project. A directory called “*App\\Extensions*”. I created a new directory “**App\\Extensions\\AI**”.

The first thing to do is define the common interface of the AI service. This is how I started:

```php title="App\Extensions\AI\Contracts\AIInterface"
namespace App\Extensions\AI\Contracts;

interface AIInterface
{
    /**
     * Set predefined instructions to the LLM.
     *
     * @param string $prompt
     * @return AIInterface
     */
    public function system(string $prompt): AIInterface;

    /**
     * Send a prompt to the AI agent.
     *
     * @param array|string $prompt
     * @return string
     */
    public function chat(array|string $prompt): string;
}
```

Basically I want to chat with the LLM and eventually set up a system prompt. The **chat** method gets a message or an array of messages and returns the AI response as a string. I can eventually add the *embedding* method etc. to support all the common features of LLMs.

### Laravel AI configuration file

We also need the basic configuration file to store the API key and other parameters for each driver.

```php title="app/Extensions/AI/config/ai.php"
return [
    'default' => env('AI_DRIVER', 'log'),

    'drivers' => [
        'log' => [
            'channel' => 'daily',
        ],
    ],
];
```

### Laravel Manager class

At the center of these components there is an internal Laravel class called “Manager”. It provides the feature to instance the appropriate driver class based on the configuration file of the component and the ability to switch from a driver to another on the fly.

If you want to go deeper into these framework features I suggest to read the article below:

[https://inspector.dev/how-to-extend-laravel-with-driver-based-services/](/how-to-extend-laravel-with-driver-based-services/)

The first lines of code to get started with the AIManager class is by implementing the **getDefaultDriver()** method.

```php title="App\Extensions\AI\AIManager"
namespace App\Extensions\AI;

use App\Extensions\AI\Contracts\AIInterface;
use App\Extensions\AI\Drivers\Anthropic;
use App\Extensions\AI\Drivers\Log;
use App\Extensions\AI\Drivers\Mistral;
use App\Extensions\AI\Drivers\OpenAI;
use Illuminate\Support\Manager;

class AIManager extends Manager
{
    /**
     * Get the default driver name.
     *
     * @return string
     */
    public function getDefaultDriver()
    {
        return $this->config->get('ai.default');
    }
}
```

Now I want to bind it into the container so I can provide an instance in any part of the application. So I created the AIServiceProvider for this extension:

```php title="App\Extensions\AI\AIServiceProvider"
namespace App\Extensions\AI;

use Illuminate\Support\ServiceProvider;

class AIServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
		// Include the configuration file under the "ai" prefix
        $this->mergeConfigFrom(__DIR__ . '/config/ai.php', 'ai');

		// Bind the AIManager instance into the application container
        $this->app->singleton('ai', function ($app) {
            return new AIManager($app);
        });
    }
}
```

and register this service provider into the config/app.php configuration file:

```php title="config/app.php"
/*
|--------------------------------------------------------------------------
| Autoloaded Service Providers
|--------------------------------------------------------------------------
|
| The service providers listed here will be automatically loaded on the
| request to your application. Feel free to add your own services to
| this array to grant expanded functionality to your applications.
|
*/

'providers' => [
    ...,
	
    App\Extensions\AI\AIServiceProvider::class,
],
```

I also added a Laravel Facade to be able to get an instance of the **AI** service without explicitly call the application container. It’s just to write clean code.

```php title="App\Extensions\AI\Facade\AI"
namespace App\Extensions\AI\Facades;

use App\Extensions\AI\Contracts\AIInterface;
use Illuminate\Support\Facades\Facade;

/**
 * @method AIInterface system(string $prompt);
 * @method string ask($prompt);
 * @method static int contextWindow()
 * @method static int maxTokens()
 */
class AI extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'ai';
    }
}
```

## Implement the first Laravel AI driver

Implementing a driver in this extension is practically the same process to create a custom Laravel cache driver for example. We have to create the driver class and register it with the Laravel AI component manager.

## Create the OpenAI driver

An AI driver is a class that implements the AIInterface with the specific instruction to interact with a specific LLM provider. Let’s create the OpenAI driver:

```php title="App\Extensions\AI\Drivers\OpenAI"
namespace App\Extensions\AI\Drivers;

use App\Extensions\AI\Contracts\AIInterface;
use Illuminate\Support\Facades\Http;

class OpenAI implements AIInterface
{
    /**
     * System instructions.
     * https://platform.openai.com/docs/api-reference/chat/create
     *
     * @var string
     */
    protected string $system;

	/**
	 * The OpenAI constructor.
	 */
    public function __construct(
        protected string $key,
        protected string $model,
        protected int $context_window,
        protected int $max_tokens,
    )
    {
        Http::macro('openAI', function () use ($key) {
            return Http::withToken($key)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->baseUrl('https://api.openai.com/v1');
        });
    }

    public function system(string $prompt): AIInterface
    {
        $this->system = $prompt;
        return $this;
    }

    public function chat(array|string $prompt): string
    {
        if (is_string($prompt)) {
            $prompt = [['role' => 'user', 'content' => $prompt]];
        }

        if (isset($this->system)) {
            array_unshift($prompt, ['role' => 'system', 'content' => $this->system]);
        }

        $result = Http::openAI()->post('/chat/completions', [
            'model' => $this->model,
            'messages' => $prompt,
        ])->throw()->json();

        return $result['choices'][0]['message']['content'];
    }
}
```

This new driver must be mapped in the **config/ai.php** configuration file too:

```php title="App\Extensions\AI\config\ai.php"
return [
    'default' => env('AI_DRIVER'),

    'drivers' => [
        'openai' => [
            'key' => env('OPEN_AI_KEY'),
            'model' => env('OPEN_AI_MODEL'),
        ],
    ],
],
```

## Register the driver into the AIManager

We have to instruct the AIManager on how to create an instance of the OpenAI driver. Following the conventions already implemented in the Laravel Illuminate\\Support\\Manager class we can just add the **createOpenaiDriver()** method:

```php title="App\Extensions\AI\AIManager"
namespace App\Extensions\AI;

use App\Extensions\AI\Contracts\AIInterface;
use App\Extensions\AI\Drivers\OpenAI;
use Illuminate\Support\Manager;

class AIManager extends Manager
{
    /**
     * Get the default driver name.
     *
     * @return string
     */
    public function getDefaultDriver()
    {
        return $this->config->get('ai.default');
    }

    /**
     * Get the OpenAI driver.
     *
     * @return AIInterface
     */
    public function createOpenaiDriver(): AIInterface
    {
        return new OpenAI(
            ...$this->config->get('ai.drivers.openai')
        );
    }
}
```

As you can see in the snippet above I create an instance of the OpenAI class directly passing the driver configuration array. Note that the constructor arguments have in fact the same name of the configuration parameters.

## How to use the Laravel AI component

We are ready to make the first chat with an LLM through the brand new Laravel AI component. Before using the AI service we must declare what is the default driver we want to use. To do it we can add a new environment variable to make the service know that we want to use the **openai** driver by default:

```bash title=".env"
AIDRIVER=openai
```

To test everything works we can implement a simple controller that receive the prompt and return the AI response:

```php
namespace App\Http;


use App\Http\Controller;
use Illuminate\Http\Request;
use App\Extension\Facade\AI;

class AIController extends Controller
{
    public function chat(Request $request)
    {
        return AI::chat($request->input('prompt'));
    }
}
```

Call this controller via a web route to see the response in your browser: *http://localhost:8080/chat*

## How To Change the LLM provider?

Now suppose that another company releases a more intelligent LLM than ChatGPT at a cheaper price. So you would switch to the new provider.

It only involves the implementation of the new driver class, and a new item into the drivers property of the **ai.php** configuration file. All other places where you use the service inside your application are still unchanged until the AIInterface changes.

Once you have created the new driver class and registered inot the AIManager, you just need to change the environment variable value to make the switch:

```bash title=".env"
AI_DRIVER=anthropic
```

The change in the AIInterface is the only thing that could imply a code refactoring. But in that case too you have the support of the IDE that can apply some changes to the method's signatures throughout your application automatically.

I hope this architecture was a good learning experience, not just for AI interaction but to learn a new point of view on how to structure things to create scalable and maintainable good softwares.

At least this is the way I’m going and it’s working very well for me. Feel free to try my product Inspector if you think a monitoring tool could benefit your business.

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.
