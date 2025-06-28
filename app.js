require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const RecipeModel = require("./models/Recipe"); // Import the Recipe model for testing

const app = express();

// 🛡️ אבטחה
app.use(helmet());

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🔗 חיבור למסלולים
const userRoutes = require("./routes/users");
const recipeRoutes = require("./routes/recipes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

// 🗄️ חיבור למסד נתונים
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 🔍 ברירת מחדל לשורש
app.get("/", (req, res) => {
  res.json({ message: "🍽️ API is up and running", timestamp: new Date() });
});

// ❌ טיפול בשגיאות כלליות
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({
    error: {
      message: err.message || "Something went wrong!",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    }
  });
});

// 🧭 טיפול בנתיבים לא קיימים
app.use("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      availableRoutes: [
        "/api/users/test",
        "/api/users/register",
        "/api/users/login",
        "/api/recipes",
        "/api/recipes/:id",
        "/api/recipes/prep-time?maxMinutes=..."
      ]
    }
  });
});

// 🚀 הפעלת השרת
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});
