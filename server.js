const express = require("express")
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");
const routes = require("./routing/routes");
const about = require("./routing/about");
const insights = require("./routing/insights");
const contact = require("./routing/contact");
const login = require("./routing/login");
const user = require("./routing/user");
const subscribe = require("./routing/subscribe");
const pricing = require("./routing/pricing");
const privacy = require("./routing/privacy");
const files = require("./routing/files");
const error = require("./routing/error");
const app = express();
const port = 3004;

app.use(express.static(path.join(__dirname, "static")));
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use(cors());
app.set("view engine", "pug");

app.use(routes);

app.use("/about", about);

app.use("/insights", insights);

app.use("/contact", contact);

app.use(login);

app.use("/users", user);

app.use("/subscribe", subscribe);

app.use(pricing);

app.use(privacy);

app.use(files);

app.use(error);

app.listen(port, () => console.log(`Visbanking app listening on port ${port}`));