import express from "express";
import { login, register, logout } from "../controllers/auth_controller.js";
import authMiddleware from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", authMiddleware, (req, res) => {
  res.json({ loggedIn: true });
});

export default router;
