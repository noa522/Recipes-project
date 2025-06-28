const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { syncCategoryRecipeCounts } = require("../utils/updateCategoryRecipeCount");
const { verifyToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/sync-counts", async (req, res) => {
  try {
    await syncCategoryRecipeCounts();
    res.json({ msg: "Recipe counts synced successfully" });
  } catch (err) {
    res.status(500).json({ error: "Sync failed", detail: err.message });
  }
});

router.get("/", categoryController.getAllCategories);
router.get("/:code", categoryController.getCategoryByCode);
router.post("/", verifyToken, isAdmin, categoryController.addCategory);

module.exports = router;
