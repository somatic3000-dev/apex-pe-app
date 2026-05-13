export function Pill({ type = "gray", children }) {
  return (
    <span className={`pill pill-${type}`}>
      <span className="dot" />
      {children}
    </span>
  );
}

export function Spinner() {
  return <span className="spin">⟳</span>;
}

export function Sparkline({ data = [], color = "var(--accent)" }) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="sparkline">
      {data.map((value, index) => (
        <div
          key={index}
          className="spark-bar"
          style={{
            height: `${((value - min) / range) * 85 + 15}%`,
            background: color,
          }}
        />
      ))}
    </div>
  );
}

export function ScoreBar({ value = 0 }) {
  const color =
    value >= 80 ? "var(--accent)" : value >= 60 ? "var(--orange)" : "var(--red)";

  return (
    <div className="score-bar">
      <div className="score-track">
        <div
          className="score-fill"
          style={{
            width: `${value}%`,
            background: color,
          }}
        />
      </div>
      <span style={{ color }}>{value}</span>
    </div>
  );
}