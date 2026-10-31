---
title: "How to make Inspector work on Laravel Vapor - Verifarma.com case study"
slug: "how-to-make-inspector-work-on-laravel-vapor-verifarma-com-case-study"
section: "inspector"
permalink: "/how-to-make-inspector-work-on-laravel-vapor-verifarma-com-case-study/"
original_url: "https://inspector.dev/how-to-make-inspector-work-on-laravel-vapor-verifarma-com-case-study/"
date: "2020-12-16T10:14:15Z"
updated: "2024-11-07T12:14:32Z"
author: "Valerio Barbera"
category: "Application monitoring"
categories: ["Application monitoring", "Troubleshooting"]
tags: ["Laravel", "PHP", "vapor"]
description: "Implement code execution monitoring in Laravel Vapor. How Verifarma.com built its serverless monitorin system with Inspector."
focus_keyword: "inspector laravel vapor"
seo_title: "How to make Inspector work on Laravel Vapor! Verifarma | Inspector"
featured_image: "../images/how-to-make-inspector-work-on-laravel-vapor-verifarma-com-case-study/featured.jpg"
featured_image_alt: "Laravel Vapor implementation"
wp_id: 2525
---

In this article I'll show you the code implementation to make Inspector work when your [Laravel](/laravel/) application is deployed on the AWS serverless environment using [Vapor](https://vapor.laravel.com/).

The launch of Vapor was a big news for the whole PHP/Laravel ecosystem. It allows developers to deploy Laravel applications on AWS Lambda environment, the **serverless** infrastructure of AWS, without the need to be an expert DevOps, or cloud engineer.

With the aim of eliminating the problem of servers scalability, it brings some complexities that you need to deal with. Serverless execution environment isn't the same of classic server, furthermore it's not so easy to customize if you need some additional configuration.

