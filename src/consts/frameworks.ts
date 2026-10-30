import type { CodeLanguage } from 'astro';

export interface InstallStep {
  title: string;
  text: string;
  code?: string;
  lang?: CodeLanguage;
  caption?: string;
}

export interface Framework {
  slug: string;
  name: string;
  description: string;
  lead: string;
  packageCommand: string;
  monitors: string[];
  steps: InstallStep[];
  guideUrl: string;
  guideLabel: string;
  note?: string;
}

const INGESTION_KEY = 'INSPECTOR_INGESTION_KEY=your-ingestion-key';

export const FRAMEWORKS: Framework[] = [
  {
    slug: 'laravel',
    name: 'Laravel',
    description: 'HTTP requests, queued jobs and Artisan commands.',
    lead: 'Inspector records HTTP requests, queued jobs and Artisan commands, and gives your coding agent the data it needs to fix what goes wrong.',
    packageCommand: 'composer require inspector-apm/inspector-laravel',
    monitors: [
      'HTTP requests',
      'Queued jobs',
      'Artisan commands',
      'Database queries',
      'Errors and exceptions',
    ],
    steps: [
      {
        title: 'Install the package',
        text: 'Add the package with Composer.',
        code: 'composer require inspector-apm/inspector-laravel',
        caption: 'Terminal',
      },
      {
        title: 'Add your ingestion key',
        text: 'Paste the key from your Inspector dashboard into the environment file.',
        code: INGESTION_KEY,
        lang: 'dotenv',
        caption: '.env',
      },
      {
        title: 'Attach the HTTP middleware',
        text: 'Monitor web and API requests. This is the setup for Laravel 11 and later.',
        code: `use \\Inspector\\Laravel\\Middleware\\WebRequestMonitoring;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        // Append the middleware
        $middleware->appendToGroup('web', WebRequestMonitoring::class)
            ->appendToGroup('api', WebRequestMonitoring::class);
    })
    ->create();`,
        lang: 'php',
        caption: 'bootstrap/app.php',
      },
      {
        title: 'Test and deploy',
        text: 'Check your setup. If every check is green, deploy to production.',
        code: 'php artisan inspector:test',
        caption: 'Terminal',
      },
    ],
    guideUrl: 'https://docs.inspector.dev/guides/laravel',
    guideLabel: 'Read the Laravel guide',
    note: 'Works with Laravel Octane, Laravel Vapor and Laravel Nova.',
  },
  {
    slug: 'symfony',
    name: 'Symfony',
    description: 'HTTP requests, background tasks and database queries.',
    lead: 'Inspector records HTTP requests and background tasks with the queries inside them, and gives your coding agent the data it needs to fix what goes wrong.',
    packageCommand: 'composer require inspector-apm/inspector-symfony',
    monitors: [
      'HTTP requests',
      'Background tasks',
      'Database queries',
      'Errors and exceptions',
    ],
    steps: [
      {
        title: 'Install the package',
        text: 'Add the bundle with Composer.',
        code: 'composer require inspector-apm/inspector-symfony',
        caption: 'Terminal',
      },
      {
        title: 'Add your ingestion key',
        text: 'Paste the key from your Inspector dashboard into the environment file.',
        code: INGESTION_KEY,
        lang: 'dotenv',
        caption: '.env',
      },
      {
        title: 'Create the configuration file',
        text: 'Point the bundle at your ingestion key.',
        code: `inspector:
    ingestion_key: '%env(INSPECTOR_INGESTION_KEY)%'`,
        lang: 'yaml',
        caption: 'config/packages/inspector.yaml',
      },
      {
        title: 'Test and deploy',
        text: 'Check your setup. If every check is green, deploy to production.',
        code: 'php bin/console inspector:test',
        caption: 'Terminal',
      },
    ],
    guideUrl: 'https://docs.inspector.dev/guides/symfony/installation',
    guideLabel: 'Read the Symfony guide',
  },
  {
    slug: 'cakephp',
    name: 'CakePHP',
    description: 'HTTP requests, commands, queries and queue jobs.',
    lead: 'Inspector records HTTP requests, console commands and queue jobs with every query inside them, and gives your coding agent the data it needs to fix what goes wrong.',
    packageCommand: 'composer require inspector-apm/cakephp',
    monitors: [
      'HTTP requests',
      'Console commands',
      'Queue jobs, with cakephp/queue',
      'Database queries',
      'Cache operations',
      'View rendering',
      'Outbound HTTP calls',
      'Unhandled exceptions',
    ],
    steps: [
      {
        title: 'Install the plugin',
        text: 'Add the plugin with Composer. It needs PHP 8.2 and CakePHP 5.3 or later.',
        code: 'composer require inspector-apm/cakephp',
        caption: 'Terminal',
      },
      {
        title: 'Add your ingestion key',
        text: 'Paste the key from your Inspector dashboard into the environment file.',
        code: INGESTION_KEY,
        lang: 'dotenv',
        caption: '.env',
      },
      {
        title: 'Enable the plugin',
        text: 'Load the plugin when your application boots.',
        code: `public function bootstrap(): void
{
    parent::bootstrap();

    // ...
    $this->addPlugin('Inspector/Cakephp');
}`,
        lang: 'php',
        caption: 'src/Application.php',
      },
      {
        title: 'Verify and deploy',
        text: 'Check your setup. If every check is green, deploy to production.',
        code: 'bin/cake inspector test',
        caption: 'Terminal',
      },
    ],
    guideUrl: 'https://github.com/inspector-apm/cakephp',
    guideLabel: 'Read the plugin guide',
  },
  {
    slug: 'codeigniter',
    name: 'CodeIgniter',
    description: 'HTTP requests, Spark commands and database queries.',
    lead: 'Inspector records HTTP requests, Spark commands and database queries, and gives your coding agent the data it needs to fix what goes wrong.',
    packageCommand: 'composer require inspector-apm/inspector-codeigniter',
    monitors: [
      'HTTP requests',
      'Spark commands',
      'Database queries',
      'Unhandled exceptions',
    ],
    steps: [
      {
        title: 'Install the package',
        text: 'Add the package with Composer.',
        code: 'composer require inspector-apm/inspector-codeigniter',
        caption: 'Terminal',
      },
      {
        title: 'Publish the configuration',
        text: 'This creates Inspector.php in your app/Config directory.',
        code: 'php spark inspector:install',
        caption: 'Terminal',
      },
      {
        title: 'Add your ingestion key',
        text: 'Paste the key from your Inspector dashboard into the environment file.',
        code: "inspector.ingestionKey = 'your-ingestion-key'",
        lang: 'dotenv',
        caption: '.env',
      },
      {
        title: 'Add the exception handler',
        text: 'Report exceptions to Inspector from the handler method.',
        code: `public function handler(int $statusCode, Throwable $exception): ExceptionHandlerInterface
{
    InspectorExceptionHandler::handle($statusCode, $exception);

    return new ExceptionHandler($this);
}`,
        lang: 'php',
        caption: 'app/Config/Exceptions.php',
      },
      {
        title: 'Monitor HTTP requests',
        text: 'Add the inspector filter to the global filters to monitor every request.',
        code: `public array $globals = [
    'before' => [
        // ...
        'inspector',
    ],
    'after' => [
        // ...
        'inspector',
    ],
];`,
        lang: 'php',
        caption: 'app/Config/Filters.php',
      },
      {
        title: 'Verify and deploy',
        text: 'Check your setup. If every check is green, deploy to production.',
        code: 'php spark inspector:test',
        caption: 'Terminal',
      },
    ],
    guideUrl: 'https://docs.inspector.dev/guides/codeigniter',
    guideLabel: 'Read the CodeIgniter guide',
  },
  {
    slug: 'drupal',
    name: 'Drupal',
    description: 'HTTP traffic, database queries and exceptions.',
    lead: 'The Inspector module reports HTTP traffic, database queries and unhandled exceptions, and gives your coding agent the data it needs to fix what goes wrong.',
    packageCommand: 'composer require drupal/inspector_monitoring',
    monitors: ['HTTP traffic', 'Database queries', 'Unhandled exceptions'],
    steps: [
      {
        title: 'Install the module',
        text: 'Add the module with Composer.',
        code: 'composer require drupal/inspector_monitoring',
        caption: 'Terminal',
      },
      {
        title: 'Add your ingestion key',
        text: 'Go to Admin, Configuration, Development, Inspector Monitoring. Paste the key from your Inspector dashboard and save.',
      },
      {
        title: 'Test and deploy',
        text: 'Browse your site and check that data reaches the dashboard. If it does, release the integration to production.',
      },
    ],
    guideUrl: 'https://docs.inspector.dev/guides/drupal',
    guideLabel: 'Read the Drupal guide',
  },
];

export const NEURON_COMMAND = 'composer require neuron-core/neuron-ai';
