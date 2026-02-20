import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET all NGOs
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ngos ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch NGOs" });
  }
});

export default router;