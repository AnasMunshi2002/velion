const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getDashboardStats,
  getRecommendations,
  getRecentActivity,
} = require("../controllers/dashboardController");

router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/recommendations", getRecommendations);
router.get("/activity", getRecentActivity);

module.exports = router;
