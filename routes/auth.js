import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ✅ Signup Route
router.post("/signup", async (req, res) => {
    try {
      console.log("📢 Signup Request Received:", req.body); // ✅ Log incoming request
  
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "❌ Email and password are required" });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "❌ User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
  
      console.log("✅ User registered successfully!");
      res.json({ message: "✅ User registered successfully!" });
    } catch (error) {
      console.error("❌ Signup Error:", error);
      res.status(500).json({ message: "❌ Error during signup", error: error.message });
    }
  });
  

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "❌ User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "❌ Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router; // ✅ Correct export
