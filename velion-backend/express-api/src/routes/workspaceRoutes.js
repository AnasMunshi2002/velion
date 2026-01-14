const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const WorkspaceController = require("../controllers/workspaceController");

router.use(authenticateToken);

router.post("/", WorkspaceController.createWorkspace);
router.get("/:id", WorkspaceController.getWorkspace);
router.post("/:id/documents", WorkspaceController.addDocumentToWorkspace);
router.post("/:id/invite", WorkspaceController.inviteToWorkspace);

module.exports = router;
