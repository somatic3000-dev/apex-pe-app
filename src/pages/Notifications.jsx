export default function Notifications({ portfolio = [], deals = [], tasks = [] }) {
  const notifications = [];

  portfolio.forEach((p) => {
    const irr = Number(p.irr) || 0;
    const moic = Number(p.moic) || 0;

    const margin =
      Number(p.revenue) > 0
        ? (Number(p.ebitda) / Number(p.revenue)) * 100
        : 0;

    if (irr < 15) {
      notifications.push({
        type: "warning",
        title: "IRR unter Zielrendite",
        message: `${p.name} liegt bei ${irr.toFixed(1)}% IRR`,
      });
    }

    if (moic >= 2.5) {
      notifications.push({
        type: "success",
        title: "Top Performer",
        message: `${p.name} erreicht ${moic.toFixed(2)}x MOIC`,
      });
    }

    if (margin < 15) {
      notifications.push({
        type: "danger",
        title: "Niedrige EBITDA-Marge",
        message: `${p.name} liegt bei ${margin.toFixed(1)}%`,
      });
    }
  });

  deals.forEach((d) => {
    const score = Number(d.score) || 0;

    if (score >= 80 && ["LOI", "Due Diligence"].includes(d.status)) {
      notifications.push({
        type: "accent",
        title: "IC READY",
        message: `${d.name} ist bereit für Investment Committee`,
      });
    }
  });

  tasks.forEach((t) => {
    if (t.status !== "Done") {
      notifications.push({
        type: "blue",
        title: "Open Task",
        message: `${t.title} · ${t.owner || "No owner"}`,
      });
    }
  });

  const colorMap = {
    success: "var(--accent)",
    warning: "var(--orange)",
    danger: "var(--red)",
    accent: "var(--accent)",
    blue: "var(--blue)",
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            NOTIFI <span>CATIONS</span>
          </div>

          <div className="page-sub">Alerts · Activity · Monitoring</div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Alerts" value={notifications.length} />
        <Metric label="Portfolio" value={portfolio.length} />
        <Metric label="Deals" value={deals.length} />
        <Metric label="Tasks" value={tasks.length} />
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {notifications.map((n, index) => (
          <div
            key={index}
            className="market-card"
            style={{
              borderLeft: `4px solid ${colorMap[n.type]}`,
            }}
          >
            <div
              style={{
                color: colorMap[n.type],
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {n.title}
            </div>

            <div className="market-card-name" style={{ fontSize: 16 }}>
              {n.message}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="card">Keine Alerts aktiv.</div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}