const { Router } = require("express");
const router = Router();

router.get("/pricing", (req, res) => {
    res.render("pricing", {
        title: "Pricing Plans - Visbanking"
    });
});

module.exports = router;