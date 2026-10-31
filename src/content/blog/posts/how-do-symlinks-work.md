---
title: "How do symlink works"
slug: "how-do-symlinks-work"
section: "inspector"
permalink: "/how-do-symlinks-work/"
original_url: "https://inspector.dev/how-do-symlinks-work/"
date: "2025-02-11T01:36:48Z"
updated: "2025-02-11T17:28:29Z"
author: "Valerio Barbera"
category: "Software development"
categories: ["Software development"]
tags: ["software development"]
excerpt: "Explore how symlink simplify file management in Unix systems, improve deployment strategies, and enhance storage organization."
description: "Explore how symlink simplify file management in Unix systems, improve deployment strategies, and enhance storage organization."
focus_keyword: "symlink"
featured_image: "../images/how-do-symlinks-work/featured.jpg"
wp_id: 8686
---

**Symlinks (symbolic links)** are special files in [Unix](https://en.wikipedia.org/wiki/Unix) systems that act as pointers to other files or directories. Instead of storing data, they store a reference path. This makes file management easier by allowing you to create shortcuts or aliases for files and directories.

### Key Points:

- **What They Do**: Symlinks redirect commands (like `ls` or `cat`) to the target file or directory.
- **Common Uses**:
  - **Version Management**: Example: `/usr/bin/python3` points to `python3.11`.
  - **Zero-Downtime Deployment**: Switch between app versions instantly using symlinks.
  - **Storage Organization**: Link files across partitions while keeping a unified structure.
  - **Legacy Support**: Redirects for moved or renamed files.
- **Types of Paths**:
  - **Absolute Paths**: Fixed location references (e.g., `/var/www/current`).
  - **Relative Paths**: Maintain directory relationships (e.g., `../shared/storage`).

### Quick Comparison: Symlinks vs. Hard Links

| Feature | Symbolic Links | Hard Links |
| --- | --- | --- |
| Cross-filesystem support | Yes | No |
| Directory linking | Yes | No |
| Inode sharing | No | Yes |
| Target deletion effect | Becomes a dangling link | No effect |

Symlinks are essential for deployments, version control, and storage management. They simplify workflows by allowing quick switches between versions or locations without duplicating files.

## Symlinks in [Unix](https://en.wikipedia.org/wiki/Unix) Systems

### Comparing Symlinks and Hard Links

Here's a quick breakdown of how symbolic links differ from hard links:

| Feature | Symbolic Links | Hard Links |
| --- | --- | --- |
| Cross-filesystem support | Yes | No |
| Directory linking | Yes | No |
| Inode sharing | No | Yes |
| Target deletion effect | Becomes a dangling link | No effect |
| Storage overhead | Minimal (small file) | None |
| Performance impact | Requires path resolution | Direct access |

### Basic Symlink Commands

You can create symlinks using the `ln -s` command:

```bash
ln -s /path/to/target link_name
```

For example, in a PHP application:

```bash
ln -s /var/www/releases/20240211 /var/www/production
```

To inspect symlinks, use `ls -l`. This command will display the relationship between the symlink and its target:

```bash
lrwxrwxrwx 1 user group 11 Jan 01 12:34 current -> /var/www/v2
```

### How Symlinks Find Target Files

Unix handles symlinks by evaluating the path they reference. It determines if the path is **absolute** (starts with "/") or **relative** (includes "../" or similar).

For example, if you access `/opt/app/live/config.php` and `live` is a symlink pointing to `releases/v3`, the system replaces `live` with `releases/v3`, effectively navigating to `/opt/app/releases/v3/config.php`.

To avoid infinite loops caused by circular symlinks, Unix enforces a limit of 40 symlink redirects. If this limit is exceeded, it throws an error. This safeguard ensures system stability and prevents resource exhaustion.

This resolution process plays a crucial role in tasks like zero-downtime deployments, which we'll explore further in the next section.

## Using Symlinks for Zero Downtime Deployment

### Setting Up Deployment Directories

Zero-downtime deployment uses symlinks to switch between application versions smoothly. This setup relies on three key components: release directories, shared resources, and a symlink named `current`. With this structure, you can switch versions instantly by following these steps:

### Step-by-Step Deployment Process

1\. **Create a New Release Directory**

Start by creating a timestamped directory for your new application version and cloning the code into it:

```bash
NEW_RELEASE=/var/www/releases/$(date +%Y%m%d%H%M%S)
git clone repository $NEW_RELEASE
```

2\. **Link Shared Resources**

Next, connect the new release to shared files and configurations:

```bash
ln -s ../../shared/storage/app/public $NEW_RELEASE/public/storage
ln -s ../../shared/.env $NEW_RELEASE/env
```

3\. **Switch Symlink Atomically**

Finally, update the symlink to point to the new release using atomic operations:

```bash
ln -s $NEW_RELEASE current.tmp
mv -fT current.tmp current
```

This ensures the transition happens instantly without disrupting the service [<sup>\[6\]</sup>](https://buddy.works/docs/pipelines/pipeline-examples/zero-downtime-deployment)[<sup>\[5\]</sup>](https://launchdeck.io/blog/tutorials/zero-downtime-deployment-atomic-git-deployments).

### Why It Works for Production Systems

This method offers several practical benefits for production environments, especially when managing PHP applications:

- **Quick Rollbacks**: If something goes wrong, simply point the symlink back to the previous release.
- **No Downtime**: The atomic switch ensures users don’t experience partial deployments.
- **Efficient Storage**: Shared assets like storage and environment files avoid duplication.
- **Simplified Configuration**: The consistent `/var/www/current` path keeps settings straightforward.

Popular tools like [Laravel Envoyer](https://envoyer.io/) use this technique to reduce deployment impact to just a fraction of a second [<sup>\[3\]</sup>](https://statamic.dev/tips/zero-downtime-deployments)[<sup>\[6\]</sup>](https://buddy.works/docs/pipelines/pipeline-examples/zero-downtime-deployment). Other deployment solutions, such as [Buddy CI/CD](https://buddy.works/) and [Deployer](https://deployer.org/), also rely on this approach. It’s a trusted method for ensuring smooth, reliable updates in production.

## Symlink Usage Guidelines

Maintaining symlinks properly is key to ensuring smooth deployments. Below are practical tips for selecting paths, managing permissions, and avoiding errors.

### Choosing Path Types

- **Absolute paths** are ideal when the target's location is fixed and unlikely to change.
- **Relative paths** are better for setups where directory relationships need to stay consistent across different environments.

Choose based on your deployment needs to minimize potential issues.

### Setting Correct Permissions

Getting permissions right is essential for both security and functionality. Symlinks inherit permissions from their target, but the surrounding directory structure needs specific settings:

| Component | Permission | Purpose |
| --- | --- | --- |
| Web App Symlinks | www-data:www-data | Matches the service account |
| Deployment Directories | 750 | Limits unauthorized access |

For web applications using [Apache](https://httpd.apache.org/) or [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/), ensure all parent directories have execute permissions:

```bash
chmod o+x /var /var/www /var/www/current
```

To block unauthorized changes to symlinks, apply the sticky bit to deployment directories:

```bash
chmod +t /deployments
```

### Finding Broken Symlinks

Regular checks are essential to avoid deployment problems and security risks. Use the following command to locate and remove broken symlinks:

```bash
find /path/to/check -type l -xtype l -print0 | xargs -0 rm
```

To keep track of symlinks, schedule audits like this:

```bash
ls -lR /path | grep ^l > inventory.txt
```

For troubleshooting complex symlink chains, this command helps resolve paths and identify issues like circular references:

```bash
namei -l /path/to/link
```

This is especially useful for detecting errors such as "Too many levels of symbolic links".

## Fixing Common Symlink Problems

Even with careful setup, symlink issues can still arise in production. Here’s how to tackle some of the most common problems effectively:

### Fixing Circular Links

Circular symlinks can lead to system freezes or endless loops, disrupting essential services. To resolve this, you can use the `namei -l` command to trace and pinpoint the loop. Once identified, replace the problematic link. Here's the process:

- Use `namei -l /path/to/link` to trace the symlink chain.
- Locate the point where the loop occurs.
- Replace the faulty symlink to restore proper functionality.

### Security Best Practices

Building on earlier auditing techniques, you can enhance security by adding extra layers of protection. For PHP applications hosted on shared servers, combine these measures with restrictions on system calls related to symlinks [<sup>\[2\]</sup>](https://www.redhat.com/en/blog/linking-linux-explained).

Keep an eye on audit logs for any unusual activity, especially in critical directories. For example, you can monitor symlink-related operations like this:

```bash
auditctl -w /var/www/current -p wa -k deployment_links
```

### Managing Multiple Access

When dealing with databases, it’s important to align symlink changes with transactions to ensure data consistency. Tools like Buddy.Works can simplify this process by adding features such as checksum verification, automated rollback, and cleanup after deployment.

- **Validation Process**: Before switching symlinks, the system verifies checksums of target directories and runs dry-run tests in staging environments.
- **Fallback Mechanism**: If validation fails, automated rollback procedures kick in to maintain system stability during deployments.
- **Cleanup Protocol**: Post-deployment scripts clean up orphaned links and check symlink integrity across the system.

### Why Symlinks Matter

Symlinks play a key role in modern deployment strategies by simplifying file management and avoiding data duplication. Symlinks ensure consistent file paths, making it easier to switch between versions without causing downtimes.

## Related Blog Posts

- [Symfony file upload examples and best practices](/symfony-file-upload-examples-and-best-practices/)
- [Laravel Logging: Channels and Stacks Explained](/laravel-logging-channels-and-stacks-explained/)
- [How to Automate PHP Security Patch Management](/how-to-automate-php-security-patch-management/)
- [What are Symfony recipes](/what-are-symfony-recipes/)
