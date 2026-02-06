const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const checkUserQuery = "SELECT id FROM users WHERE email = ?";

  db.query(checkUserQuery, [email], async (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUserQuery =
        "INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)";

      db.query(insertUserQuery, [name, email, hashedPassword], (err) => {
        if (err) {
          console.error("INSERT ERROR:", err);
          return res.status(500).json({
            success: false,
            message: "Registration failed",
          });
        }

        return res.status(201).json({
          success: true,
          message: "User registered successfully",
        });
      });
    } catch (error) {
      console.error("HASH ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  const findUserQuery = "SELECT * FROM users WHERE email = ?";

  db.query(findUserQuery, [email], async (err, users) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

      if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret not configured",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
      },
    });
  });
});

module.exports = router;
