const SystemStats = require("../models/SystemStats");
const Category = require("../models/Category");

exports.updateTotalCategories = async () => {
  const count = await Category.countDocuments();
  await SystemStats.findOneAndUpdate(
    {},
    { totalCategories: count },
    { upsert: true, new: true }
  );
};
