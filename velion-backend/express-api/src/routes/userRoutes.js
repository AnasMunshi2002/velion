const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const UserController = require("../controllers/userController");

router.use(authenticateToken);

router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);

module.exports = router;
