import { useEffect, useState } from "react";
import "../css/UserPages.css";
import { useAuth } from "../config/context/AuthContext";
import { supportService } from "../config/services/supportService";

export default function UserHelpPage() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    category: "General",
    message: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      console.log("Loading support data for user:", user.id);

      const { tickets: myTickets, error: ticketsError } = await supportService.getMyTickets(user.id);
      const { faqs: faqsData, error: faqsError } = await supportService.getFAQs();
      const { contact: contactInfo, error: contactError } = await supportService.getSupportInfo();

      if (ticketsError) console.error("Error loading tickets:", ticketsError);
      if (faqsError) console.error("Error loading FAQs:", faqsError);
      if (contactError) console.error("Error loading contact:", contactError);

      setTickets(myTickets || []);
      setFaqs(faqsData || []);
      setContact(contactInfo || {});

      setLoading(false);
    };

    loadData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.subject.trim() || !form.message.trim()) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    const { error: submitError } = await supportService.createTicket({
      user_id: user.id,
      subject: form.subject,
      category: form.category,
      message: form.message,
      status: "open",
    });

    setSubmitting(false);

    if (submitError) {
      setError(submitError);
      return;
    }

    setMessage("✓ Ticket submitted successfully! We'll get back to you soon.");

    setForm({
      subject: "",
      category: "General",
      message: "",
    });

    // Reload tickets
    const { tickets: updated } = await supportService.getMyTickets(user.id);
    setTickets(updated || []);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#3b82f6";
      case "in-progress":
        return "#f59e0b";
      case "resolved":
        return "#10b981";
      case "closed":
        return "#6b7280";
      default:
        return "#9ca3af";
    }
  };

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Help & Support</h1>
          <p>We're here to help. Submit a ticket or check our FAQs</p>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="glass-card" style={{ marginTop: 20, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>📞 Contact Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 12 }}>
          <div>
            <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 4 }}>Email Support</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              {contact?.support_email || "support@serveshare.com"}
            </p>
          </div>
          <div>
            <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 4 }}>Phone Support</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              {contact?.support_phone || "+91 XXXXX XXXXX"}
            </p>
          </div>
        </div>
      </div>

      {/* SUBMIT TICKET FORM */}
      <div className="glass-card" style={{ marginTop: 20, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>✉️ Submit a Support Ticket</h3>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              background: "rgba(239,68,68,0.12)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.25)",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              background: "rgba(34,197,94,0.12)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.25)",
              fontSize: 14,
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#ddd" }}>
                Subject *
              </label>
              <input
                className="search-bar"
                placeholder="Brief description of your issue"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#ddd" }}>
                Category *
              </label>
              <select
                className="search-bar"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                disabled={submitting}
                style={{ cursor: submitting ? "not-allowed" : "pointer" }}
              >
                <option>General</option>
                <option>Donation</option>
                <option>NGO</option>
                <option>Account</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#ddd" }}>
                Message *
              </label>
              <textarea
                className="search-bar"
                placeholder="Describe your issue in detail..."
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                disabled={submitting}
                style={{
                  resize: "vertical",
                  fontFamily: "inherit",
                  cursor: submitting ? "not-allowed" : "text",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-green"
              disabled={submitting}
              style={{
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>

      {/* MY TICKETS */}
      <div className="glass-card" style={{ marginTop: 20, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>🎫 My Support Tickets</h3>

        {loading ? (
          <p style={{ color: "#9ca3af" }}>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No support tickets yet. Submit one above to get help!</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {tickets.map((t, idx) => (
              <div
                key={t.id}
                style={{
                  padding: 12,
                  borderLeft: `4px solid ${getStatusColor(t.status)}`,
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 6,
                  borderBottom: idx < tickets.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600 }}>{t.subject}</h4>
                    <p
                      style={{
                        margin: "4px 0",
                        color: "#9ca3af",
                        fontSize: 13,
                      }}
                    >
                      {t.message}
                    </p>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, marginTop: 8 }}>
                      <span style={{ color: "#6b7280" }}>
                        Category: <strong>{t.category}</strong>
                      </span>
                      <span style={{ color: "#6b7280" }}>
                        {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: getStatusColor(t.status) + "20",
                      color: getStatusColor(t.status),
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="glass-card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>❓ Frequently Asked Questions</h3>

        {faqs.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No FAQs available at the moment.</p>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {faqs.map((f, idx) => (
              <div
                key={f.id}
                style={{
                  paddingBottom: idx < faqs.length - 1 ? 16 : 0,
                  borderBottom: idx < faqs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "#fff" }}>
                  {f.question}
                </h4>
                <p style={{ margin: 0, color: "#9ca3af", lineHeight: 1.6, fontSize: 14 }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}