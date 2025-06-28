const mongoose = require("mongoose");

const layerSchema = new mongoose.Schema({
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }]
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2 },
  description: { type: String, required: true },
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  preparationTime: { type: Number, required: true, min: 1 },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  imageUrl: { type: String },
  isPrivate: { type: Boolean, default: false },
  category: { type: String, required: true },
  layers: [layerSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);
