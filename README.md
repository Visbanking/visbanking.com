# **visbanking.com**

This is the official repository for the Visbanking website at [visbanking.com](https://visbanking.com).

The project is divided into directories (folders) that each group pieces of code with similar intents within the bigger application.

The project structure is explained superficially in this text, but you can read more in the respective documentation files in the [docs](./docs/) folder.

## **Contents**

- [Web Design](#web-design)
- [Languages and Tools](#languages-and-tools)
	- [Programming Languages](#programming-languages)
	- [Coding Tools](#coding-tools)
- [Project Structure](#project-structure)
	- [Views](#views)
	- [Static](#static)
	- [Routing](#routing)
	- [Models](#models)
	- [Data](#data)
	- [Controllers](#controllers)
	- [Docs](#docs)
- [Quick Access](#quick-access)

## **Web Design**

The website's Front End is designed on [Figma](https://figma.com). Review the current design [here](https://www.figma.com/file/gkSXWWTUkrpCHyDp8b6nHS/Visbanking)

## **Languages and Tools**

### **Programming Languages**

The following is a list of ALL the programming languages used in any part of this project:

1. JavaScript
2. HTML5
3. CSS3
4. Markdown

### **Coding Tools**

*Coding Tools* refers to any form of software/hardware that allows for better all-around code (greater readability, cleanliness, maintainability, etc...).

1. [ESLint](https://eslint.org) for JS code linting
2. [Pug](https://pugjs.org) as templating engine
3. [Sequelize](https://sequelize.org) as ORM for the RDS MySQL database
4. [Jest](https://jestjs.io) for Automated Testing

## **Project Structure**

The root folder of the project contains the main (entry) Node.js file, the npm configuration files ([package.json](./package.json) and [package-lock.json](./package-lock.json)), and the [.gitignore](./.gitignore) file. 

*Note: You can read more about each file, its contents and purpose in their respective documentation file in the docs/ folder.*

All subfolders (views, routing, models, etc...) are hosted within the root folder.

### **Views**

The views folder contains all files used to render the pages in the website. Some files are hosted in the first level of the directory, some are contained together in files according the the sections of the website they are relevant to, i.e. all view files related to the admin section of the site are hosted together in the admin subfolder.

This folder defines the view section of the [MVC design pattern](https://developer.mozilla.org/en-US/docs/Glossary/MVC).

*Note: This behavior is also used for static CSS and JavaScript files in the static folder, and will be used in any other folders in the project structure as necessary.*

### **Static**

The static folder hosts all of the static files of the site. The term 'static file' refers to any file which content doesn't change dynamically when loaded into the site. However, said content may affect the page on which it loads, as is the case for JavaScript files.

This folder contains the following six subfolders:

1) [css](./static/css/) (for all style-related files)
2) [js](./static/js/) (for all front-end JavaScript files)
3) [files](./static/files/) (for all text files e.g. PDF, Word)
4) [images](./static/images/) (for all JPEG/PNG files)
5) [videos](./static/videos/) (for all MP4 files)
6) [libs](./static/libs/) (for all external scripts related used in individual reports)

### **Routing**

The routing folder contains all files related to Back End routing. All routes are defined inside the files in this folder, and then imported into the main server file ([server.js](./server.js)) in the root folder to be used by the application.

### **Models**

The models folder hosts all of the data model definitions created as class extensions of the Sequelize Model class. This folder defines the model section of the [MVC design pattern](https://developer.mozilla.org/en-US/docs/Glossary/MVC).

Each file defines and exports a different data model, which is then used in the controllers/ folder to define the next layer of the MVC pattern.

### **Data**

The data folder contains files of relevance to the application, but that dont fit into the folders decribed above, the application documentation, or any other part of the MVC design pattern.

This folder hosts definitions for the site's caching strategy (with Redis), as well as the database connections definitions and all custom error definitions, but its contents are not limited to the ones mentioned.

### **Controllers**

The controllers folder contains all of the data controller definitions built on top of the models defined in the models/ folder. This folder defines the model section of the [MVC design pattern](https://developer.mozilla.org/en-US/docs/Glossary/MVC).

Each file defines and exports a different data controller built on top of the respective data model it controlls.

### **Docs**

The docs folder hosts the documentation for every single part of the application. For every file in the project, there is a documentation file in this folder with the same pathname as in the root folder. 

Each file is written in Markdown language and holds the information necessary to comprehend the code and its purpose without needing to review the file itself.

## **Quick Access**

Follow the links below to quickly access any code (and code-related) file or folder in the project.

- [server.js](./server.js)
- [robots.txt](./robots.txt)
- [package.json](./package.json)
- [package-lock.json](./package-lock.json)
- [.gitignore](./.gitignore)
- [.eslintrc.json](./.eslintrc.json)
- [views](./views/)
	- [admin](./views/admin/)
		- [insights](./views/admin/insights/)
			- [create.pug](./views/admin/insights/create.pug)
			- [edit.pug](./views/admin/insights/edit.pug)
		- [dashboard.pug](./views/admin/dashboard.pug)
		- [login.pug](./views/admin/login.pug)
		- [redirect.pug](./views/admin/redirect.pug)
	- [emails](./views/emails/)
		- [academicRequest.html](./views/emails/academicRequest.html)
		- [contactFormSubmission.html](./views/emails/contactFormSubmission.html)
		- [emailVerification.html](./views/emails/emailVerification.html)
		- [passwordRecovery.html](./views/emails/passwordRecovery.html)
		- [userConfirmation.html](./views/emails/userConfirmation.html)
	- [landing](./views/landing/)
		- [academic.pug](./views/landing/academic.pug)
		- [newsDigest.pug](./views/landing/newsDigest.pug)
	- [reports](./views/reports/)
		- [bank.pug](./views/reports/bank.pug)
		- [error.pug](./views/reports/error.pug)
		- [htmlReport.pug](./views/reports/htmlReport.pug)
		- [pdfReport.pug](./views/reports/pdfReport.pug)
		- [upgrade.pug](./views/reports/upgrade.pug)
	- [services](./views/services/)
		- [service.pug](./views/services/service.pug)
	- [user](./views/user/)
		- [user.pug](./views/user/user.pug)
		- [passwordUpdate.pug](./views/user/passwordUpdate.pug)
		- [deleted.pug](./views/user/deleted.pug)
	- [about.pug](./views/about.pug)
	- [contact.pug](./views/contact.pug)
	- [error.pug](./views/error.pug)
	- [failure.pug](./views/failure.pug)
	- [faq.pug](./views/faq.pug)
	- [index.pug](./views/index.pug)
	- [insight.pug](./views/insight.pug)
	- [insights.pug](./views/insights.pug)
	- [layout.pug](./views/layout.pug)
	- [login.pug](./views/login.pug)
	- [pricing.pug](./views/pricing.pug)
	- [privacy.pug](./views/privacy.pug)
	- [recover.pug](./views/recover.pug)
	- [reports.pug](./views/reports.pug)
	- [reset.pug](./views/reset.pug)
	- [services.pug](./views/services.pug)
	- [success.pug](./views/success.pug)
	- [team.pug](./views/team.pug)
- [tests](./tests/)
	- [models](./tests/models/)
		- [admin.model.test.js](./tests/models/admin.model.test.js)
- [static](./static/)
	- [css](./static/css/)
		- [admin](./static/css/admin/)
			- [insights](./static/css/admin/insights/)
				- [create.css](./static/css/admin/insights/create.css)
			- [dashboard.css](./static/css/admin/dashboard.css)
			- [login.css](./static/css/admin/login.css)
			- [redirect.css](./static/css/admin/redirect.css)
		- [landing](./static/css/landing/)
			- [academic.css](./static/css/landing/academic.css)
			- [newsDigest.css](./static/css/landing/newsDigest.css)
		- [reports](./static/css/reports/)
			- [error.css](./static/css/reports/error.css)
			- [htmlReport.css](./static/css/reports/htmlReport.css)
			- [report.css](./static/css/reports/report.css)
			- [reports.css](./static/css/reports/reports.css)
		- [services](./static/css/services/)
			- [service.css](./static/css/services/service.css)
		- [user](./static/css/user/)
			- [user.css](./static/css/user/user.css)
			- [update.css](./static/css/user/update.css)
			- [deleted.css](./static/css/user/deleted.css)
		- [about.css](./static/css/about.css)
		- [banks.css](./static/css/banks.css)
		- [contact.css](./static/css/contact.css)
		- [error.css](./static/css/error.css)
		- [faq.css](./static/css/faq.css)
		- [index.css](./static/css/index.css)
		- [insight.css](./static/css/insight.css)
		- [insights.css](./static/css/insights.css)
		- [layout.css](./static/css/layout.css)
		- [login.css](./static/css/login.css)
		- [popup.css](./static/css/popup.css)
		- [pricing.css](./static/css/pricing.css)
		- [privacy.css](./static/css/privacy.css)
		- [recover.css](./static/css/recover.css)
		- [reports.css](./static/css/reports.css)
		- [reset.css](./static/css/reset.css)
		- [services.css](./static/css/services.css)
		- [success.css](./static/css/success.css)
		- [team.css](./static/css/team.css)
	- [files](./static/files/)
		- [policies](./static/files/policies/)
			- [cookies.md](./static/files/policies/cookies.md)
			- [disclaimer.md](./static/files/policies/disclaimer.md)
			- [privacy.md](./static/files/policies/privacy.md)
			- [terms.md](./static/files/policies/terms.md)
	- [js](./static/js/)
		- [admin](./static/js/admin/)
			- [insights](./static/js/admin/insights/)
				- [create.js](./static/js/admin/insights/create.js)
				- [edit.js](./static/js/admin/insights/edit.js)
				- [editor.js](./static/js/admin/insights/editor.js)
			- [dashboard.js](./static/js/admin/dashboard.js)
		- [reports](./static/js/reports/)
			- [filter.js](./static/js/reports/filter.js)
			- [report.js](./static/js/reports/report.js)
			- [reports.js](./static/js/reports/reports.js)
			- [responsive.js](./static/js/reports/responsive.js)
		- [user](./static/js/user/)
			- [user.js](./static/js/user/user.js)
			- [passwordUpdate.js](./static/js/user/passwordUpdate.js)
			- [deleted.js](./static/js/user/deleted.js)
		- [about.js](./static/js/about.js)
		- [analytics.js](./static/js/analytics.js)
		- [contact.js](./static/js/contact.js)
		- [faq.js](./static/js/faq.js)
		- [googleSignInButton.js](./static/js/googleSignInButton.js)
		- [index.js](./static/js/index.js)
		- [insight.js](./static/js/insight.js)
		- [insights.js](./static/js/insights.js)
		- [layout.pug](./static/js/layout.js)
		- [login.js](./static/js/login.js)
		- [popup.js](./static/js/popup.js)
		- [pricing.js](./static/js/pricing.js)
		- [privacy.js](./static/js/privacy.js)
		- [redirect.js](./static/js/redirect.js)
		- [reports.js](./static/js/reports.js)
		- [reset.js](./static/js/reset.js)
		- [services.js](./static/js/services.js)
		- [signInWithLinkedIn.js](./static/js/signInWithLinkedIn.js)
		- [success.js](./static/js/success.js)
		- [tawk.js](./static/js/tawk.js)
	- [libs](./static/libs/)
- [routing](./routing/)
	- [landing](./routing/landing/)
		- [academic.js](./routing/landing/academic.js)
		- [newsDigest.js](./routing/landing/newsDigest.js)
	- [about.js](./routing/about.js)
	- [admin.js](./routing/admin.js)
	- [buy.js](./routing/buy.js)
	- [contact.js](./routing/contact.js)
	- [error.js](./routing/error.js)
	- [files.js](./routing/files.js)
	- [funnel.js](./routing/funnel.js)
	- [insights.js](./routing/insights.js)
	- [landing.js](./routing/landing.js)
	- [login.js](./routing/login.js)
	- [privacy.js](./routing/privacy.js)
	- [recovery.js](./routing/recovery.js)
	- [reports.js](./routing/reports.js)
	- [routes.js](./routing/routes.js)
	- [services.js](./routing/services.js)
	- [signup.js](./routing/signup.js)
	- [subscribe.js](./routing/subscribe.js)
	- [user.js](./routing/user.js)
- [models](./models/)
	- [admin.model.js](./models/admin.model.js)
	- [contact.model.js](./models/contact.model.js)
	- [faq.model.js](./models/faq.model.js)
	- [insight.model.js](./models/insight.model.js)
	- [member.model.js](./models/member.model.js)
	- [newsDigestSubscriber.model.js](./models/newsDigestSubscriber.model.js)
	- [newsletterSubscriber.model.js](./models/newsletterSubscriber.model.js)
	- [user.model.js](./models/user.model.js)
- [data](./data/)
	- [api](./data/api/)
		- [APIClient.js](./data/api/APIClient.js)
		- [generateAuthorizationToken.js](./data/api/generateAuthorizationToken.js)
	- [database](./data/database/)
		- [usersDatabase.js](./data/database/usersDatabase.js)
		- [visbankingDatabase.js](./data/database/visbankingDatabase.js)
	- [errors](./data/errors/)
		- [ResourceNotFoundError.js](./data/errors/ResourceNotFoundError.js)
	- [caching.js](./data/caching.js)
	- [dbconnection.js](./data/dbconnection.js)
	- [generateSitemap.js](./data/generateSitemap.js)
	- [s3Client.js](./data/s3Client.js)
- [controllers](./controllers/)
	- [admin.controller.js](./controllers/admin.controller.js)
	- [contact.controller.js](./controllers/contact.controller.js)
	- [faq.controller.js](./controllers/faq.controller.js)
	- [insight.controller.js](./controllers/insight.controller.js)
	- [member.controller.js](./controllers/member.controller.js)
	- [newsDigestSubscriber.controller.js](./controllers/newsDigestSubscriber.controller.js)
	- [newsletterSubscriber.controller.js](./controllers/newsletterSubscriber.controller.js)
	- [user.controller.js](./controllers/user.controller.js)