[Verifarma.com](https://www.verifarma.com) platform is built on top of Laravel and deployed in the AWS serverless platform using Vapor. They are leader and specialist in traceability and product identification, to improve efficiency throughout the distribution chain. The company today, track and trace leaders in the region and with rapidly growth in Europe, present in 23 countries.

They are one of our best customers that monitor Code Execution Flow in their application with Inspector.

Martín Lejman, lead developer in Verifarma, wrote me about two issues using Inspector when the application is deployed through Vapor in AWS Lambda.

1. **"async" transport doesn't work.** Nothing appears in the dashboard, so they should be use "sync" transport, but it's suitable for debugging pourpose not for production environment.
2. **Jobs are not monitored at all.** They doesn't appears in the the processes list regardless of the data transmission method.

Since the beginning Inspector has been appreciated by developers mainly due to its really powerful Laravel package. I'm really gratefull to the community for the support and feedbacks they provided me over time so work with Martin to make Inspector work on Vapor was a really important challenge for me to continue to guarantee a perfect code monitoring experience to all Laravel developers.

## The problem with AWS Lambda

As opposed to a normal LAMP server, AWS Lambda execution environment has default settings that you need to adapt to.

Related to Inspector, after data collection the package sends data packets to the remote API asynchronously using two natives PHP functions behind the scenes (*proc_open*, *proc_close*).

Thanks to these functions Inspector start a process at OS level that will send monitoring data to our API silently in background, with zero impact on your application performance.

AWS Lambda have these two functions disabled by default.

In a normal server environment they can be enabled/disbaled using a **php.ini** property:

```php
disable_functions=exec,passthru,shell_exec,system,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source,proc_open,proc_close
```

It could be for security reasons or something else, anyway in Lambda they seams disabled. Furthermore Vapor currently doesn't provide a way to overwrite this configuration during deployment, so we can't unlock *proc_open*, *proc_close* to be used by the Inspector package.

Martin has also opened a ticket to the Vapor team to give their users this option, but we have no guarantees that it will be implemented.

Since the beginning of its implementation, I designed the Inspector Laravel package trying to decoupling the data collection functionality from how these data should be transferred to our API.

But I had not yet thought about the possibility of using a custom transport implementation injected from outside the package.

## Set a custom transport

I changed the package design to allows developers to inject their custom transport at runtime. In the boot method of your **ApplicationServiceProvider** you can use the code below:

```php
$this->app->inspector->setTransport(function ($configuration) {
    return new MyCustomTransport($configuration);
});
```

The callback will receive an instance of the Inspector "Configuration" class, that contains the Ingestion Key, the URL of our remote API, and all other information needed to build the appropriate HTTP call.

### Verifarma QueueTransport Implementation

Martin and his team thought to implement a transport that simply schedule a job in AWS SQS to send data to the Inspector API and achieve the same behavior of the default "async" transport.

The package ships with an interface **TransportInterface** that you can implement in order to provide a new way of how to send monitoring data to the remote platform.

```php
interface TransportInterface
{
    /**
     * Add an Arrayable entity in the queue.
     *
     * @param \Inspector\Models\Arrayable $entry
     * @return mixed
     */
    public function addEntry(Arrayable $entry);

    /**
     * Send data to Inspector.
     *
     * This method is invoked after your application has sent
     * the response to the client.
     *
     * So this is the right place to perform the data transfer.
     *
     * @return mixed
     */
    public function flush();
}
```

To keep the data sending process "asynchronously", Martin has developed a custom transport that simply schedule a job to send monitoring data in background:

```php
namespace Verifarma\Inspector\Transports;


use Exception;
use Inspector\Transports\AbstractApiTransport;
use Inspector\Transports\TransportInterface;
use Verifarma\Inspector\Jobs\SendInspectorChunkJob;

class QueueTransport extends AbstractApiTransport implements TransportInterface
{
    /**
     * @param string $data
     * @throws Exception
     */
    protected function sendChunk($data)
    {
        dispatch(new SendInspectorChunkJob($this->config, $data));
    }
}
```

**SendInspectorChunkJob** receives the data in its constructor to be sent when the job is scheduled for execution. Here is the implementation of the Job class:

```php
class SendInspectorChunkJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue;

    /**
     * Monitoring Data
     * 
     * @var string
     */
    protected $data;

    /**
     * Inspector configuration.
     * 
     * @var Configuration 
     */
    protected $configuration;

    /**
     * SendInspectorChunkJob constructor.
     *
     * @param Configuration $configuration
     * @param string $data
     */
    public function __construct(Configuration $configuration, string $data)
    {
        $this->data = $data;
        $this->configuration = $configuration;
    }

    /**
     * Use the original CurlTransport.
     * 
     * @param \Inspector\Configuration $configuration
     * @throws \Inspector\Exceptions\InspectorException
     */
    public function handle()
    {
        $transport = new \Inspector\Transports\CurlTransport($this->configuration);

        $transport->sendChunk($this->data);
    }
}
```

The job will be executed asynchronously without forcing your application to wait until Curl has transferred the data.

Finally we need to inform Inspector to use this new transport. In the boot method of the **AppServiceProvider** paste the code below:

```php
$this->app->inspector->setTransport(function ($configuration) {
    return new QueueTransport($configuration);
});
```

The issue with AWS Lambda has been resolved.

## Avoid infinite loop

Before ending the implementation we must inform inspector to ignore the **SendInspectorChunkJob** from the jobs monitored.

This because when the job is executed it will run a new transaction itself that generate another job execution and so on... the infine loop start.

Inspector provides a configuration property where you can specify the job classes that you want exclude from monitoring.

Publish the inspector config file with if you haven't already done, with the command below:

```bash
php artisan vendor:publish --provider="Inspector\Laravel\InspectorServiceProvider"
```

Now you should have the inspector.php file in your config directory.

At the end of this file you should find the "ignore_jobs" property. Add **SendInspectorChunkJob** to the array of jobs to ignore:

```php
    /*
    |--------------------------------------------------------------------------
    | Job classes to ignore
    |--------------------------------------------------------------------------
    |
    | Add at this list the job classes that you don't want monitoring
    | in your Inspector dashboard.
    |
    */

    'ignore_jobs' => [
        \App\Jobs\SendInspectorChunkJob::class,
    ],
```

## The problem with Laravel Vapor

Checking the [vapor-core repository](https://github.com/laravel/vapor-core) it seems that a daemon runs the jobs with the **laravel/vapor-core/src/Queue/VaporWorker.php** worker. It never fires the standard **Queue::looping()** event, which is basically used inside the Inspector package to detect when a Job is picked from the queue.

That's why Jobs aren't monitored at all. We needed to change the package implementation to listen something else. The challenge was to find a strategy compatible with all use cases by default without forcing developers to add custom configuration for every environment.

And we did it. Now Jobs are detected regardless if you use Laravel Vapor or a normal server environment.

We detect the end of the jobs using three events: `JobProcessed`, `JobFailed`or `JobExceptionOcurred`to fire the *flush()* method inside the transport.

I’d like to thank Martin and his team for their commitment to have Inspector as main monitoring system behind their platform.

The lesson I learned is that isn't about a library or a tool, the success of a collaboration is more about people and their passion to build software that leads to real business outcomes.
