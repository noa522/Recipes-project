const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { userRegisterSchema, userLoginSchema } = require("../validations/userValidation");

exports.testRoute = (req, res) => {
  res.send("✅ users route is working!");
};

exports.registerUser = async (req, res) => {
  const { error } = userRegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: { message: error.details[0].message }
    });
  }

  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUser = new UserModel({ ...req.body, password: hashedPass });
    await newUser.save();

    res.status(201).json({
      msg: "User created",
      userId: newUser._id
    });

  } catch (err) {
    // בדיקת שגיאה מסוג E11000 = duplicate key במונגו
    if (err.code === 11000) {
      return res.status(409).json({
        error: {
          message: "Email or username already exists",
          detail: err.message
        }
      });
    }

    // שגיאה כללית
    res.status(500).json({
      error: {
        message: "Registration failed",
        detail: err.message
      }
    });
  }
};

exports.loginUser = async (req, res) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: { message: "Invalid email or password" } });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).json({ error: { message: "Invalid email or password" } });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: { message: "Login failed", detail: err.message } });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: { message: "Failed to get users", detail: err.message } });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: { message: "User not found" } });
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: { message: "Delete failed", detail: err.message } });
  }
};

exports.updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: { message: "Password must be at least 6 characters" } });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(req.user._id, { password: hashed });
    res.json({ msg: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: { message: "Password update failed", detail: err.message } });
  }
};


