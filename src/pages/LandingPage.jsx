import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../config/context/ThemeContext";
import ServeShareLogo from "../components/ServeShareLogo";
import "../css/LandingPage.css";
import {
  Sun,
  Moon,
  User,
  Heart,
  MapPin,
  ChevronRight,
  Star,
  Building2,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll reveal effect
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="landing-page" style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Sticky Navbar ── */}
      <nav
        className="landing-navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 32px",
          height: 60,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
        className="dark-nav"
      >
        <style>{`.dark-nav { background: rgba(11,15,12,0.85) !important; } body:not(.dark) .dark-nav { background: rgba(255,255,255,0.85) !important; }`}</style>

        <ServeShareLogo onClick={() => navigate("/")} />

        <div className="landing-navbar-spacer" style={{ flex: 1 }} />

        <div className="landing-nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Home", "How It Works", "NGOs", "About", "Contact"].map((l, i) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: i === 0 ? "var(--primary)" : "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseLeave={(e) => {
                if (i !== 0) e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {l}
            </a>
          ))}
        </div>

        <div className="landing-nav-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={toggleTheme}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? (
              <Sun size={15} style={{ color: "#FCD34D" }} />
            ) : (
              <Moon size={15} style={{ color: "var(--text-secondary)" }} />
            )}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <User size={14} /> Sign In
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="hero-bg landing-hero"
        style={{ padding: "80px 32px 100px", position: "relative", overflow: "hidden" }}
      >
        {/* Floating orbs */}
        <div
          className="float-a"
          style={{
            position: "absolute",
            top: "10%",
            right: "8%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="float-b"
          style={{
            position: "absolute",
            bottom: "5%",
            left: "5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(5,150,105,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="landing-hero-grid"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: "var(--primary-light)",
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              <div
                className="pulse"
                style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--primary)" }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>
                10,000+ donors making a difference daily
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(42px, 5vw, 62px)",
                fontWeight: 700,
                color: "var(--text)",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                marginBottom: 20,
              }}
            >
              Share More.
              <br />
              <span className="gradient-text serif" style={{ fontStyle: "italic" }}>
                Care More.
              </span>
            </h1>

            <p
              style={{
                fontSize: 17,
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 460,
                marginBottom: 36,
              }}
            >
              ServeShare connects generous donors with verified NGOs and communities in need. Your small act of kindness creates a lasting impact.
            </p>

            <div className="landing-hero-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/register")}
                className="btn-primary"
                style={{ padding: "14px 28px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}
              >
                <Heart size={16} fill="currentColor" /> Donate Now
              </button>

              <button
                className="btn-ghost"
                style={{ padding: "14px 28px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}
                onClick={() => navigate("/register")}
              >
                <MapPin size={15} /> Find NGOs Nearby
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 36 }}>
              <div style={{ display: "flex" }}>
                {["🧑", "👩", "👨", "👱"].map((e, i) => (
                  <div
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--primary-light)",
                      border: "2px solid var(--bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      marginLeft: i > 0 ? -8 : 0,
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Joined by <strong style={{ color: "var(--text)" }}>10,000+</strong> people making a difference
              </p>
            </div>
          </div>

          {/* Hero visual */}
          <div className="landing-hero-visual" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div
              className="float-c"
              style={{
                width: 320,
                height: 320,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(5,150,105,0.08) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(22,163,74,0.2)",
              }}
            >
              <div style={{ fontSize: 110 }}>📦</div>
            </div>

            {/* Floating cards */}
            <div
              className="card float-a"
              style={{
                position: "absolute",
                top: 20,
                right: -20,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✅
              </div>
              <div>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Donation Completed</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Food Packets · 2 items</p>
              </div>
            </div>

            <div
              className="card float-b"
              style={{
                position: "absolute",
                bottom: 30,
                left: -20,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 28 }}>💚</div>
              <div>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Lives Impacted</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--primary)" }}>75,000+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section
        className="landing-stats"
        style={{
          padding: "40px 32px",
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="landing-stats-grid"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
          }}
        >
          {[
            { icon: "🎁", val: "15,000+", label: "Happy Donors" },
            { icon: "🏛️", val: "850+", label: "Verified NGOs" },
            { icon: "📦", val: "45,000+", label: "Donations Delivered" },
            { icon: "👥", val: "75,000+", label: "Lives Impacted" },
          ].map((s, i) => (
            <div key={s.label} className="reveal" style={{ textAlign: "center", transitionDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{s.icon}</div>
              <p style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.04em" }}>{s.val}</p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="landing-features" style={{ padding: "80px 32px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--primary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              What We Offer
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.03em",
              }}
            >
              Everything you need to <span className="gradient-text serif" style={{ fontStyle: "italic" }}>give back</span>
            </h2>
          </div>

          <div className="landing-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { icon: "🎁", title: "Donate Items", desc: "Donate food, clothes, books and other essentials in seconds.", color: "#16A34A" },
              { icon: "🏢", title: "Find NGOs", desc: "Discover and connect with verified NGOs near you instantly.", color: "#3B82F6" },
              { icon: "🚚", title: "Track Impact", desc: "Monitor your donations and see the real-time impact you create.", color: "#F59E0B" },
              { icon: "👥", title: "Volunteer", desc: "Join hands with us and volunteer your time for a better world.", color: "#8B5CF6" },
            ].map((c, i) => (
              <div
                key={c.title}
                className="card card-hover reveal"
                style={{ padding: 24, transitionDelay: `${i * 0.1}s`, cursor: "pointer" }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${c.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 14,
                  }}
                >
                  {c.icon}
                </div>
                <h3 style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6, fontSize: 16 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
                <a
                  href="#"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: c.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    textDecoration: "none",
                  }}
                >
                  Learn more <ChevronRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="landing-steps" style={{ padding: "80px 32px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--primary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Simple Process
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.03em",
              }}
            >
              How <span className="gradient-text serif" style={{ fontStyle: "italic" }}>ServeShare</span> Works
            </h2>
          </div>

          <div className="landing-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, position: "relative" }}>
            {[
              { num: "01", icon: "📦", title: "Choose to Donate", desc: "Select items you want to donate and submit your listing." },
              { num: "02", icon: "📍", title: "We Connect", desc: "We match your donation to the nearest verified NGOs." },
              { num: "03", icon: "🚛", title: "Pick & Deliver", desc: "NGOs arrange pickup and deliver to those in need." },
              { num: "04", icon: "💝", title: "Create Impact", desc: "Your kindness creates real smiles and measurable change." },
            ].map((s, i) => (
              <div key={s.num} className="reveal" style={{ textAlign: "center", transitionDelay: `${i * 0.15}s` }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "var(--primary-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 24,
                      height: 24,
                      background: "var(--primary)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {s.num.slice(1)}
                  </div>
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", letterSpacing: "0.1em", marginBottom: 6 }}>
                  {s.num}
                </p>
                <h3 style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6, fontSize: 15 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact + Testimonial ── */}
      <section className="landing-impact" style={{ padding: "80px 32px", background: "var(--bg)" }}>
        <div className="landing-impact-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "start" }}>
          <div className="reveal">
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--primary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Our Impact
            </p>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 8 }}>
              Small Actions,
              <br />
              <span className="gradient-text serif" style={{ fontStyle: "italic" }}>Big Change</span>
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
              Together our community has delivered essential items to thousands of families across Telangana, creating real, measurable change.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "🥗", val: "18,500+", label: "Food Packets Distributed", color: "#16A34A" },
                { icon: "👕", val: "22,000+", label: "Clothes Donated", color: "#F59E0B" },
                { icon: "📚", val: "8,000+", label: "Books Donated", color: "#3B82F6" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${s.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 18, letterSpacing: "-0.03em" }}>{s.val}</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/register")} className="btn-primary" style={{ marginTop: 28, padding: "13px 24px" }}>
              Learn More About Us
            </button>
          </div>

          <div className="card reveal" style={{ padding: 36 }}>
            <div style={{ fontSize: 52, color: "var(--primary)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 16, opacity: 0.6 }}>
              "
            </div>
            <p
              style={{
                fontSize: 18,
                color: "var(--text)",
                lineHeight: 1.7,
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                marginBottom: 28,
              }}
            >
              ServeShare made it so easy to donate and see my contribution reaching the right people. I feel genuinely happy knowing I'm part of this change.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👩</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Priya Sharma</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Regular Donor · Hyderabad</p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} style={{ color: "#F59E0B" }} fill="#F59E0B" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="landing-cta"
        style={{
          margin: "0 32px 80px",
          borderRadius: 28,
          background: "linear-gradient(135deg, #15803D 0%, #059669 100%)",
          padding: "52px 52px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: 200,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div className="landing-cta-inner" style={{ position: "relative", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ fontSize: 60 }}>🤲</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: 6 }}>
              Ready to make a difference?
            </h3>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)" }}>Your kindness can change someone's tomorrow. Start today.</p>
          </div>
          <div className="landing-cta-actions" style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "#fff",
                color: "#15803D",
                border: "none",
                borderRadius: 12,
                padding: "13px 24px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Heart size={15} fill="currentColor" /> Donate Now
            </button>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "transparent",
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.5)",
                borderRadius: 12,
                padding: "13px 24px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Building2 size={15} /> Register as NGO
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer" style={{ background: "#0D1117", color: "#9CA3AF", padding: "56px 32px 32px" }}>
        <div className="landing-footer-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr", gap: 40 }}>
          <div>
            <ServeShareLogo size="sm" />
            <p style={{ fontSize: 13, lineHeight: 1.7, marginTop: 14, maxWidth: 240 }}>
              ServeShare connects donors with NGOs to help communities in need. Together, we build a better world.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              {["f", "𝕏", "in", "📸"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#1A2332",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9CA3AF",
                    textDecoration: "none",
                    fontSize: 13,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#16A34A")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#1A2332")}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Platform", links: ["How It Works", "NGO Directory", "Donate Items", "Track Impact"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
            { title: "Support", links: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Use"] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{ color: "#F9FAFB", fontWeight: 600, marginBottom: 14, fontSize: 13 }}>{col.title}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontSize: 13,
                        color: "#9CA3AF",
                        textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#F9FAFB")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p style={{ color: "#F9FAFB", fontWeight: 600, marginBottom: 14, fontSize: 13 }}>Contact</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
              <p>📞 +91 98765 43210</p>
              <p>✉️ support@serveshare.com</p>
              <p>📍 Hyderabad, India</p>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1100,
            margin: "40px auto 0",
            paddingTop: 24,
            borderTop: "1px solid #1F2937",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12 }}>© 2025 ServeShare. All rights reserved.</p>
          <p style={{ fontSize: 12 }}>Built with care for a better world.</p>
        </div>
      </footer>
    </div>
  );
}