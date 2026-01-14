const DjangoService = require("../services/djangoService");

class AnalyticsController {
  async getAnalytics(req, res) {
    try {
      // Get analytics data from Django
      const stats = await DjangoService.getDashboardStats(req.query);
      res.json(stats);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  }
}

module.exports = new AnalyticsController();
