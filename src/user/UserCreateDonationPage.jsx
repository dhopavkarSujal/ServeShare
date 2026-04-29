import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/UserPages.css";

import { useAuth } from "../config/context/AuthContext";
import { donationService } from "../config/services/donationService";
import { ngoService } from "../config/services/ngoService";
import { activityService } from "../config/services/activityService";
import { notificationService } from "../config/services/notificationService";

const CATEGORY_OPTIONS = [
  "Food",
  "Clothes",
  "Books",
  "Blankets",
  "Hygiene",
  "Stationery",
  "Other",
];

export default function UserCreateDonationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [ngos, setNgos] = useState([]);
  const [loadingNGOs, setLoadingNGOs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    ngo_id: "",
    item_name: "",
    category: "Food",
    quantity: 1,
  });

  // Step 1: Load NGOs
  useEffect(() => {
    let mounted = true;

    const loadNGOs = async () => {
      setLoadingNGOs(true);
      setError("");

      const { ngos: rows } = await ngoService.getApprovedNGOs();

      if (!mounted) return;

      setNgos(rows || []);
      setLoadingNGOs(false);
    };

    loadNGOs();

    return () => {
      mounted = false;
    };
  }, []);

  // Step 2: Pre-select NGO from URL parameter if provided
  useEffect(() => {
    const ngoIdParam = searchParams.get("ngo_id");
    if (ngoIdParam) {
      console.log("Pre-selecting NGO from URL:", ngoIdParam);
      setForm((prev) => ({
        ...prev,
        ngo_id: ngoIdParam,
      }));
    }
  }, [searchParams]);

  const selectedNgo = useMemo(
    () => ngos.find((ngo) => ngo.id === form.ngo_id),
    [ngos, form.ngo_id]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.id) {
      setError("User session not found. Please login again.");
      return;
    }

    if (!form.item_name.trim()) {
      setError("Please enter an item name.");
      return;
    }

    if (!form.quantity || form.quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    setSubmitting(true);

    const { donation, error: submitError } = await donationService.addDonation({
      donor_id: user.id,
      ngo_id: form.ngo_id || null,
      item_name: form.item_name.trim(),
      category: form.category,
      quantity: Number(form.quantity),
    });

    setSubmitting(false);

    if (submitError) {
      setError(submitError);
      return;
    }

    setSuccess(`Donation created successfully${donation?.id ? ` (ID: ${donation.id})` : ""}.`);

    // 📝 Optional: Log donation creation (non-blocking)
    try {
      await activityService.createLog({
        user_id: user.id,
        action: "Donation Created",
        description: `${form.item_name} (${form.category})`,
        entity_type: "donation",
        entity_id: donation?.id,
      });
    } catch (logErr) {
      // Silent fail - logging shouldn't break donation flow
      console.error("Activity log failed:", logErr);
    }

    // 📲 Optional: Create notification (non-blocking, guarded by user.id check above)
    try {
      if (user?.id) {
        await notificationService.createNotification(
          "Donation Submitted",
          `Your ${form.category} donation (${form.quantity} items) has been submitted successfully.`,
          "success",
          user.id
        );
      }
    } catch (notifErr) {
      // Silent fail - notification shouldn't break donation flow
      console.error("Notification creation failed:", notifErr);
    }

    setForm({
      ngo_id: "",
      item_name: "",
      category: "Food",
      quantity: 1,
    });

    setTimeout(() => {
      navigate("/user/donations", { replace: true });
    }, 900);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>New Donation</h1>
          <p>Select an NGO and submit your donation</p>
        </div>

        <button
          type="button"
          className="btn-green"
          onClick={() => navigate("/user/donations")}
        >
          Back to Donations
        </button>
      </div>

      <div className="glass-card" style={{ marginTop: 20, padding: 24 }}>
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(239,68,68,0.12)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(34,197,94,0.12)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="field-label">Select NGO <span style={{ color: "#9ca3af" }}>(Optional)</span></label>
              <select
                name="ngo_id"
                value={form.ngo_id}
                onChange={handleChange}
                className="input-field"
                disabled={loadingNGOs}
              >
                <option value="">
                  {loadingNGOs ? "Loading NGOs..." : "No NGO (Admin will assign)"}
                </option>
                {ngos.map((ngo) => (
                  <option key={ngo.id} value={ngo.id}>
                    {ngo.name} {ngo.city ? `(${ngo.city})` : ""}
                  </option>
                ))}
              </select>

              {ngos.length === 0 && !loadingNGOs && (
                <p style={{ color: "#f59e0b", marginTop: 8, fontSize: 14 }}>
                  ⚠️ No NGOs available. Admin will assign an NGO later.
                </p>
              )}
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              {selectedNgo && (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.18)",
                  }}
                >
                  <strong>{selectedNgo.name}</strong>
                  <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
                    {selectedNgo.location}
                    {selectedNgo.city ? `, ${selectedNgo.city}` : ""}
                  </div>
                  {selectedNgo.categories?.length > 0 && (
                    <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
                      Categories: {selectedNgo.categories.join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="field-label">Item Name</label>
              <input
                type="text"
                name="item_name"
                value={form.item_name}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Rice Bags"
                required
              />
            </div>

            <div>
              <label className="field-label">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div style={{ display: "flex", alignItems: "end", gap: 12 }}>
              <button
                type="submit"
                className="btn-green"
                disabled={submitting || loadingNGOs}
                style={{ width: "100%" }}
              >
                {submitting ? "Submitting..." : "Submit Donation"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
