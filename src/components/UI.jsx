// src/components/UI.jsx

export function Pill({ children, type = "green" }) {
  const colors = {
    green: {
      bg: "rgba(201,255,59,0.14)",
      color: "var(--accent)",
    },
    blue: {
      bg: "rgba(90,178,255,0.14)",
      color: "var(--blue)",
    },
    orange: {
      bg: "rgba(255,182,72,0.14)",
      color: "var(--orange)",
    },
    red: {
      bg: "rgba(255,95,95,0.14)",
      color: "var(--red)",
    },
    gray: {
      bg: "rgba(255,255,255,0.08)",
      color: "var(--muted)",
    },
  };

  const style = colors[type] || colors.green;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 9px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        background: style.bg,
        color: style.color,
      }}
    >
      {children}
    </span>
  );
}

export function ScoreBar({ value = 0 }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  const color =
    safeValue >= 75
      ? "var(--accent)"
      : safeValue >= 50
      ? "var(--orange)"
      : "var(--red)";

  return (
    <div style={{ minWidth: 90 }}>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${safeValue}%`,
            height: "100%",
            background: color,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        {safeValue.toFixed(0)}
      </div>
    </div>
  );
}

export function ProgressBar({ label, value = 0, color = "var(--accent)" }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          gap: 12,
        }}
      >
        <span className="muted">{label}</span>
        <strong>{safeValue.toFixed(0)}%</strong>
      </div>

      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${safeValue}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
          }}
        />
      </div>
    </div>
  );
}