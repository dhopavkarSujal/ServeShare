import express from "express";
import db from "../config/db.js";
import { login, register, logout } from "../controllers/auth_controller.js";
import authMiddleware from "../middleware/auth_middleware.js";

const router = express.Router();

// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Session Check
router.get("/check", authMiddleware, (req, res) => {
  res.json({
    loggedIn: true,
    user: {
      id: req.session.userId,
      name: req.session.userName,
      role: req.session.userRole
    }
  });
});

router.get("/notifications", authMiddleware, async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC",
    [req.session.userId]
  );

  res.json(rows);
});
export default router;
