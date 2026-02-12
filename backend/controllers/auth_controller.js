import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {

      if (err) {
        console.error("Insert Error:", err);
        return res.status(400).json({ message: "User already exists" });
      }

      res.json({ message: "User registered successfully" });
    }
  );
};


// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {

      if (err || results.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // 🔥 CREATE SESSION
      req.session.userId = user.id;
      req.session.userName = user.name;

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }
  );
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
};
