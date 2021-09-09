const express = require("express");
const router = express.Router();

router.get("/:report_id", (req, res) => {
    res.send(req.params);
    // Query database for report with id = report_id
    // If query returns an object, render template report.pug
    // If query doesn't return object, redirect to 404
});

router.post("/:report_id", (req, res) => {
    res.send(req.params);
    // Query database for report with id = report_id
    // If query returns an object, generate PDF file for report and redirect
    // If query doesn't return object, redirect to 404
    // res.download(path.join(__dirname, "reports", "<report_id>"));
});

module.exports = router;