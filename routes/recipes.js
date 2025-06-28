const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { verifyToken } = require("../middleware/auth");

router.get("/", recipeController.getAllRecipes);
router.post("/", verifyToken, recipeController.createRecipe);
router.get("/prep-time", recipeController.getRecipesByPrepTime);
router.get("/by-category/:categoryName", recipeController.getRecipesByCategory);
router.get("/recipes", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);
router.put("/:id", verifyToken, recipeController.updateRecipe);
router.delete("/:id", verifyToken, recipeController.deleteRecipe);




module.exports = router;
