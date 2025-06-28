const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");


router.get("/test", userController.testRoute);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// פעולות נוספות
router.get("/", verifyToken, isAdmin, userController.getAllUsers);
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);
router.patch("/update-password", verifyToken, userController.updatePassword);

module.exports = router;
