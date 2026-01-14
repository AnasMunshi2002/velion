const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const DocumentController = require("../controllers/documentController");

router.use(authenticateToken);

router.post("/upload", DocumentController.uploadDocument);

module.exports = router;
