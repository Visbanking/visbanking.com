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
const buy = require("./routing/buy");
const recovery = require("./routing/recovery");
const privacy = require("./routing/privacy");
const admin = require("./routing/admin");
const files = require("./routing/files");
const error = require("./routing/error");
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, "static")));
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use(cors());
app.set("view engine", "pug");

app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    res.removeHeader('X-Powered-By');
    next();
});

app.use(routes);

app.use("/about", about);

app.use("/insights", insights);

app.use("/contact", contact);

app.use(login);

app.use("/me", user);

app.use("/subscribe", subscribe);

app.use("/buy", buy);

app.use("/recovery", recovery);

app.use(privacy);

app.use("/admin", admin);

app.use(files);

app.use(error);

app.listen(port, () => console.log(`Visbanking app listening on port ${port}`));