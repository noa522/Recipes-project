const Joi = require("joi");

// בדיקת תקינות לרכיב בודד
const ingredientSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  amount: Joi.string().min(1).max(20).required(),
  notes: Joi.string().max(100).allow("").optional()
});

// בדיקת תקינות להוראה בודדת
const instructionSchema = Joi.object({
  step: Joi.number().integer().min(1).required(),
  description: Joi.string().min(5).max(500).required(),
  time: Joi.string().max(20).allow("").optional()
});

// בדיקת תקינות ליצירת מתכון חדש
exports.createRecipeSchema = Joi.object({
  // שדות חובה
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  
  // רכיבים - חובה לפחות אחד
  ingredients: Joi.array()
    .items(ingredientSchema)
    .min(1)
    .max(50)
    .required(),
    
  // הוראות - חובה לפחות אחת
  instructions: Joi.array()
    .items(instructionSchema)
    .min(1)
    .max(30)
    .required(),
  
  // זמנים - אופציונלי
  prepTime: Joi.number().integer().min(0).max(1440).optional(), // עד 24 שעות
  cookTime: Joi.number().integer().min(0).max(1440).optional(),
  totalTime: Joi.number().integer().min(0).max(1440).optional(),
  
  // פרטים נוספים
  servings: Joi.number().integer().min(1).max(100).optional(),
  difficulty: Joi.string().valid("קל", "בינוני", "קשה").optional(),
  category: Joi.string().valid("ראשונה", "עיקרית", "קינוח", "שתייה", "חטיף", "אחר").optional(),
  
  // תמונה ותגיות
  image: Joi.string().uri().allow("").optional(),
  tags: Joi.array().items(Joi.string().max(20)).max(10).optional(),
  
  // הגדרות
  isPublic: Joi.boolean().optional()
});

// בדיקת תקינות לעדכון מתכון (כל השדות אופציונליים)
exports.updateRecipeSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(10).max(500).optional(),
  ingredients: Joi.array().items(ingredientSchema).min(1).max(50).optional(),
  instructions: Joi.array().items(instructionSchema).min(1).max(30).optional(),
  prepTime: Joi.number().integer().min(0).max(1440).optional(),
  cookTime: Joi.number().integer().min(0).max(1440).optional(),
  totalTime: Joi.number().integer().min(0).max(1440).optional(),
  servings: Joi.number().integer().min(1).max(100).optional(),
  difficulty: Joi.string().valid("קל", "בינוני", "קשה").optional(),
  category: Joi.string().valid("ראשונה", "עיקרית", "קינוח", "שתייה", "חטיף", "אחר").optional(),
  image: Joi.string().uri().allow("").optional(),
  tags: Joi.array().items(Joi.string().max(20)).max(10).optional(),
  isPublic: Joi.boolean().optional()
});

// בדיקת תקינות לחיפוש
exports.searchRecipeSchema = Joi.object({
  query: Joi.string().max(100).optional(),
  category: Joi.string().valid("ראשונה", "עיקרית", "קינוח", "שתייה", "חטיף", "אחר").optional(),
  difficulty: Joi.string().valid("קל", "בינוני", "קשה").optional(),
  maxTime: Joi.number().integer().min(1).max(1440).optional(),
  tags: Joi.array().items(Joi.string().max(20)).max(5).optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional()
});