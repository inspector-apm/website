---
title: "How to deploy a NodeJs server using Laravel Forge - Tutorial"
slug: "how-to-deploy-a-nodejs-server-using-laravel-forge"
section: "inspector"
permalink: "/how-to-deploy-a-nodejs-server-using-laravel-forge/"
original_url: "https://inspector.dev/how-to-deploy-a-nodejs-server-using-laravel-forge/"
date: "2021-02-07T13:22:10Z"
updated: "2025-01-21T11:06:41Z"
author: "Valerio Barbera"
category: "Application Scalability"
categories: ["Application Scalability", "Software development"]
tags: ["Laravel", "deploy", "laravel forge", "nodejs"]
description: "How to deploy a NodeJs server using Laravel Forge, the most popular server management tool in the Laravel community."
focus_keyword: "laravel forge"
featured_image: "../images/how-to-deploy-a-nodejs-server-using-laravel-forge/featured.png"
featured_image_alt: "node server logo"
wp_id: 2714
---

Hi, I'm Valerio, a software engineer from Italy and CTO at Inspector.

We recently worked to replace the HTTP handler behind our ingestion endpoint (ingestion.inspector.dev) with a new implementation. We used pure [NodeJs](https://nodejs.org).

This endpoint receives monitoring data sent from all applications connected to our Code Execution Monitoring engine. And it treats more than 5 million HTTP requests per day.

By using node.js, we see a 5x performance improvement in managing this large traffic volume. This makes Inspector more reliable and fast.

This article will show you how to deploy a NodeJs server using Forge. Forge is the most popular server management tool in the Laravel community.

It is designed to deploy PHP apps. Still, it's simple enough to get a node application running. It can because Forge includes a set of services like NGINX and SupervisorD. These can significantly simplify the server configuration.

## Laravel Forge NGINX configuration

We need to take advantage of nginx's excellent built-in capabilities.

Suppose to have a NodeJs server running on port 3000:

```javascript
// Start web server
http.createServer((req, res) => {

    // Managing the incoming http request

}).listen(3000, () => {
    console.log("Server is listening on port: 3000")
});
```

We need to tell NGINX that inbound requests should be proxied to our application's node process on port 3000.

At the bottom of the site details section in your Forge server, you'll find the "Files" button. Use it to access the site's NGINX configuration file. The area that we’re interested in is the ***location*** block that begins with "/". For a standard PHP or Laravel site, the default setting of ***try_files*** works well.

Here is the default configuration provided by Forge:

```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

We're running a Node.js process bound to a specific port on our VM. So, we need to inform NGINX that all HTTP requests should forward to our Node.js process in the appropriate port.

Replace this section with the script below:

```nginx
location / {
    proxy_pass http://localhost:3000; # Port number of node http server
   proxy_http_version 1.1;
   proxy_set_header Upgrade $http_upgrade;
   proxy_set_header Connection 'upgrade';
   proxy_set_header Host $host;
   proxy_cache_bypass $http_upgrade;
}
```

Nginx will now forward incoming requests to the NodeJs application (e.g. ExpressJs, Fastify, etc.) and return the response it generates to the requesting client.

## Supervisor configuration

It would be best to keep your node server working in production. This prevents the process from shutting down due to unexpected errors. For example, the Node.js server process may stop running for various reasons. They could include an exceeded timeout or a script exception.

For this reason, you need to configure a process monitor that can detect when your Node.js process exits and automatically restart it. Supervisor is a process monitor used in Linux environments. And it's available by default in the servers provisioned by Forge.

In the Forge panel, you can add a nodejs command as a daemon in the "Server > Daemons" menu.

Add the command below to start your node server:

```bash
node /home/forge/mysite.com/public/server.js
```

Doing so will ensure your nodejs server keeps running and restarts in case of an error.

## Deploy script

Additionally, we can use quick deploy in Forge. Below is a valid deployment script. It uses "pkill -f" to kill the supervisor process by full command name.

This strategy is the easiest as you don't know the PID number here:

```bash
# pull latest code version
cd /home/forge/mydomain.com
git pull origin main 

# install or update npm modules
cd /home/forge/mydomain.com
npm install 

# restart node daemon  
pkill -f 'node /home/forge/mydomain.com/public/server.js'
```

When the process is killed, the supervisor automatically restarts it loading the last code changes.

## Conclusion

Once you are familiar with the process, it will seem very quick and easy, and there are huge benefits. Forge has other features that work with non-Laravel apps.

They include the Schedule tab, which provides an easy way to manage cron jobs. Database helps you use MySQL (or a Postgres) database in your node script.
