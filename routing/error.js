const express = require("express");
const router = express.Router();

router.use("/", (req, res) => {
    res.status(404).render("error", {
        title: "Page Not Found",
        code: 404,
        message: "The page or resource you are looking for doesn't exist"
    });
});

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("error", {
        title: "Server Error",
        code: 500,
        message: "There has been an issue with the server"
    });
});

module.exports = router;