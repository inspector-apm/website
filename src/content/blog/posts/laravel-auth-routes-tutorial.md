---
title: "Laravel Auth Routes Tutorial"
slug: "laravel-auth-routes-tutorial"
section: "inspector"
permalink: "/laravel-auth-routes-tutorial/"
original_url: "https://inspector.dev/laravel-auth-routes-tutorial/"
date: "2024-05-24T12:54:00Z"
updated: "2024-11-07T12:07:14Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development", "Tutorials"]
tags: ["Laravel", "PHP", "software development"]
description: "Implement routes authentication with Laravel auth and guest middlewares. Logout from other devices without invalidating the current session."
focus_keyword: "laravel auth routes"
featured_image: "../images/laravel-auth-routes-tutorial/featured.jpg"
wp_id: 6396
---

Laravel auth routes is one of the essential features of the Laravel framework. Using middlewares you can implement different authentication strategies and attach them to different parts of your backend.

Laravel offers a complete and flexible authentication system, capable of adapting to various needs and implementations. There are also several external packages to implement additional authentication processes other than what ship with the framework by default.

In this article I show you the implications of the standard authentication system and other auth routes systems I navigated in the last ten years of experience with Laravel.

## Authentication Guards e Providers in Laravel

The logic behind routes authentication in Laravel is based on the implementation of two different objects:

- **Guard**: defines how to determine whether an HTTP request is coming from an authenticated user;
- **Provider**: defines how to retrieve registered users for the application.

You can check out these configurations in the **config/auth.php** configuration file.

```php
/*
|--------------------------------------------------------------------------
| Authentication Guards
|--------------------------------------------------------------------------
|
*/
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
```

```php
/*
|--------------------------------------------------------------------------
| User Providers
|--------------------------------------------------------------------------
|
*/

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => \App\Domains\Organization\Models\User::class,
    ],
],
```

A newly created Laravel application provides a default guard and provider configuration suited to the needs of an application that only delivers web pages and generates the HTML of its pages entirely on the server side.

The default guard is “session” - which uses session cookies to establish whether the request comes from an authenticated user - and the default provider is the “database” that retrieves the registered users information via Eloquent.

If you are not using a traditional relational database to store your users, you can extend Laravel with your own authentication user provider. Here is an example from the official documentation:

```php
<?php
 
namespace App\Providers;
 
use App\Extensions\MongoUserProvider;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
 
class AppServiceProvider extends ServiceProvider
{
    // ...
 
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Auth::provider('mongo', function (Application $app, array $config) {
            // Return an instance of Illuminate\Contracts\Auth\UserProvider...
 
            return new MongoUserProvider($app->make('mongo.connection'));
        });
    }
}
```

Than you can change the default provider in the configuration file:

```php
'providers' => [
    'users' => [
        'driver' => 'mongo',
    ],
],
```

Finally, you must reference this new provider in the guards configuration:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
],
```

There are many situations where the default configuration is not enough. For example, the case in which your application offers RESTful APIs or if it’s the backend of a Single Page Application. In this case, you need to include and configure other authentication services offered by the Laravel ecosystem.

For example, in the case of the API server, you should opt for a token-type guard, which allows you to recognize clients authenticated by a specific token present in the request. Personally I use a Laravel first-party package called [**Passport**](https://laravel.com/docs/master/passport) that implements a complete OAuth server so I can manage authentication for frontend and backend API with the same framework and a very granular logic.

## User eloquent model as authentication provider

It’s not a coincidence that the **App\\Models\\User** class does not directly extend the basic Eloquent Model class, but the **Illuminate\\Foundation\\Auth\\User** class. This allows us to identify it as an appropriate model to be a provider for the users of the application.

```php
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
```

## Check if a session is authenticated

HTTP requests coming from a client that has successfully completed authentication can be spotted at various points in the stack. This allows you to intervene in appropriate ways to prevent certain actions or modify the application behaviors accordingly.

You can perform this check in controllers, views and even routes. Both individual endpoints and grouped routes.

The best way to enforce mandatory authentication on endpoints is using middleware. Laravel provides two built-in middlewares:

- **guest** - for routes accessible from unauthenticated clients;
- **auth** - for routes accessible only by authenticated users;

These middlewares are available as "route-specific" middlewares and can therefore be applied to each route, independently of any other middleware.Navigate to the App\\Http\\Kernel class or in the bootstrap/app.php file inside the “*withMiddleware()*” method.

```php
/**
* The application's route middleware.
*
* These middlewares may be assigned to groups or used individually.
*
* @var array
*/
protected $middlewareAliases = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
	
    ...
];
```

You can use them to control access to your routes:

```php
// The home page is accessible to everyone
Route::get('/', [WebsiteController:class, 'home']);

