---
title: "[Resolved] Integrity constraint violation - Fast tips"
slug: "resolved-integrity-constraint-violation-fast-tips"
section: "inspector"
permalink: "/resolved-integrity-constraint-violation-fast-tips/"
original_url: "https://inspector.dev/resolved-integrity-constraint-violation-fast-tips/"
date: "2023-10-19T09:04:11Z"
updated: "2024-11-07T12:13:33Z"
author: "Valerio Barbera"
category: "Fast tips"
categories: ["Database", "Fast tips", "Software development"]
tags: ["Laravel", "PHP", "database", "software development", "sql"]
description: "How to resolve the Integrity constraint violation error when adding a new column to a database table. Tips using Laravel Migrations."
focus_keyword: "Integrity constraint violation"
seo_title: "Integrity constraint violation how to solve - inspector.dev"
featured_image: "../images/resolved-integrity-constraint-violation-fast-tips/featured.png"
wp_id: 6082
---

If you are dealing with the error: "*Integrity constraint violation: Cannot add or update a child row: a foreign key constraint fails*", you are in the right article.

Usually you encounter this error when you add a new column to a table and declare it as a Foreign Key.

In a SQL database, a foreign key is a field in a table used to establish a link between the data in another table.Consider the **customers** table below.

```sql
CREATE TABLE customers (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);
```

Now you want to link your customers to a group. First you should add the new column to the **customers** table that contains the reference to the **groups** table:

```sql
# Create the new column "group_id"
ALTER TABLE customers
ADD COLUMN group_id INT NOT NULL;
```

Than you can add the foreign key constraint to activate the relation to the **groups** table:

```sql
# Add the FK constraints
ALTER TABLE customers
ADD CONSTRAINT fk_group_id
FOREIGN KEY (group_id)
REFERENCES customers(id);
```

When you run this alter operation on the **customers** table the database will verify that the ID in the **group_id** field exists in the **groups** table.

During this check the database will raise the “*Integrity violation error*” because the **group_id** column is still empty, so it doesn't contain any valid references in the groups table. So the SQL engine fails trying to apply the foreign key constraint. It’s because an empty value isn’t a valid foreign key to the **groups** table.

## How to solve the Integrity violation error

The most simple action is to declare the new column as nullable.

You can remove the “NOT NULL” instruction from the alter query to allow the **group_id** column to contain null values.

This simple change will resolve the issue in the first place, because now the foreign key can be null too. You can run the data migration to eventually fill the new **group_id** column in the customers table, and plan a new release to reintroduce the “NOT NULL” constraint.

If in your application a Customer can’t exist without a specific Group, you should remember that having the **group_id** nullable, your database is not aware of this constraint.

If you make a mistake during entity creation in your application, the database will not alert you.

## Data migration

Another solution is to add a data migration job between the alter query for adding the new column and the one for adding the foreign key.

Once you have the new group_id column in the **customers** table you can run a script to fill this column for existing rows with a valid ID from the **groups** table.

This is an example of query to perform this task:

```sql
UPDATE customers, groups
SET customers.group_id = groups.id
Where customers.user_id = groups.user_id;
```

## Using Laravel Migrations

In modern applications all of these tasks are performed using the migration tool. It is usually available in most common application development frameworks.

In the example below I’ll show you how to deal with the Integrity constraint violation issue using Laravel migrations.

Create the migration:

```bash
php artisan make:migration add_goup_id_fk_to_customers –table=customers
```

You can break the migration in two parts as shown below:

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->unsignedBigInteger('group_id')->nullable();
        });

        // Insert default data into the new column
        DB::raw('UPDATE customers, groups
            SET customers.group_id = groups.id
            WHERE customers.user_id = groups.user_id');

        Schema::table('customers', function (Blueprint $table) {
            // Add the FK constraint
            $table->foreign('group_id')->references('id')->on(groups)->onDelete('cascade');

            // Remove the nullable condition eventually;
            $table->unsignedBigInteger('group_id')->change();
        });



    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign('group_id');
            $table->dropColumn('group_id');
        });
    }
};
```

If you are interested in improving database performance you can take a look at the article below about "Smart Database Queries":

[How to accelerate application performance with smart SQL queries.](/how-to-accelerate-application-performance-with-smart-sql-queries/)

For more technical articles you can follow me on [**Linkedin**](https://www.linkedin.com/in/valeriobarbera/) or **[X](https://x.com/Barbalerio)**. I post about building my SaaS business.
