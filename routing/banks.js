const express = require("express");
const router = express.Router();

router.get("/:bank_id", (req, res) => {
    res.send(req.params);
    // Query database for bank with id = bank_id
    // If query returns an object, render template bank.pug
    // If query doesn't return object, redirect to 404
});

router.get("/:bank_id/executives", (req, res) => {
    res.send(req.params);
    // Query database for executives with bank_id = bank_id
    // If query returns an object, render template bank_executives.pug
    // If query doesn't return object, redirect to 404
})

module.exports = router;