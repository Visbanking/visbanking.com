const { Router } = require("express");
const router = Router();

router.get("/pricing", (req, res) => {
    res.render("pricing", {
        title: "Pricing - Visbanking"
    });
});

module.exports = router;