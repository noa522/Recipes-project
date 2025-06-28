const Category = require("../models/Category");
const { categorySchema } = require("../validations/categoryValidation");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: { message: "Failed to fetch categories", detail: err.message } });
  }
};

exports.getCategoryByCode = async (req, res) => {
  try {
    const category = await Category.findOne({ code: req.params.code });
    if (!category) {
      return res.status(404).json({ error: { message: "Category not found" } });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: { message: "Fetch failed", detail: err.message } });
  }
};

exports.addCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: { message: error.details[0].message } });
  }

  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({ msg: "Category created", categoryId: newCategory._id });
  } catch (err) {
    res.status(500).json({ error: { message: "Creation failed", detail: err.message } });
  }
};
