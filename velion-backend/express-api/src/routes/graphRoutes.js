const express = require("express");
const router = express.Router();
// const { authenticateToken } = require("../middleware/auth");
const GraphController = require("../controllers/graphController");

// router.use(authenticateToken);

router.get("/", GraphController.generateKnowledgeGraph);
router.get("/connections", GraphController.findConnections);

module.exports = router;
