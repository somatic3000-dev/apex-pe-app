export default function CommandBar({
  portfolio = [],
  deals = [],
  tasks = [],
  setPage,
}) {
  const activeCompanies = portfolio.filter((p) => p.status === "Active").length;

  const avgIrr =
    portfolio.length > 0
      ? portfolio.reduce((s, p) => s + (Number(p.irr) || 0), 0) /
        portfolio.length
      : 0;

  const icReady = deals.filter(
    (d) =>
      Number(d.score) >= 80 &&
      ["LOI", "Due Diligence"].includes(d.status)
  ).length;

  const openTasks = tasks.filter((t) => t.status !== "Done").length;
  const alerts = portfolio.filter((p) => Number(p.irr) < 15).length;

  const health =
    avgIrr >= 25
      ? "TOP QUARTILE"
      : avgIrr >= 15
      ? "ON TRACK"
      : "UNDER REVIEW";

  const healthColor =
    avgIrr >= 25
      ? "var(--accent)"
      : avgIrr >= 15
      ? "var(--orange)"
      : "var(--red)";

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, marginBottom: 20 }}>
      <div
        className="card"
        style={{
          padding: 14,
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <CommandMetric label="ACTIVE" value={activeCompanies} />
          <CommandMetric label="OPEN TASKS" value={openTasks} />
          <CommandMetric label="IC READY" value={icReady} />
          <CommandMetric label="ALERTS" value={alerts} />
          <CommandMetric label="AVG IRR" value={`${avgIrr.toFixed(1)}%`} />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage("search")}
          >
            SEARCH
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage("notifications")}
          >
            ALERTS
          </button>

          <div style={{ color: healthColor, fontWeight: 700, fontSize: 13 }}>
            {health}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandMetric({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}