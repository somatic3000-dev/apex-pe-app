const checklist = [
  "Financial DD",
  "Legal DD",
  "Commercial DD",
  "Tax DD",
  "ESG DD",
  "Management Calls",
  "Customer Calls",
  "Data Room Review",
];

export default function DueDiligence({ deals = [] }) {
  function calcProgress(deal) {
    const score = Number(deal.score) || 0;

    if (score >= 85) return 90;
    if (score >= 70) return 70;
    if (score >= 60) return 50;

    return 25;
  }

  function riskLevel(deal) {
    const multiple = Number(deal.multiple) || 0;
    const score = Number(deal.score) || 0;

    if (multiple > 12 || score < 60) {
      return { label: "HIGH RISK", color: "var(--red)" };
    }

    if (multiple > 9 || score < 75) {
      return { label: "MODERATE RISK", color: "var(--orange)" };
    }

    return { label: "LOW RISK", color: "var(--accent)" };
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            DUE <span>DILIGENCE</span>
          </div>
          <div className="page-sub">DD Tracking & Execution Workflow</div>
        </div>
      </div>

      <div className="market-grid">
        {deals.map((deal) => {
          const progress = calcProgress(deal);
          const risk = riskLevel(deal);

          return (
            <div className="card" key={deal.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div className="market-card-name">{deal.name}</div>
                  <div className="muted">{deal.sector}</div>
                </div>

                <div style={{ color: risk.color, fontWeight: 700 }}>
                  {risk.label}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span>DD Progress</span>
                  <span>{progress}%</span>
                </div>

                <div style={{ width: "100%", height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background:
                        progress >= 80
                          ? "var(--accent)"
                          : progress >= 60
                          ? "var(--orange)"
                          : "var(--red)",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
                {checklist.map((item, idx) => {
                  const done = idx < progress / 15;

                  return (
                    <div key={item} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{item}</span>
                      <span style={{ color: done ? "var(--accent)" : "var(--muted)" }}>
                        {done ? "DONE" : "OPEN"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="muted">Status: {deal.status}</div>
              <div className="muted">Priority: {deal.priority}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}