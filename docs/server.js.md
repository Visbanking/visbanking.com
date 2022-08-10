# **Server.js**

This is the main Node.js server/entry file. This file sets up all routes with the routing definitions in the [routing/](./../routing/) folder, as well as define a few application- and site-wide configuration options (Express configuration, HTTP headers, etc...). This file is set up in blocks, wherein each is a collections of related code regarding both functionality/purpose and structure.

## **Imports Block**

The first block of code in the file is referred to as the *Imports Block*. 

All variables are declared as constants in the first block of code in the file. This includes all routing-related files as well as importing any relevant [npm](https://npmjs.com) packages. All of the imports defined in this block are used throughout the file.

This block comprises lines 1-26 of the file.

## **Express Config Block**

The second block of code (*Express Config Block*) in the file defines some global configuration options for the express app defined in the previous block. These options include: 

1. Static files folder
2. Site Favicon
3. Express body-parser set up (urlencoded)
4. Express cookie-parser set up
5. Express CORS set up
6. Templating engine (Pug) declaration

This block comprises lines 28-33 of the file.

## **Routing Block**

The third block of this file contains all the route handler middleware functions declarations made with the imported files from the [routing/](./../routing) folder, hence the name *Routing Block*.

This block includes a global middleware function that defines HTTP Security headers (like X-XSS-Protection and Strict-Transport-Security).

The rest of the block integrates all the required routing imports into the application, with the `use()` Express method.

To review the code related to each pathname refer to the respective file in the [routing/](./../routing/) folder.

This block comprises lines 35-78 of the file.

## **Listener Block**

The last block (*Listener Block*) contains only one line of code, which starts the Node.js/Express.js server on the previously defined port.

This block comprises line 80 of the file.