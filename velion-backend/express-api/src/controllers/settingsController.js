const DjangoService = require("../services/djangoService");

class SettingsController {
  async getSettings(req, res) {
    try {
      // For now, return default settings
      res.json({
        theme: "light",
        notifications: true,
        language: "en",
      });
    } catch (error) {
      console.error("Get settings error:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  }

  async updateSettings(req, res) {
    try {
      const settings = req.body;
      // Save settings logic here
      res.json(settings);
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  }
}

module.exports = new SettingsController();
