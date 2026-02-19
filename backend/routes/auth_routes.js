import express from "express";
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

export default router;
