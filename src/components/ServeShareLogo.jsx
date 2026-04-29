export default function ServeShareLogo({ size = "md", onClick }) {
  const sizes = {
    sm: 120,
    md: 160,
    lg: 220
  };

  const width = sizes[size] || 160;

  return (
    <div
      onClick={onClick}
      className="logo-horizontal"
      style={{
        cursor: onClick ? "pointer" : "default"
      }}
    >
      {/* Glow background */}
      <div className="logo-glow-horizontal"></div>

      {/* LOGO IMAGE */}
      <img
        src="/logo.png"
        alt="ServeShare"
        style={{
          width: width,
          height: "auto",
          objectFit: "contain",
          zIndex: 2
        }}
      />
    </div>
  );
}