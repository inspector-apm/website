---
title: "Laravel Livewire: What it is, and how to use it in your web app"
slug: "laravel-livewire-what-it-is-and-how-to-use-it-in-your-web-app"
section: "inspector"
permalink: "/laravel-livewire-what-it-is-and-how-to-use-it-in-your-web-app/"
original_url: "https://inspector.dev/laravel-livewire-what-it-is-and-how-to-use-it-in-your-web-app/"
date: "2024-05-22T13:54:52Z"
updated: "2024-11-07T12:07:20Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Components", "Software development", "Tutorials"]
tags: ["Laravel", "PHP", "software development", "ui", "vuejs"]
description: "Laravel Livewire is a package to add reactivity to your web app UI without using Javascript frameworks. Learn how to use it."
focus_keyword: "Laravel Livewire"
featured_image: "../images/laravel-livewire-what-it-is-and-how-to-use-it-in-your-web-app/featured.png"
wp_id: 6387
---

Livewire is one of the most important projects in the Laravel ecosystem specifically targeted to frontend development. Livewire v3 has been recently released, so let's explore what Livewire is, and what kind of projects fits its architecture.

The peculiarity of Livewire is that it allows the development of a "modern" web application without the need to use dedicated JavaScript frameworks.

With Livewire it is possible to develop [Blade](https://laravel.com/docs/master/blade) components that offer a level of reactivity equal to that offered by **Vue** or **React**, without the need to manage the complexity of a project with a decoupled frontend and backend. You can continue developing your application within the borders of Laravel and Blade templates.

## How Livewire Works

[Livewire](https://laravel-livewire.com/) is a Composer package that you can add to a Laravel project. It must then be activated on each HTML page (or the page, in case you want to create a Single Page Application) using appropriate Blade directives. Livewire components consist of a PHP class and a Blade file that contains the logic of how a specific frontend component works and it must be rendered.

When the browser asks to access a page where Livewire is used, the following happens:

1. The page is rendered with the initial states of the component, like any page created using Blade;
2. When the component UI fires an interaction an AJAX call is made to an appropriate route indicating the Livewire component and the interaction that occurred, plus the status of the component;
3. The data is processed in the PHP part of the component, which performs the new rendering as a result of the interaction and sends it back to the browser;
4. The DOM of the page is changed according to the changes received from the server.

It’s very similar to what Vue and React do, but in this case the reactivity logic to respond to an interaction is managed by the backend and not in the javascript side.

To help you better understand the logic I’ll show you an example of this comparison below.

If you want to learn more about the challenges of building a developers driven company, you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**.

## How to install Laravel Livewire

Livewire installation is absolutely minimal. Install the Composer package in your Laravel project and add the necessary Blade directives to all pages (or to the common layout from which all Blade templates in the project are derived).

```bash
composer require livewire/livewire
```

```html
<html>
<head>
    ...

    @livewireStyles
</head>
<body>
    ...

    @livewireScripts
</body>
</html>
```

## How to create a Laravel Livewire Component

Once the Composer package is installed, a new Artisan **make** sub-command is available to create a new Livewire component. Each component will be made with a PHP class and a Blade view.

It's similar to the [class-based components of Blade](https://laravel.com/docs/master/blade#components).

```bash
php artisan make:livewire SpyInput    
COMPONENT CREATED 🤙

CLASS: app/Http/Livewire/SpyInput.php
VIEW: resources/views/livewire/spy-input.blade.php
```

The component in this example will "spy" what is written in an HTML input field, without the need to write JavaScript code.

We then insert a public property to the component class:

```php title="app/Http/Livewire/SpyInput.php"
<?php
 
namespace App\Livewire;
 
use Livewire\Component;

class SpyInput extends Component
{
    public string $message;

    public function render()
    {
        return view('livewire.spy-input');
    }
}
```

Implement the component view as follows:

```php title="resources/views/livewire/spy-input.blade.php"
<div>
    <label>Type here:</label>
    <input type="text" wire:model="message"/>
    <span>You typed: <span>{{ $message }}</span></span>
</div>
```

And finally put the Livewire component in a blade view:

```html
<html>
<head>
    @livewireStyles
</head>
<body>

    <livewire:spy-input />

    @livewireScripts
</body>
</html>
```

In a normal Blade component all public properties of the component class are visible in the blade template. So in **\<span>{{ $message }}\</span>** the value of the **$message** property will be automatically displayed. In a normal class based component, however, this only happens on the first component rendering. If you type something in the input field nothing changes in the span tag.

In the Livewire component, however, we used the **wire:model=”message”** attribute in the \<input> field. This attribute ensures that the value of the input field is linked to the **$message** property in the PHP class. When you write the new value in the input field it is sent to the server, which updates the value of $message and performs a new render, sending it back to the frontend which, then, updates the text in **\<span>{{ $message }}\</span>**.

By opening the Network tab of the browser's development tools, we will notice that on each key press on the keyboard makes a call to the server on the route below:

```bash
/livewire/message/<COMPONENT-NAME>
```

The response to each call contains the new rendered HTML for the component, which Livewire will insert into the page in place of the old one. Various custom **wire** attributes are available. For example you can execute a public method of the component class when clicking on a button. Here is an example of this biding:

```html
<button wire:click="doSomething">Click Here</button>
```

```php
class SpyInput extends Component
{
    public function doSomething()
    {
        // Your code here…
    }
}
```

where doSomething is a public method of the PHP class of the Livewire component.

## Integration with other Laravel features

The PHP class connected to the component behaves like any other PHP class in a Laravel project. The only difference is that it uses the **mount** method instead of the classic **\_\_construct** class constructor to initialize the public properties of the class.

```php
{{-- Initial assignment of the the $book property in the ShowBook class --}}
<livewire:show-book :book="$book">

class ShowBook extends Component
{
    public $title;
    public $excerpt;

    // "mount" instead of "__constuct"
    public function mount(Book $book = null)
    {
        $this->title = $book->title;
        $this->excerpt = $book->excerpt;
    }
}
```

You can also use the protected property **$rules** to configure the validation restrictions on the data sent from the frontend to the backend. You have to call the **validate()** method to validate the data:

```html
<form wire:submit.prevent="saveBook">
    <input type="text" wire:model="title"/>
    @error('title') <span class="error">{{ $message }}</span> @enderror

    <input type="text" wire:model="excerpt"/>
    @error('excerpt') <span class="error">{{ $message }}</span> @enderror

    <input type="text" wire:model="isbn"/>
    @error('isbn') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save Book</button>
</form>
```

```php
class BookForm extends Component
{
    public $title;
    public $excerpt;
    public $isbn;

    protected $rules = [
        'title' => ['required', 'max:200'],
        'isbn' => ['required', 'unique:books', 'size:17'],
        'excerpt' => 'max:500'
    ];

    public function saveBook()
    {
        $validated = $this->validate($this->rules);

        Book::create($validated);

        return redirect()->to('/books);
    }
}
```

Or you can use PHP Attributes to declare the desired validation rules for a class property:

```php
class BookForm extends Component
{
    #[Validate('required|max:200')]
    public $title;

    #[Validate('required|unique:books|size:17')]
    public $isbn;

    #[Validate('max:500')]
    public $excerpt;

    public function saveBook()
    {
        $this->validate();

        Book::create([
            'title' => $this->title,
            'isbn' => $this->isbn,
            'excerpt' => $this->excerpt,
        ]);

        return redirect()->to('/books);
    }
}
```

In general, each Livewire component behaves in the ways that a Laravel developer expects from a PHP class inside a Laravel project. Thus allowing the creation of reactive web interfaces without the need to separate the development projects between Laravel and Vue/React.
