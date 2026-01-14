const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const AnalyticsController = require("../controllers/analyticsController");

router.use(authenticateToken);

router.get("/", AnalyticsController.getAnalytics);

module.exports = router;
