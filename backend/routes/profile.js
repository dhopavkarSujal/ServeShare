import express from "express";
import { upload } from "../middleware/upload.js";
import db from "../config/db.js";

const router = express.Router();

// GET profile
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  res.json(rows[0]);
});

// UPDATE profile
router.put("/:id", upload.single("profile_image"), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      address,
      city,
      state,
      pincode
    } = req.body;

    let imagePath = null;

    if (req.file) {
      imagePath = req.file.filename;
    }

    await db.query(
      `
      UPDATE users
      SET 
        name = ?,
        phone = ?,
        address = ?,
        city = ?,
        state = ?,
        pincode = ?,
        profile_image = COALESCE(?, profile_image)
      WHERE id = ?
      `,
      [name, phone, address, city, state, pincode, imagePath, id]
    );

    const [updatedUser] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    res.json(updatedUser[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Profile update failed" });
  }
});

export default router;