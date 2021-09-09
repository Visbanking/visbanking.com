const express = require("express");
const bodyParser = require("body-parser");
// const existence = require("email-existence");
// const client = require("@mailchimp/mailchimp_marketing");
const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

// client.setConfig({
//     apiKey: '<MailChimp API Key>',
//     server: '<MailChimp List Server>'
// });

router.get("/", (req, res) => {
    res.render("subscribe", {
        title: "Subscribe to our Newsletter - Visbanking",
        path: "/subscribe"
    });
});

router.post("/", (req, res) => {
    res.send(req.body);
});

module.exports = router;