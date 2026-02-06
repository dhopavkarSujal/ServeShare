import { useState } from "react";
import "../css/addDonationModal.css";

const AddDonationModal = ({ onClose }) => {
  const [donationType, setDonationType] = useState("");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>

        <h2 className="modal-title">Add Donation</h2>
        <p className="modal-subtitle">
          Select type and fill required details
        </p>

        <form>
          <div className="form-group">
            <label>Donation Type</label>
            <select
              value={donationType}
              onChange={(e) => setDonationType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="Food">Food</option>
              <option value="Clothes">Clothes</option>
              <option value="Books">Books & Stationery</option>
              <option value="Funds">Funds</option>
            </select>
          </div>

          {/* -------- Dynamic Fields -------- */}
          {donationType === "Food" && (
            <div className="form-group">
              <label>Food Quantity</label>
              <input type="text" placeholder="Eg: 10 meals" />
            </div>
          )}

          {donationType === "Funds" && (
            <div className="form-group">
              <label>Amount</label>
              <input type="number" placeholder="Enter amount" />
            </div>
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Write a short note..."></textarea>
          </div>

          <button type="submit" className="btn-submit">
            Add Donation
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDonationModal;
