const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const SettingsController = require("../controllers/settingsController");

router.use(authenticateToken);

router.get("/", SettingsController.getSettings);
router.put("/", SettingsController.updateSettings);

module.exports = router;
