---
title: "5 Common Laravel Exceptions Explained"
slug: "5-common-laravel-exceptions-explained"
section: "inspector"
permalink: "/5-common-laravel-exceptions-explained/"
original_url: "https://inspector.dev/5-common-laravel-exceptions-explained/"
date: "2025-02-04T00:39:00Z"
updated: "2025-02-06T12:04:01Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development", "Troubleshooting", "Tutorials"]
tags: ["Laravel", "PHP", "software development"]
excerpt: "Explore five common Laravel exceptions and learn how to handle them effectively for a more reliable application."
description: "Explore five common Laravel exceptions and learn how to handle them effectively for a more reliable application."
focus_keyword: "Laravel Exceptions"
featured_image: "../images/5-common-laravel-exceptions-explained/featured.jpg"
wp_id: 8613
---

[Laravel](https://laravel.com/) handles errors in a structured way to keep your applications running smoothly. This guide explains **5 common Laravel exceptions** and how to deal with them effectively:

1. **ModelNotFoundException**: Happens when a database record is missing. Use `findOrFail()` carefully and handle it globally in the `Handler` class.
2. **MethodNotAllowedHttpException**: Occurs when the wrong HTTP method is used for a route. Check route definitions and use method spoofing for non-GET/POST methods.
3. **TokenMismatchException**: Caused by missing or expired CSRF tokens. Include `@csrf` in forms and handle session timeouts gracefully.
4. **QueryException**: Database query errors from issues like syntax mistakes or schema mismatches. Use query logging and proper foreign key constraints.
5. **ValidationException**: Triggered when input data fails validation. Use Form Requests for cleaner validation logic and return clear error messages.

### Quick Tips

- Set up global exception handling in `app/Exceptions/Handler.php`.
- Use tools like query logging or [Inspector](/) for real-time error tracking.
- Customize error responses to improve user experience.

These strategies will help you debug faster and make your Laravel application more reliable.

## 1. ModelNotFoundException: Missing Database Records

A `ModelNotFoundException` happens when your application tries to fetch a database record that doesn't exist. This usually occurs when using [Eloquent](https://laravel.com/docs/5.0/eloquent)'s finder methods like `findOrFail()` or `firstOrFail()`.

For example, if you use `findOrFail()` to retrieve a record that isn’t there, Laravel throws a `ModelNotFoundException` with a message like: "No query results for model [App\\Model]."

### Using `find()` vs `findOrFail()`

Here’s a quick comparison of how these methods work:

```php
// Using find() - returns null if the record is missing
$user = User::find($id);
if ($user) {
    $user->update(['name' => 'New name']);
} else {
    return response()->json(['message' => 'User not found'], 404);
}

// Using findOrFail() - throws ModelNotFoundException if missing
try {
    $user = User::findOrFail($id);
    $user->update(['name' => 'New name']);
} catch (ModelNotFoundException $e) {
    return response()->view('errors.not-found', status: 404);
}
```

### How to Handle Missing Records

Here are some practical ways to deal with missing records in Laravel:

- **Global Exception Handling**

You can define a global handler for `ModelNotFoundException` in the `render` method of your `Handler` class. This ensures a consistent response whenever this exception occurs.

```php
public function render($request, Exception $e)
{
    if ($e instanceof ModelNotFoundException) {
        return response()->json([
            'error' => 'Data not found.',
            'status' => 404
        ], 404);
    }
    return parent::render($request, $e);
}
```

- **Proactive Querying**

Before attempting to fetch a record, you can check if it exists using methods like `exists()`:

```php
if (!Product::where('sku', $sku)->exists()) {
    return response()->json([
        'available' => false,
        'message' => 'Product not found in catalog'
    ], 404);
}
```

For more advanced setups, tools like Inspector can monitor your application and alert you when `ModelNotFoundException` is triggered. This can help you spot trends in missing record requests and fine-tune your error handling.

While handling missing records is essential, another common issue in Laravel applications involves dealing with HTTP method mismatches. Let’s dive into that next.

## 2. MethodNotAllowedHttpException: Wrong HTTP Method

The `MethodNotAllowedHttpException` happens when your Laravel app gets an HTTP request using a method that's not allowed by your route definitions. This often pops up when dealing with forms or API endpoints.

### Why HTTP Method Mismatches Happen

When setting up routes in Laravel, you specify which HTTP methods they accept. For example:

```php
Route::post('/submit', [FormController::class, 'store']);
```

If you try to access this route with a GET request, Laravel will throw a `MethodNotAllowedHttpException` with a message like: "GET method not supported. Supported methods: POST."

### Common Issues and Fixes

#### Configuring Form Methods Correctly

Make sure your forms are set up to use the right HTTP method:

```html
<!-- Proper POST form setup -->
<form method="POST" action="/submit">
    @csrf
    <!-- Form fields -->
</form>
```

#### Handling Non-GET/POST Methods in Forms

HTML forms only support GET and POST by default. To use methods like PUT, PATCH, or DELETE, Laravel provides method spoofing:

```html
<form method="POST" action="/users/1">
    @csrf
    @method('DELETE')
    <button type="submit">Delete User</button>
</form>
```

#### Allowing Multiple HTTP Methods

If a route needs to handle more than one HTTP method, Laravel offers the `match()` and `any()` methods:

```php
// Allowing specific HTTP methods
Route::match(['get', 'post'], '/submit', [FormController::class, 'handle']);

// Allowing all HTTP methods
Route::any('/webhook', [WebhookController::class, 'handle']);
```

### Troubleshooting the Exception

If you encounter this issue, start by checking:

- **Route definitions**: Ensure the route's method matches the one used in the form or API request.
- **JavaScript requests**: Verify the HTTP method in tools like `fetch` or `axios`.
- **Method spoofing**: Use the `@method()` directive for PUT, PATCH, or DELETE requests when needed.

Using tools like Inspector can help track HTTP traffic and catch mismatches early.

Next, we'll dive into `ValidationException`, another frequent error tied to form submissions.

## 3. TokenMismatchException: CSRF Token Issues

The `TokenMismatchException` happens when Laravel's CSRF protection detects that the token submitted with a form doesn't match the one stored in the user's session. This is a security feature designed to block cross-site request forgery attacks.

### How CSRF Token Validation Works

Laravel checks CSRF tokens on POST, PUT, PATCH, and DELETE requests. If the token doesn't match, it throws a `TokenMismatchException`. Here are some common causes:

- User sessions have expired.
- The CSRF token is missing or incorrect.
- Multiple browser tabs are open with conflicting tokens.
- Forms are submitted from unapproved sources.

### Ensuring Proper Token Usage

To include the CSRF token in forms, use Laravel's `@csrf` directive:

```php
<form method="POST" action="/submit-form">
    @csrf
    <!-- Form fields -->
    <button type="submit">Submit</button>
</form>
```

For AJAX requests, make sure to add the token in the headers:

```javascript
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;
```

### Dealing with Session Timeouts

Session timeouts often lead to token mismatches. You can adjust the session lifetime in `config/session.php` by changing the `lifetime` value.

### Best Practices for Error Handling

Handle token mismatches gracefully with the following approach:

```php
try {
    // Form processing logic
} catch (TokenMismatchException $e) {
    Log::error('CSRF token mismatch: ' . $e->getMessage());
    return back()
        ->withInput()
        ->with('error', 'Your session has expired. Please try again.');
}
```

To improve security, add rate limits to form endpoints and always use HTTPS for form submissions.

### Debugging Token Mismatches

When troubleshooting token mismatch errors, focus on these areas:

- **Session Settings**: Confirm the session driver and lifetime are configured correctly.
- **Form Setup**: Double-check that CSRF tokens are included in all forms.
- **Middleware**: Ensure the `VerifyCsrfToken` middleware is correctly configured.

Tools like Inspector can help you track HTTP traffic and session issues, making it easier to identify and fix recurring token mismatches.

Now that we've covered CSRF token issues, let's move on to handling database query errors, which present a whole different set of challenges.

## 4. QueryException: Database Query Errors

If you're working with Laravel, database query exceptions are something you'll likely encounter. These errors happen when there's an issue with database operations or the structure of your queries.

### Common Causes and How to Debug Them

QueryExceptions often result from:

- **SQL syntax errors**: Mistyped queries or incorrect table/column names.
- **Constraint violations**: Problems with foreign keys or other database relationships.
- **Schema mismatches**: When your Eloquent models and database tables don’t align.
- **Connection issues**: Incorrect database settings or server unavailability.

### Handling Related Records in [Laravel](https://laravel.com/)

Managing related records in Laravel requires careful planning. Here are two common approaches:

```php
// Dissociate related records before deleting a parent record
public function deleteAuthor($id) {
    $author = Author::find($id);
    $author->books()->update(['author_id' => null]);
    $author->delete();
}

// Set up cascading deletes in migrations
Schema::create('books', function (Blueprint $table) {
    $table->bigInteger('author_id')->unsigned()->nullable();
    $table->foreign('author_id')
          ->references('id')
          ->on('authors')
          ->cascadeOnDelete();
});
```

### Catching Errors and Debugging

To handle database query issues gracefully, you can use error-catching mechanisms:

```php
try {
    DB::table('users')->where('id', 1)->firstOrFail();
} catch (\Illuminate\Database\QueryException $e) {
    Log::error('Database error: ' . $e->getMessage());
    return response()->json(['error' => 'A database error occurred'], 500);
}
```

For debugging, Laravel offers tools like query logging:

```php
DB::enableQueryLog();
// Execute your query
dd(DB::getQueryLog());
```

The `QueryException` object provides detailed information, including error codes, messages, SQL queries, and parameter bindings, making it easier to pinpoint the issue.

### Tips to Avoid Database Errors

Here’s how you can reduce the chances of running into QueryExceptions:

- Use Laravel's **schema builder** and migrations to make structural changes.
- Set up proper **foreign key constraints** in your database.
- Keep an eye on query performance using tools like *Inspector* to catch issues early.

Aligning your database design with your application's logic is crucial for avoiding these errors. Database issues can be disruptive, but Laravel’s tools make it easier to diagnose and fix them. Next, we’ll dive into handling validation errors, which often crop up earlier in the process.

## 5. ValidationException: Form Validation Failures

Validation exceptions in Laravel help ensure that only proper and acceptable data is processed by your application. These exceptions occur when submitted data doesn’t meet the validation rules you’ve defined, preserving both data quality and user input standards.

### Setting Up Validation and Form Requests

Laravel provides two main ways to handle validation. For simpler use cases, you can validate data directly in your controller:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
        'name' => 'required|string|max:255',
        'age' => 'required|numeric|min:18'
    ]);
}
```

For more complex scenarios, you can use Form Request classes to keep your validation logic separate and organized:

```php
class UserRegistrationRequest extends FormRequest
{
    public function rules()
    {
        return [
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'terms' => 'accepted'
        ];
    }
}
```

### Handling Validation Errors

To display validation errors in [Blade](https://laravel.com/docs/11.x/blade) templates, use this snippet:

```php
@if ($errors->any())
    <div class="alert alert-danger">
        @foreach ($errors->all() as $error)
            <p>{{ $error }}</p>
        @endforeach
    </div>
