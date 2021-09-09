const express = require("express");
const router = express.Router();

router.get("/:executive_id", (req, res) => {
    // Query database for executive with id = executive_id
    // If query returns an object, render template_executive.pug
    // If query doesn't return object, redirect to 404
});

module.exports = router;