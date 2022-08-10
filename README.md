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