// Register routes are accessible only to unauthenticated users
Route::get('/register', [RegisterController::class, 'create'])
	->name('register')
	->middleware('guest');

Route::post('/register', [RegisterController::class, 'store'])
	->middleware('guest');

// Dashboard is accessible only to authenticated users
Route::get('/dashboard', [DashboardController::class, 'home'])
	->middleware('auth');
```

## The difference between GUEST and AUTH route middlewares

The "guest" middleware is used to restrict access to certain routes or actions to unauthenticated users only.

*Restrict access to unauthenticated users?*

Yes, in fact as you can see in the snippet above the class associated with the guest middleware is “RedirectIfAuthenticated”.

So guest allows you to make the routes accessible if you are a “free” user, but the moment you authenticate to the website Laravel will redirect you to the “private” section of the application. You can’t navigate “guest routes” if you are authenticated.

In a nutshell, “guest” is useful for the registration page, not in an e-commerce product page :).

The purpose of the auth middleware, however, is not at all ambiguous. It checks if the current Request is authenticated. Otherwise you are redirected to the public section of the application, such as the login page.

## Authentication In Laravel Blade Template

At this point, you may want to change the behavior of some of your application pages to show different content depending on whether it is a visitor or an authenticated user. To do this, we can use the @auth directive:

```php
@auth
    <span>Welcome {{ auth()->user()->name }}</span>
@else
    <a href="{{ route('login') }}">Login</a>
    <a href="{{ route('register') }}">Register</a>
@endauth
```

The **@auth** and **@guest** directives operate like an if statement, thus allowing portions of the view to be rendered if the rendering of the view is requested by an authenticated user or a visitor respectively.

## How to get the authenticated user

Laravel provides you with a built-in service called “**Auth**” that allows you to operate transparently with the underlying user providers and guards.To access the Auth service you can use the Facade **Illuminate\\Support\\Facades\\Auth**, or the helper function **auth()**.

```php
use Illuminate\Support\Facades\Auth;

// Access the authenticated User instance
$name = Auth::user()->name;
$name = auth()->user()->name;

// Check if the current session is authenticated
if (Auth::check()) {
	// User logged in
}
```

## Logout: Terminate an authenticated session in Laravel

In your routes/web.php you should have the logout route:

```php
Route::get('logout', [LoginController::class, 'logout')->middleware('auth');
```

In the *LoginController.php*

```php
public function logout(Request $request) 
{
	Auth::logout();
	return redirect('/login');
}
```

Now, you are able to logout using *yourdomain.com/logout* URL or if you have created a logout button, add href to “/logout”.

The logout method will clear the authentication information in the user's session.

## Logout other devices

Invalidating sessions on other devices Laravel also provides a mechanism for invalidating and "logging out" user sessions that are active on other devices without invalidating the session on their current device. This feature is typically used when a user changes or updates their password and you want to invalidate sessions on other devices while maintaining the authenticity of the current device.

To implement this feature Laravel provides a built-in middleware that you should add to the “web” middleware group: *\\Illuminate\\Session\\Middleware\\AuthenticateSession*

```php
'web' => [
    // ...
    \Illuminate\Session\Middleware\AuthenticateSession::class,
    // ...
],
```

Once the middleware is attached you can use the **logoutOtherDevices()** method on the Auth service.

```php
use Illuminate\Support\Facades\Auth;

public function logoutOtherDevices(Request $request)
{
    $password = $request->input('password');

    if (Hash::check($password, Auth::user()->password)) {
        Auth::logoutOtherDevices($password);
        
        // Optionally, you can regenerate the user's session ID
        $request->session()->regenerate();
        
        return redirect()->back()->with('success', 'Logged out from other devices successfully.');
    }

    return redirect()->back()->withErrors(['password' => 'Invalid password.']);
}
```

After the *logoutOtherDevices* method is executed, the user remains logged in on the current device, but all other sessions associated with that user are terminated. When the user tries to access the application from other devices, they will be required to log in again.After logging out from other devices, you can optionally regenerate the user's session ID using **$request->session()->regenerate()** to further enhance security.

You can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**. I post about building my SaaS product.
