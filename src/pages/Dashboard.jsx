// src/pages/Dashboard.jsx

export default function Dashboard({ fund = {}, portfolio = [] }) {
  const companies =
    portfolio.length > 0
      ? portfolio
      : [];

  const active = companies.filter(
    (p) => (p.status || "").toLowerCase() === "active"
  );

  const visibleCompanies = active.length > 0 ? active : companies;

  function companyValue(p) {
    const revenue = Number(p.revenue) || 0;
    const ebitda = Number(p.ebitda) || 0;
    const multiple =
      Number(p.currentMultiple) || Number(p.entryMultiple) || 0;

    const value = ebitda * multiple;

    if (value > 0) return value;
    if (ebitda > 0) return ebitda * 8;
    if (revenue > 0) return revenue;
    return 1;
  }

  function margin(p) {
    const revenue = Number(p.revenue) || 0;
    const ebitda = Number(p.ebitda) || 0;
    return revenue > 0 ? (ebitda / revenue) * 100 : 0;
  }

  const portfolioValue = visibleCompanies.reduce(
    (sum, p) => sum + companyValue(p),
    0
  );

  const dryPowder = Number(fund.dryPowder) || 0;
  const aum = portfolioValue + dryPowder;

  const totalRevenue = visibleCompanies.reduce(
    (sum, p) => sum + (Number(p.revenue) || 0),
    0
  );

  const totalEbitda = visibleCompanies.reduce(
    (sum, p) => sum + (Number(p.ebitda) || 0),
    0
  );

  const avgIrr =
    visibleCompanies.length > 0
      ? visibleCompanies.reduce((sum, p) => sum + (Number(p.irr) || 0), 0) /
        visibleCompanies.length
      : 0;

  const avgMoic =
    visibleCompanies.length > 0
      ? visibleCompanies.reduce((sum, p) => sum + (Number(p.moic) || 0), 0) /
        visibleCompanies.length
      : 0;

  const maxValue =
    Math.max(...visibleCompanies.map((p) => companyValue(p)), 1);

  const maxIrr =
    Math.max(...visibleCompanies.map((p) => Number(p.irr) || 0), 1);

  const maxRevenue =
    Math.max(...visibleCompanies.map((p) => Number(p.revenue) || 0), 1);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            APEX <span>DASHBOARD</span>
          </div>
          <div className="page-sub">Fund I · Portfolio Operating System</div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="AUM" value={`€${aum.toFixed(1)}M`} />
        <Metric label="Portfolio Value" value={`€${portfolioValue.toFixed(1)}M`} />
        <Metric label="Dry Powder" value={`€${dryPowder.toFixed(1)}M`} />
        <Metric label="Companies" value={visibleCompanies.length} />
        <Metric label="Gross IRR" value={`${avgIrr.toFixed(1)}%`} />
        <Metric label="MOIC" value={`${avgMoic.toFixed(2)}x`} />
        <Metric label="Revenue" value={`€${totalRevenue.toFixed(1)}m`} />
        <Metric label="EBITDA" value={`€${totalEbitda.toFixed(1)}m`} />
      </div>

      <div className="market-grid" style={{ marginBottom: 20 }}>
        <div className="market-card">
          <div className="card-title">Fund Status</div>
          <div className="market-card-name">
            {fund.name || "APEX CAPITAL FUND I"}
          </div>
          <div className="muted">Vintage {fund.vintage || 2022}</div>
          <div className="market-card-price" style={{ color: "var(--accent)" }}>
            €{aum.toFixed(1)}M AUM
          </div>
          <div className="muted">
            Portfolio Value: €{portfolioValue.toFixed(1)}M · Dry Powder: €
            {dryPowder.toFixed(1)}M
          </div>
        </div>

        <div className="market-card">
          <div className="card-title">Portfolio Health</div>
          <div className="market-card-name">
            {avgIrr >= 25 ? "Top Quartile" : avgIrr >= 15 ? "On Track" : "Needs Attention"}
          </div>
          <div className="market-card-price" style={{ color: "var(--accent)" }}>
            {avgIrr.toFixed(1)}%
          </div>
          <div className="muted">Average Gross IRR</div>
        </div>
      </div>

      <div className="market-grid" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">Portfolio Allocation</div>
          <div style={{ display: "grid", gap: 12 }}>
            {visibleCompanies.map((p) => {
              const value = companyValue(p);
              const width = `${Math.max((value / maxValue) * 100, 6)}%`;

              return (
                <BarRow
                  key={p.id}
                  label={p.name}
                  value={`€${value.toFixed(1)}m`}
                  width={width}
                  color="var(--accent)"
                />
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-title">IRR by Company</div>
          <div style={{ display: "grid", gap: 12 }}>
            {visibleCompanies.map((p) => {
              const irr = Number(p.irr) || 0;
              const width = `${Math.max((irr / maxIrr) * 100, 6)}%`;

              return (
                <BarRow
                  key={p.id}
                  label={p.name}
                  value={`${irr.toFixed(1)}%`}
                  width={width}
                  color={
                    irr >= 25
                      ? "var(--accent)"
                      : irr >= 15
                      ? "var(--orange)"
                      : "var(--red)"
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Revenue vs EBITDA</div>

        <div style={{ display: "grid", gap: 16 }}>
          {visibleCompanies.map((p) => {
            const revenue = Number(p.revenue) || 0;
            const ebitda = Number(p.ebitda) || 0;

            return (
              <div key={p.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <strong>{p.name}</strong>
                  <span className="muted">
                    €{revenue.toFixed(1)}m / €{ebitda.toFixed(1)}m
                  </span>
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <SimpleBar
                    width={`${Math.max((revenue / maxRevenue) * 100, 5)}%`}
                    color="var(--blue)"
                  />
                  <SimpleBar
                    width={`${Math.max((ebitda / maxRevenue) * 100, 5)}%`}
                    color="var(--accent)"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Portfolio Companies</div>

        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Unternehmen</th>
                <th>Sektor</th>
                <th>Revenue</th>
                <th>EBITDA</th>
                <th>Margin</th>
                <th>Value</th>
                <th>IRR</th>
                <th>MOIC</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {visibleCompanies.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sector}</td>
                  <td>€{Number(p.revenue || 0).toFixed(1)}m</td>
                  <td>€{Number(p.ebitda || 0).toFixed(1)}m</td>
                  <td>{margin(p).toFixed(1)}%</td>
                  <td>€{companyValue(p).toFixed(1)}m</td>
                  <td>{Number(p.irr || 0).toFixed(1)}%</td>
                  <td>{Number(p.moic || 0).toFixed(2)}x</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

function BarRow({ label, value, width, color }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          gap: 12,
        }}
      >
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <SimpleBar width={width} color={color} />
    </div>
  );
}

function SimpleBar({ width, color }) {
  return (
    <div
      style={{
        height: 12,
        borderRadius: 999,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width,
          borderRadius: 999,
          background: color,
        }}
      />
    </div>
  );
}