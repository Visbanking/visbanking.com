# **admin.js**

***Note: This file will be affected by the in-development REST API. Hence, this documentation won't go in-depth into the structure and/or behavior of the existing code.***

The `routing/admin.js` file defines the Express middleware for the visbanking.com Admin Section at [visbanking.com/admin](https://visbanking.com/admin). Said middlewares include implementations for admin login, GET requests with database querying and routes to create, update, and delete resources in the database, all secured through Basic Authentication - username and password.

The dashboard provides a simple view of the existing resources in the database, such as system admins, site content (insights/articles, FAQs, etc...), and user accounts.

For content-related resources, like insights, the [`multer`](https://npmjs.com/package/multer) package is used to upload the file to the server. 