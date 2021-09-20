const express = require("express");
const path = require("path");
const { readFile } = require("fs");
const marked = require("marked");
const router = express.Router();

router.get("/privacy", (req, res) => {
    readFile(path.join(__dirname, "..", "static", "files", "privacy.md"), "utf8", (err, data) => {
        if (err) throw err;
        res.send(marked(data.toString()));
    });
});

router.get("/terms", (req, res) => {
    readFile(path.join(__dirname, "..", "static", "files", "terms.md"), "utf8", (err, data) => {
        if (err) throw err;
        res.send(marked(data.toString()));
    });
});

router.get("/cookies", (req, res) => {  
    readFile(path.join(__dirname, "..", "static", "files", "cookies.md"), "utf8", (err, data) => {
        if (err) throw err;
        res.send(marked(data.toString()));
    });
});

router.get("/disclaimer", (req, res) => {  
    readFile(path.join(__dirname, "..", "static", "files", "disclaimer.md"), "utf8", (err, data) => {
        if (err) throw err;
        res.send(marked(data.toString()));
    });
});

module.exports = router;