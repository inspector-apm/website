---
title: "How To Create a Drupal Custom Module"
slug: "how-to-create-a-drupal-custom-module"
section: "inspector"
permalink: "/how-to-create-a-drupal-custom-module/"
original_url: "https://inspector.dev/how-to-create-a-drupal-custom-module/"
date: "2025-03-10T05:24:46Z"
updated: "2025-03-18T19:43:26Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: []
excerpt: "Learn how to create a custom Drupal module step by step, from setup to deployment, including file structure, hooks, and testing methods."
featured_image: "../images/how-to-create-a-drupal-custom-module/featured.jpg"
wp_id: 8961
---

**Want to build a custom** [**Drupal**](https://www.drupal.org/) **module but don’t know where to start?** This guide breaks down the entire process step by step - from setting up your development environment to deploying your module. Here’s a quick overview:

- **Why Custom Modules?** They provide tailored functionality when contributed modules don’t meet your needs.
- **What You’ll Need:** PHP, YAML, Drupal APIs, and tools like [Composer](https://getcomposer.org/), [Drush](https://www.drush.org/), and an IDE.
- **Core Steps:**
  1. Set up a directory in `/modules/custom/`.
  2. Create essential files like `.info.yml`, `.module`, `.routing.yml`, and controllers.
  3. Define routes, hooks, and features like custom forms or database operations.
- **Testing & Deployment:** Test using Unit, Kernel, and Functional tests, then enable the module with Drush.

**Quick Comparison: Custom vs. Contributed Modules**

| Feature | Custom Modules | Contributed Modules |
| --- | --- | --- |
| Speed | Matches exact needs fast | May require adjustments |
| Maintenance | Developer responsibility | Community-supported |
| Security | Custom oversight | Community-reviewed |

Start building today, and unlock the full potential of Drupal’s modular system. Let’s dive in!

## Creating Module Files and Folders

To set up a custom Drupal module, you need to follow the correct file structure and naming conventions. Here's a breakdown of the essential steps to organize your module files.

### Module Name and Directory Setup

Your module must have a unique identifier that adheres to Drupal's naming rules. Use lowercase letters and underscores instead of spaces. Place your module's directory under the `/modules/custom/` folder within your Drupal installation.

For example, if you're creating a module called "Hello World", the identifier should be `hello_world`:

```
/modules/custom/hello_world/
```

Organizing custom modules in `/modules/custom/` makes them easier to manage.

### Writing the .info.yml File

The `.info.yml` file is what Drupal uses to recognize and load your module. Create this file in your module's root directory and name it `hello_world.info.yml`. Here's an example of its content:

```yaml
name: Hello World Module
description: Creates a page showing "Hello World"
package: Custom
type: module
core_version_requirement: ^10.3 || ^11
dependencies:
  - drupal:link
  - drupal:views
```

If your module includes a configuration page, you can specify it using the `configure` key:

```yaml
configure: hello_world.settings
```

### Setting Up the .module File

The `.module` file is where you'll write hook implementations and procedural code. Create a file named `hello_world.module` in your module's root directory. Here's a simple example:

```php
<?php

/**
 * @file
 * Contains hello_world.module.
 */

use Drupal\Core\Routing\RouteMatchInterface;

/**
 * Implements hook_help().
 */
function hello_world_help($route_name, RouteMatchInterface $route_match) {
  switch ($route_name) {
    case 'help.page.hello_world':
      return '<p>' . t('A custom module that displays Hello World.') . '</p>';
  }
}
```

### Overview of Required Files

| File | Purpose | Required |
| --- | --- | --- |
| `hello_world.info.yml` | Provides module metadata and dependencies | Yes |
| `hello_world.module` | Contains hook implementations and PHP code | No |
| `hello_world.routing.yml` | Defines routes for your module | No |
| `hello_world.services.yml` | Defines services your module uses | No |

Once your file structure is ready, you can start adding functionality to your module.

## Adding Core Module Functions

### Setting Up Module Routes

To define routes, create a `[module_name].routing.yml` file in your module's root directory. For example, to set up a route for the "Hello World" module, create a `hello_world.routing.yml` file:

```yaml
hello_world.content:
  path: '/hello'
  defaults:
    _controller: '\Drupal\hello_world\Controller\HelloController::content'
    _title: 'Hello World'
  requirements:
    _permission: 'access content'
```

This file maps the URL path (`/hello`) to a controller, specifies the page title, and sets access permissions.

### Building the Controller

Once your routes are defined, create a controller to handle requests. For the "Hello World" module, add a `HelloController.php` file in the `src/Controller/` directory:

```php
<?php

namespace Drupal\hello_world\Controller;

use Drupal\Core\Controller\ControllerBase;

class HelloController extends ControllerBase {
  public function content() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Welcome to your first Drupal module!'),
    ];
  }
}
```

This controller returns a simple markup message as the page content.

### Working with [Drupal](https://www.drupal.org/) Hooks

![Drupal](../images/how-to-create-a-drupal-custom-module/www.drupal.org-efc913f9a705e0a0ed41bd4707a53381-2025-03-10.jpg)

You can enhance your module by using Drupal hooks. Here's an example of a hook to modify a form:

```php
/**
 * Implements hook_form_alter().
 */
function hello_world_form_alter(&$form, \Drupal\Core\Form\FormStateInterface $form_state, $form_id) {
  if ($form_id == 'user_login_form') {
    $form['#title'] = t('Custom Login Form');
    $form['name']['#description'] = t('Enter your username to log in.');
  }
}
```

**Common hooks and their applications:**

| Hook Name | Purpose | Example Use Case |
| --- | --- | --- |
| `hook_form_alter` | Modify forms | Customize login forms |
| `hook_entity_load` | Act on loaded entities | Add custom data |
| `hook_theme` | Define theme templates | Create custom displays |
| `hook_cron` | Execute periodic tasks | Schedule operations |

For custom hooks, document them in a `hello_world.api.php` file. Here's an example:

```php
/**
 * @file
 * Hooks provided by the Hello World module.
 */

/**
 * Allows modules to modify the greeting message.
 *
 * @param string $message
 *   The greeting message to be altered.
 */
function hook_hello_world_message_alter(&$message) {
  $message = t('Good morning, @user!', ['@user' => \Drupal::currentUser()->getDisplayName()]);
}
```

### Clearing Cache and Verifying Routes

After making changes, clear Drupal's cache to apply updates:

```bash
drush cache:rebuild
```

To confirm your routes are registered, visit `/devel/routes` if the Devel module is installed. This provides a list of all available routes in your Drupal site.

## Building Complex Features

Once the core functions of your module are set up, you can expand its functionality by incorporating the advanced features described below.

### Creating Custom Forms

Drupal's Form API allows you to build custom forms. To create one, extend the `FormBase` class and define four essential methods:

```php
namespace Drupal\hello_world\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class CustomForm extends FormBase {
  public function getFormId() {
    return 'hello_world_custom_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Name'),
      '#required' => TRUE,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];

    return $form;
  }

  public function validateForm(array &$form, FormStateInterface $form_state) {
    if (strlen($form_state->getValue('name')) < 3) {
      $form_state->setErrorByName('name', $this->t('Name must be at least 3 characters long.'));
    }
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    \Drupal::messenger()->addMessage($this->t('Form submitted successfully.'));
  }
}
```

### Database Operations

Drupal's Database API offers a safe and consistent way to interact with the database. Here's how to handle common operations:

```php
use Drupal\Core\Database\Database;

// Insert operation
$connection = Database::getConnection();
$connection->insert('your_table')
  ->fields([
    'title' => 'New Entry',
    'created' => time(),
  ])
  ->execute();

// Select operation
$query = $connection->select('your_table', 't')
  ->fields('t', ['id', 'title'])
  ->condition('created', time() - 86400, '>')
  ->orderBy('created', 'DESC')
  ->execute();
```

| Operation Type | Security Consideration | Implementation Method |
| --- | --- | --- |
| Insert/Update | Prevent SQL Injection | Use `->fields()` with placeholders |
| Select | Sanitize Output | Apply `Xss::filter()` where needed |
| Delete | Maintain Data Integrity | Use transaction handling |
| File Operations | Enforce Access Control | Use Drupal's managed file system |

### Module Configuration

To manage module settings, define a configuration schema and create a settings form by extending `ConfigFormBase`:

**Configuration Schema (**`hello_world.settings.yml`**):**

```yaml
hello_world.settings:
  api_key: ''
  enable_feature: false
  max_items: 10
```

**Settings Form:**

```php
namespace Drupal\hello_world\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class SettingsForm extends ConfigFormBase {
  protected function getEditableConfigNames() {
    return ['hello_world.settings'];
  }

  public function getFormId() {
    return 'hello_world_settings';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('hello_world.settings');

    $form['api_key'] = [
      '#type' => 'textfield',
      '#title' => $this->t('API Key'),
      '#default_value' => $config->get('api_key'),
    ];

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('hello_world.settings')
      ->set('api_key', $form_state->getValue('api_key'))
      ->save();

    parent::submitForm($form, $form_state);
  }
}
```

To retrieve configuration values, use:

`$api_key = \Drupal::config('hello_world.settings')->get('api_key');`

These additions bring your module closer to completion, paving the way for testing and deployment.

## Testing and Deployment

### Module Testing Guide

Set up a `tests` folder within your module's directory, including subdirectories for Unit, Kernel, and Functional tests:

```php
modules/custom/hello_world/
  ├── tests/
  │   ├── src/Unit/
  │   ├── src/Kernel/
  │   └── src/Functional/
  └── hello_world.info.yml
```

Here’s an example of a functional test:

```php
namespace Drupal\Tests\hello_world\Functional;

use Drupal\Tests\BrowserTestBase;

class HelloWorldTest extends BrowserTestBase {
  protected $defaultTheme = 'stark';
  protected static $modules = ['hello_world'];

  public function testModuleFunction() {
    $admin_user = $this->drupalCreateUser(['administer site configuration']);
    $this->drupalLogin($admin_user);
    $this->drupalGet('admin/config/hello_world/settings');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->fieldExists('api_key');
  }
}
```

| Test Type | Use Case | Setup Requirements |
| --- | --- | --- |
| Unit | Isolated function testing | Minimal dependencies |
| Kernel | Core system integration | Database connection required |
| Functional | User interface testing | Full Drupal instance |
| FunctionalJavascript | JavaScript functionality | Browser with JS support |

Once your tests run successfully, proceed to install the module.

### Module Installation Steps

Follow these steps to install your module after confirming the tests:

1. **Copy the Module**

   Move your module directory to `modules/custom/` in your Drupal installation.

2. **Enable with Drush**

   Run the following commands:

   ```bash
   drush pm:enable hello_world
   drush cache:rebuild
   ```

3. **Verify Installation**

   Check the Extend page at `admin/modules` to confirm the module is active.

## Conclusion

### Module Creation Steps Review

Building a custom Drupal module requires a structured approach. Start with setting up the necessary files and configurations (like `.info.yml` and `.module`) and implementing the required hooks. Testing at all levels - unit, kernel, and functional - ensures your module works as expected. Stick to Drupal standards to keep your module easy to maintain and scale. Don't forget to include proper documentation, handle errors effectively, and fine-tune performance. These steps lay the groundwork for adding more features down the line.

### Further Development Options

Once you've mastered the basics, consider ways to expand your module's capabilities. You can add features, improve integration with other tools, and focus on [monitoring and scalability](/in-depth-scalable-applications-monitoring/). Drupal's rich API ecosystem offers plenty of opportunities to extend your module's functionality.

For real-time monitoring in production, tools like [Inspector](/) can be invaluable.

Here are a few ideas to enhance your custom module:

| Area of Focus | How to Implement | Why It Matters |
| --- | --- | --- |
| **Integration** | Use built-in APIs or webhooks | Connect to external systems |
| **Monitoring** | Add [Inspector integration](https://docs.inspector.dev/guides/codeigniter/usage) | Spot issues as they happen |
| **Maintenance** | Regular updates and tests | Ensure reliability over time |

As you expand your module, prioritize clean, high-quality code. Drupal's integration features and APIs offer a reliable base for growth. Tools like Inspector can help maintain performance and stability as your module evolves and handles more complex tasks.

## Related Blog Posts

- [Laravel Logging: Setup and Use](/log-channels-in-laravel-setup-and-use/)
- [Ultimate Guide to Symfony Profiler](/ultimate-guide-to-symfony-profiler/)
- [How To Create a Form in Drupal](/how-to-create-a-form-in-drupal/)