@endif
```

For APIs, you can catch the `ValidationException` and return a structured error response:

```php
try {
    $validated = $request->validate([
        'title' => 'required|max:255',
        'body' => 'required'
    ]);
} catch (ValidationException $e) {
    return response()->json([
        'message' => 'The given data was invalid',
        'errors' => $e->errors()
    ], 422);
}
```

### Tips for Effective Validation

- **Use Form Requests**: They keep your validation logic clean and reusable.
- **Customize Error Messages**: Clear error messages improve user experience.
- **Apply Real-Time Validation**: This enhances usability by providing immediate feedback.
- **Log Validation Failures**: [Monitoring errors](https://docs.inspector.dev/guides/laravel/exception-monitoring) can help you identify recurring issues.

In production, tools like Inspector can help track validation errors and spot patterns, allowing you to address issues before they affect users.

## Conclusion

Handling Laravel exceptions effectively is key to building stable and reliable applications. In this article, we covered five common Laravel exceptions - **ModelNotFoundException**, **MethodNotAllowedHttpException**, **TokenMismatchException**, **QueryException**, and **ValidationException** - along with practical solutions for each.

To improve your application's error handling and overall stability, consider these best practices:

- **Customize Exception Handling**: Use Laravel's `app/Exceptions/Handler.php` file to tailor how your application responds to various exceptions.
- **Use Try-Catch Blocks**: Manage unpredictable inputs or external service responses with strategic try-catch implementation.
- [**Monitor Exceptions in Real-Time**](/laravel/): Adopt tools like Inspector to track and analyze exceptions as they occur, ensuring quick resolutions.

Beyond just preventing crashes, good exception handling protects your application's data and operations. For example, addressing issues like **ModelNotFoundException** or **ValidationException** can significantly improve the user experience.

To take your exception handling to the next level:

- Regularly review your error-handling configurations and make sure error messages are clear and actionable.
- Set up proper logging to capture detailed error information.
- Analyze exception patterns to uncover and address recurring issues.

## Related Blog Posts

- [Spring Boot Error Handling: A Step-by-Step Guide](/spring-boot-error-handling-a-step-by-step-guide/)
- [Error Pattern Recognition in PHP Applications](/error-pattern-recognition-in-php-applications/)
- [Laravel Logging: Channels and Stacks Explained](/laravel-logging-channels-and-stacks-explained/)
- [Laravel Query Profiling: Tools and Techniques](/laravel-query-profiling-tools-and-techniques/)
