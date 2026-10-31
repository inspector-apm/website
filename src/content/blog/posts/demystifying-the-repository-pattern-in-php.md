---
title: "How and why we implemented the \"Repository Pattern\" in our PHP backend"
slug: "demystifying-the-repository-pattern-in-php"
section: "inspector"
permalink: "/demystifying-the-repository-pattern-in-php/"
original_url: "https://inspector.dev/demystifying-the-repository-pattern-in-php/"
date: "2021-06-29T14:18:44Z"
updated: "2024-11-07T12:14:31Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Application Scalability", "Software development", "Troubleshooting"]
tags: ["Laravel", "PHP", "design pattern", "software development"]
description: "How to implement the Repository Pattern in PHP to build a cache layer in front of the SQL database. Inspector real implementation."
focus_keyword: "php repository pattern"
seo_title: "How and why implement the repository pattern in PHP | Inspector tutorials"
featured_image: "../images/demystifying-the-repository-pattern-in-php/featured.jpg"
featured_image_alt: "Inspector implementation of the repository pattern in PHP"
wp_id: 3662
---

Hi, I'm Valerio, software engineer, founder and CTO at Inspector.

In this article I talk about the Repository Pattern and how we implemented it in our application. We did it to solve a scalability problem.

The Repository Pattern is one of the most discussed patterns due to many conflicts with ORMs. This pattern is often used as an abstraction layer to interact with the database. Yet, since the ORMs serve the same purpose, many developers get confused.

We will discuss this topic in detail, explaining why and how we implemented it in our backend.

## Why use a repository layer for data access?

The reason why an abstraction layer exists in an application is to drastically reduce code duplication.

