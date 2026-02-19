import db from "../config/db.js";

export const createDonation = async (data) => {
  const {
    userId,
    donationType,
    quantity,
    amount,
    description,
    expiryDate,
  } = data;

  const query = `
    INSERT INTO donations 
    (user_id, donation_type, quantity, amount, description, expiry_date, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending')
  `;

  return db.query(query, [
    userId,
    donationType,
    quantity,
    amount,
    description,
    expiryDate,
  ]);
};

export const getAllDonations = async () => {
  const query = `SELECT * FROM donations ORDER BY created_at DESC`;
  return db.query(query);
};
