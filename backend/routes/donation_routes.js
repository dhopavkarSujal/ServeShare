import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/auth_middleware.js";
import { authorizeRoles } from "../middleware/role_middleware.js";

const router = express.Router();


// 🔹 Add Donation (User)
router.post("/", authMiddleware, async (req, res) => {
  const { donationType, quantity, amount, description, expiryDate } = req.body;

  try {
    await db.query(
      `INSERT INTO donations 
      (user_id, donation_type, quantity, amount, description, expiry_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        req.session.userId,
        donationType,
        quantity || null,
        amount || null,
        description,
        expiryDate || null
      ]
    );

    res.json({ message: "Donation submitted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 Get Pending Donations (Admin)
router.get(
  "/pending",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    const [rows] = await db.query(
      "SELECT * FROM donations WHERE status='pending'"
    );
    res.json(rows);
  }
);


// 🔹 Approve Donation
router.put(
  "/approve/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    const donationId = req.params.id;

    // Get donation owner
    const [[donation]] = await db.query(
      "SELECT user_id FROM donations WHERE id=?",
      [donationId]
    );

    // Update donation
    await db.query(
      "UPDATE donations SET status='approved' WHERE id=?",
      [donationId]
    );

    // Insert notification
    await db.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [donation.user_id, "Your donation has been approved 🎉"]
    );

    res.json({ message: "Donation approved" });
  }
);

// 🔹 Reject Donation
router.put(
  "/reject/:id",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    const donationId = req.params.id;

    const [[donation]] = await db.query(
      "SELECT user_id FROM donations WHERE id=?",
      [donationId]
    );

    await db.query(
      "UPDATE donations SET status='rejected' WHERE id=?",
      [donationId]
    );

    await db.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [donation.user_id, "Your donation was rejected ❌"]
    );

    res.json({ message: "Donation rejected" });
  }
);

// 🔹 Get Logged-in User Donations
router.get(
  "/my",
  authMiddleware,
  async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC",
        [req.session.userId]
      );

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;