ORM is the most well-known abstraction layer used to easily access and modify data against SQL databases. Laravel has [Eloquent](https://laravel.com/docs/8.x/eloquent), Symfony has [Doctrine](https://www.doctrine-project.org/), etc.

Using an ORM your business logic could be somthing like:

```php
$user = (new User())->find($id);
$user->first_name = "Valerio";
$user->save();
```

This is business logic, and it doesn’t care about how and where the data is stored. It depends on the internal ORM implementation and configuration. If you are a developer with professional experience, you likely use an ORM every day.

They already provide an abstraction layer to have smart access to data.

## Why should we use also the "Repository Pattern"?

In fact you shouldn't use it by default, contrary to what many developers claim.

Most of the technical articles I have read on the subject talk about the Repository Pattern in theory. They probably do so to push content into Google search results for that topic.

They start from simplistic assumptions not reflected in practical experience. So, I have struggled to understand if it was the right solution for me. Or if I could move my effort onto more urgent and productive tasks.

If you've had the same issue, you may find my experience helpful.

## Why might we need the "Repository Pattern"?

I will start with some problems to clarify when it is "not" necessary to introduce the Repository layer.

Many developers think of the Repository Pattern as insurance.

*"If you need to change XXX in the future, you can do it without having to break the whole application."*

In many articles the typical examples refer to:

- *Change the database* - but ORMs are already designed for this;
- *Change the ORM* - Changing the ORM is such a drastic step that in 99% of the cases where it happens, it's because you have to change the whole framework you work with. Or you even need to completely change technology. If you have a plan for this approach, the Repository Pattern is the least of your problems. In this case, you are over-engineering your code.

This isn't the right way to think. With the limited time available and tight budgets, we cannot focus on scenarios that may never occur. Instead, we need to solve the problems our projects are facing now.

The need to add an additional layer on top of the default data-access layer provided by the ORM could come in several scenarios. ORMs interact with databases but don't necessarily encapsulate complex statements.

So here are some real-life scenarios where you could need an additional layer on top of the ORM:

- You may have some complex query that you need to call from different place in your code;
- You may need to implement custom actions on an entity model. Ones that perform some data manipulation statements moving data from/to the database;
- Embrace new technologies like cache systems on top of your standard connection with the SQL database.

A **Repository** acts like a collection of domain objects, with powerful querying and data manipulation capabilities. Its main function is to provide collection like (query-enabled) access to domain objects. Whether they come from a database is besides the point.

Also, Repositories may (and often will) contain ORMs operations themselves.

The more you are using elaborate query logic or custom actions in your ORM, the more you want to start thinking about decoupling that logic. Put it into a repository while leaving your ORM to serve its primary function, mapping domain objects to the database and vice versa.

## Why I decided to add a Repostory layer in our Laravel application?

Our decision to introduce the "Repository layer" in Inspector was dictated by two of the three reasons mentioned above:

- We have several custom actions on various models that we want to group in a central place instead of repeating them in different parts of the code;
- We want to add a cache layer on top of the database to increase performance.

Thanks to the Laravel IoC container, we created a specific Repository layer for each of these problems.

### Repository interface

```php
namespace App\Repositories\Contracts;

use App\Models\Organization;

interface OrganizationRepository
{
    public function get($id): Organization;
    public function create(array $attributes): Organization;
    public function update($id, array $attributes): Organization;
    public function updateCurrentBillingConsumption($id, $value = null): Organization;
    public function addBonusTransactions($id, int $qty): Organization;
    public function lock($id): Organization;
    public function unlock($id): Organization;
    public function delete($id);
}
```

### Eloquent repository

```php
namespace App\Repositories\Eloquent;


use App\Events\OrganizationLocked;
use App\Events\OrganizationUnlocked;
use App\Models\Organization;
use App\Repositories\Contracts\OrganizationRepository;

class OrganizationEloquentRepository implements OrganizationRepository
{
    public function get($id): Organization
    {
        return Organization::with('cluster', 'projects')->findOrFail($id);
    }

    public function create(array $attributes): Organization
    {
        return Organization::create($attributes);
    }

    public function update($id, array $attributes): Organization
    {
        $organization = $this->get($id);
        if (!empty($attributes)) {
            $organization->update($attributes);
        }
        return $organization;
    }

    public function updateCurrentBillingConsumption($id, $value = null): Organization
    {
        $organization = $this->get($id);

        // Recalculate consumption on current billing period

        return $organization;
    }

    public function addBonusTransactions($id, int $qty): Organization
    {
        $organization = $this->get($id);

        // ...

        return $organization;
    }

    public function lock($id): Organization
    {
        $organization = $this->get($id);
        $organization->update(['locked_at' => now()]);
        event(new OrganizationLocked($organization));
        return $organization;
    }

    public function unlock($id): Organization
    {
        $organization = $this->get($id);
        $organization->update(['locked_at' => null]);
        event(new OrganizationUnlocked($organization));
        return $organization;
    }

    public function delete($id)
    {
        return Organization::destroy($id);
    }
}
```

### Cache repository

```php
namespace App\Repositories\Cache;


use App\Models\Organization;
use App\Repositories\Contracts\OrganizationRepository;
use App\Repositories\ModelCacheRepository;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Database\Eloquent\Model;

class OrganizationCacheRepository extends ModelCacheRepository implements OrganizationRepository
{
    /**
     * @var OrganizationRepository
     */
    protected $repository;

    /**
     * @var string
     */
    protected $model = Organization::class;

    /**
     * General TTL for cached items.
     */
    const CACHE_TTL = 86400; // 1 day

    /**
     * CacheOrganizationRepository constructor.
     *
     * @param Repository $cache
     * @param OrganizationRepository $repository
     */
    public function __construct(Repository $cache, OrganizationRepository $repository)
    {
        parent::__construct($cache);
        $this->repository = $repository;
    }

    /**
     * @inheritDoc
     */
    public function updateCache(Model $organization): Model
    {
        $this->cache->put($organization->getKey(), $organization, self::CACHE_TTL);
        return $organization;
    }

    public function get($id): Organization
    {
        return $this->cache->remember($id, self::CACHE_TTL, function () use ($id) {
            return $this->repository->get($id);
        });
    }

    public function create(array $attributes): Organization
    {
        return $this->updateCache(
            $this->repository->create($attributes)
        );
    }

    // ... other methods ...
}
```

### Binding the repository implementation in the Laravel Container

In the **AppServiceProvider** I defined the binding of the interface with the concrete implementaiton, stacking the two repositories:

```php
$this->app->singleton(OrganizationRepository::class, function () {
    return new OrganizationCacheRepository(
        $this->app->make(\Illuminate\Contracts\Cache\Repository::class),
        new OrganizationEloquentRepository()
    );
});
```

## Usage

In this way I stacked the **OrganizationCacheRepository** up to the **OrganizationEloquetRespoitory**.

Now the container is able to type hint the organization's repository when needed in my classes. Like in the controllers:

```php
class OrganizationController extends Controller
{
    /**
     * @var OrganizationRepository
     */
    protected $repository;

    /**
     * OrganizationController constructor.
     *
     * @param OrganizationRepository $repository
     */
    public function __construct(OrganizationRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return OrganizationResource
     */
    public function index(Request $request)
    {
        return new OrganizationResource(
            $this->repository->get($request->user()->organization_id)
        );
    }

    // ... other methods ...
}
```

## Laravel Repository Pattern Package

There is also some interesting package in the Laravel ecosystem that provides you all the underlying functionalities to getting started quickly.

Check out the [touhidurabir/laravel-model-repository](https://github.com/touhidurabir/laravel-model-repository) package just as an example.

## Conclusion

This architecture gave me some breathing room in terms of scalability. It also made me think about the next bottlenecks we could have. New applications were being connected to our "Code Execution Monitoring" engine almost every day.

[Dealing with the database](/how-i-handled-the-scalability-of-the-sql-database-at-inspector/) is probably the most critical challenge with scalability. It's not only about queries. Based on my experience, it also has a significant impact on the application architecture.

A cache layer in front of the SQL database has increased the amount of traffic we can handle by 5 times without changing our infrastructure.

But in many articles, I have read tips like: "Add a cache layer" or "Use Redis".

Yes, it is a good suggestion, but how to do it? It's not only about the tool. You need to understand how to change your application to embrace new technologies.
