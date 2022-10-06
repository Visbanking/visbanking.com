const { Router } = require("express");
const appStatusMonitor = require("../../../../data/expressStatusMonitor");
const router = Router();

router.get("/", appStatusMonitor.pageRoute);

module.exports = router;