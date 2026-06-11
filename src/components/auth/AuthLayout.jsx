import { BarChart2, Eye, EyeOff, Gift, ShieldCheck } from "lucide-react";

const layoutCopy = {
  login: {
    headline: "Together, we can make a difference",
    description:
      "ServeShare connects generous hearts with those who need support the most.",
    illustration: "/images/login-img.png",
    panelClass: "auth-login-card",
    mobileTitle: "Welcome back",
    mobileSubtitle: "Login to continue your journey",
  },
  register: {
    headline: "Start your journey of kindness",
    description: "Create an account and start making a difference today.",
    illustration: "/images/register-img.png",
    panelClass: "auth-register-card",
    mobileTitle: "Create Account",
    mobileSubtitle: "Join ServeShare",
  },
};

const features = [
  {
    icon: ShieldCheck,
    title: "Verified NGOs",
    description: "Work only with trusted and verified organizations.",
  },
  {
    icon: Gift,
    title: "Easy Donations",
    description: "Donate essentials in just a few clicks.",
  },
  {
    icon: BarChart2,
    title: "Track Impact",
    description: "See how your kindness is creating real change.",
  },
];

export default function AuthLayout({ variant = "login", children }) {
  const copy = layoutCopy[variant] || layoutCopy.login;

  return (
    <div className="auth-page">
      <div className={`card page-enter auth-card ${copy.panelClass}`}>
        <section className="auth-left">
          <div className="auth-orb auth-orb-top" />
          <div className="auth-orb auth-orb-bottom" />

          <img src="/login-logo.png" alt="ServeShare" className="auth-watermark" aria-hidden="true" />

          <div className="auth-left-content">
            <img src="/register-logo.png" alt="ServeShare" className="auth-brand-logo" />

            <div className="auth-copy-block">
              <h2 className="auth-left-title">{copy.headline}</h2>
              <p className="auth-left-desc">{copy.description}</p>
            </div>

            <div className="auth-feature-list">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="auth-feature-item">
                    <span className="auth-feature-icon">
                      <Icon size={18} />
                    </span>
                    <div>
                      <strong>{feature.title}</strong>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="auth-hero-illustration">
              <img
                src={copy.illustration}
                alt={variant === "login" ? "ServeShare donation mascot" : "ServeShare kindness illustration"}
              />
            </div>
          </div>
        </section>

        <section className="auth-right">
          <div className="auth-mobile-brand">
            <img src="/login-logo.png" alt="ServeShare" className="auth-mobile-logo" />
          </div>

          <div className="auth-form-copy">
            <h2 className="auth-title">{copy.mobileTitle}</h2>
            <p className="auth-subtitle">{copy.mobileSubtitle}</p>
          </div>

          {children}
        </section>
      </div>
    </div>
  );
}

export function AuthRoleTabs({ options, selected, onChange }) {
  return (
    <div className="role-switcher" role="tablist" aria-label="Account role">
      {options.map((role) => {
        const Icon = role.icon;

        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            aria-pressed={selected === role.value}
            className={`role-btn ${selected === role.value ? "active" : ""}`}
          >
            <Icon size={16} />
            <span>{role.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AuthTextField({ label, type = "text", placeholder, icon: Icon, value, onChange, autoComplete, error }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className={`field-shell ${error ? "invalid" : ""}`}>
        {Icon ? (
          <span className="field-icon" aria-hidden="true">
            <Icon size={16} />
          </span>
        ) : null}
        <input
          type={type}
          placeholder={placeholder}
          className="field-input"
          value={value}
          autoComplete={autoComplete}
          required
          onChange={onChange}
        />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function AuthPasswordField({ label, placeholder, showPassword, onToggle, value, onChange, autoComplete, error }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className={`field-shell password-shell ${error ? "invalid" : ""}`}>
        <span className="field-icon" aria-hidden="true">
          <ShieldCheck size={16} />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="field-input"
          value={value}
          autoComplete={autoComplete}
          required
          onChange={onChange}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="password-toggle"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function AuthSocialButton({ provider }) {
  return (
    <button type="button" className="btn-ghost social-btn">
      <span className="social-mark" aria-hidden="true">
        {provider === "Google" ? "G" : "f"}
      </span>
      <span>Continue with {provider}</span>
    </button>
  );
}