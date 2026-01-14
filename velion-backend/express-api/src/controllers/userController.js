const DjangoService = require("../services/djangoService");

class UserController {
  async getProfile(req, res) {
    try {
      const user = await DjangoService.getUserById(req.user.id);
      res.json(user);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }

  async updateProfile(req, res) {
    try {
      const updates = req.body;
      const user = await DjangoService.updateUser(req.user.id, updates);
      res.json(user);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
}

module.exports = new UserController();
