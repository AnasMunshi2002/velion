const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const SearchController = require("../controllers/searchController");

router.use(authenticateToken);

router.get("/", SearchController.searchKnowledge);

module.exports = router;
