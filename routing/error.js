const express = require("express");
const router = express.Router();

router.get("/error", (req, res) => {
    res.status(500).render("error", {
        title: "500 Internal Server Error",
        code: 500,
        message: "There has been an issue with the server"
    });
});

router.use("/", (req, res) => {
    res.status(404).render("error", {
        title: "404 Page Not Found",
        code: 404,
        message: "The page or resource you are looking for doesn't exist"
    });
});

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("error", {
        title: "500 Internal Server Error",
        code: 500,
        message: "There has been an issue with the server"
    });
});

module.exports = router;