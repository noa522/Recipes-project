const RecipeModel = require("../models/Recipe");
const CategoryModel = require("../models/Category");

// שליפה של כל המתכונים
exports.getAllRecipes = async (req, res) => {
  try {
const recipes = await RecipeModel.find({ isPrivate: false }).populate("createdBy", "username");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes", detail: err.message });
  }
};


// יצירת מתכון חדש כולל קטגוריה אוטומטית
exports.createRecipe = async (req, res) => {
  try {
    const { category } = req.body;

    if (category) {
      const existingCategory = await CategoryModel.findOne({ name: category });

      if (!existingCategory) {
        await new CategoryModel({
          code: category.toUpperCase().replace(/\s/g, "_"),
          name: category,
          description: `קטגוריה אוטומטית עבור מתכוני ${category}`,
          recipeCount: 1
        }).save();
      } else {
        await CategoryModel.updateOne(
          { _id: existingCategory._id },
          { $inc: { recipeCount: 1 } }
        );
      }
    }

    const recipe = new RecipeModel({
      ...req.body,
      createdBy: req.user._id
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Failed to create recipe", detail: err.message });
  }
};

// שליפת מתכונים לפי קטגוריה
exports.getRecipesByCategory = async (req, res) => {
  const { categoryName } = req.params;

  try {
    const recipes = await RecipeModel.find({ category: categoryName });

    if (recipes.length === 0) {
      return res.status(404).json({
        error: { message: `No recipes found in category '${categoryName}'` }
      });
    }

    res.json(recipes);
  } catch (err) {
    res.status(500).json({
      error: { message: "Failed to fetch recipes by category", detail: err.message }
    });
  }
};

// שליפת מתכון לפי ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id).populate("createdBy", "username");
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Error fetching recipe", detail: err.message });
  }
};

// שליפת מתכונים לפי זמן הכנה
exports.getRecipesByPrepTime = async (req, res) => {
  const maxMinutes = parseInt(req.query.maxMinutes);
  if (isNaN(maxMinutes)) {
    return res.status(400).json({ error: "Missing or invalid maxMinutes query parameter" });
  }

  try {
    const recipes = await RecipeModel.find({ preparationTime: { $lte: maxMinutes } });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching recipe", detail: err.message });
  }
};

// עדכון מתכון
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized to update this recipe" });
    }

    const updated = await RecipeModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update recipe", detail: err.message });
  }
};

// מחיקת מתכון
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user._id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized to delete this recipe" });
    }

    await recipe.deleteOne();
    res.json({ msg: "Recipe deleted", recipeId: recipe._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete recipe", detail: err.message });
  }
};

// שליפת מתכונים של המשתמש המחובר
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find({ createdBy: req.user._id });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user's recipes", detail: err.message });
  }
};
