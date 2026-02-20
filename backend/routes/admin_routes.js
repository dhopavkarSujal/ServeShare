import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/auth_middleware.js";
import { authorizeRoles } from "../middleware/role_middleware.js";

const router = express.Router();

// 🔹 Get All Users
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT id, name, email, role FROM users"
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔹 Update User Role
router.put(
  "/users/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    const { role } = req.body;

    try {
      await db.query(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, req.params.id]
      );
      res.json({ message: "Role updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;