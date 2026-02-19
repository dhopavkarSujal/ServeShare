import db from "../config/db.js";


// =======================================
// ✅ USER - ADD DONATION
// =======================================
export const addDonation = async (req, res) => {
  const { title, description, quantity, location } = req.body;

  if (!title || !description || !quantity || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      `INSERT INTO donations 
       (user_id, title, description, quantity, location, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [req.session.userId, title, description, quantity, location]
    );

    res.json({ message: "Donation submitted successfully" });

  } catch (err) {
    console.error("Add Donation Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// =======================================
// ✅ USER - FETCH OWN DONATIONS
// =======================================
export const fetchDonations = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM donations 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.session.userId]
    );

    res.json(rows);

  } catch (err) {
    console.error("Fetch Donation Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// =======================================
// ✅ ADMIN - APPROVE DONATION
// =======================================
export const approveDonation = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `UPDATE donations 
       SET status = 'approved' 
       WHERE id = ?`,
      [id]
    );

    res.json({ message: "Donation approved successfully" });

  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// =======================================
// ✅ NGO - CLAIM DONATION
// =======================================
export const claimDonation = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if already claimed
    const [existing] = await db.query(
      "SELECT status FROM donations WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (existing[0].status !== "approved") {
      return res.status(400).json({ message: "Donation not available to claim" });
    }

    // Update donation status
    await db.query(
      `UPDATE donations 
       SET status = 'claimed' 
       WHERE id = ?`,
      [id]
    );

    res.json({ message: "Donation claimed successfully" });

  } catch (err) {
    console.error("Claim Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
