import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard({ fund = {}, portfolio = [] }) {
  const active = portfolio.filter((p) => p.status === "Active");
  const exits = portfolio.filter((p) => p.status === "Exit");

  const totalRevenue = active.reduce((s, p) => s + (Number(p.revenue) || 0), 0);
  const totalEbitda = active.reduce((s, p) => s + (Number(p.ebitda) || 0), 0);

  const avgIrr =
    active.length > 0
      ? active.reduce((s, p) => s + (Number(p.irr) || 0), 0) / active.length
      : 0;

  const avgMoic =
    active.length > 0
      ? active.reduce((s, p) => s + (Number(p.moic) || 0), 0) / active.length
      : 0;

  const ebitdaMargin = totalRevenue > 0 ? (totalEbitda / totalRevenue) * 100 : 0;

  const chartData = active.map((p) => ({
    name: p.name,
    revenue: Number(p.revenue) || 0,
    ebitda: Number(p.ebitda) || 0,
    irr: Number(p.irr) || 0,
  }));

  const sectorData = Object.values(
    active.reduce((acc, p) => {
      const sector = p.sector || "Other";
      acc[sector] = acc[sector] || { name: sector, value: 0 };
      acc[sector].value += Number(p.revenue) || 0;
      return acc;
    }, {})
  );

  const topPerformer = [...active].sort(
    (a, b) => (Number(b.irr) || 0) - (Number(a.irr) || 0)
  )[0];

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
        <Metric label="AUM" value={`€${fund.aum || 0}M`} />
        <Metric label="Active Companies" value={active.length} />
        <Metric label="Exits" value={exits.length} />
        <Metric label="Gross IRR" value={`${avgIrr.toFixed(1)}%`} />
        <Metric label="MOIC" value={`${avgMoic.toFixed(2)}x`} />
        <Metric label="Revenue" value={`€${totalRevenue.toFixed(1)}m`} />
        <Metric label="EBITDA" value={`€${totalEbitda.toFixed(1)}m`} />
        <Metric label="EBITDA Margin" value={`${ebitdaMargin.toFixed(1)}%`} />
      </div>

      <div className="market-grid" style={{ marginBottom: 20 }}>
        <div className="market-card">
          <div className="card-title">Fund Status</div>
          <div className="market-card-name">{fund.name || "APEX CAPITAL FUND I"}</div>
          <div className="muted">Vintage {fund.vintage || 2022}</div>
          <div className="market-card-price" style={{ color: "var(--accent)" }}>
            €{fund.aum || 0}M AUM
          </div>
          <div className="muted">
            Dry Powder: €{fund.dryPowder || 0}M · Deployed: €{fund.deployed || 0}M
          </div>
        </div>

        {topPerformer && (
          <div className="market-card">
            <div className="card-title">Top Performer</div>
            <div className="market-card-name">{topPerformer.name}</div>
            <div className="muted">{topPerformer.sector}</div>
            <div className="market-card-price" style={{ color: "var(--accent)" }}>
              {Number(topPerformer.irr || 0).toFixed(1)}% IRR
            </div>
            <div className="muted">{Number(topPerformer.moic || 0).toFixed(2)}x MOIC</div>
          </div>
        )}

        <div className="market-card">
          <div className="card-title">Portfolio Health</div>
          <div className="market-card-name">
            {avgIrr >= 25 ? "Top Quartile" : avgIrr >= 15 ? "On Track" : "Needs Attention"}
          </div>
          <div className="muted">Based on average IRR and MOIC.</div>
          <div
            className="market-card-price"
            style={{
              color:
                avgIrr >= 25
                  ? "var(--accent)"
                  : avgIrr >= 15
                  ? "var(--orange)"
                  : "var(--red)",
            }}
          >
            {avgIrr.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="market-grid" style={{ marginBottom: 20 }}>
        <ChartCard title="Revenue / EBITDA">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#c8f542" name="Revenue" />
              <Bar dataKey="ebitda" fill="#42f5c8" name="EBITDA" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="IRR Ranking">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[...chartData].sort((a, b) => b.irr - a.irr)}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="irr" fill="#c8f542" name="IRR %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sector Mix">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={sectorData} dataKey="value" nameKey="name" outerRadius={90} label>
                {sectorData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={["#c8f542", "#42f5c8", "#f5a742", "#f54242", "#8f9cff"][index % 5]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
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
                <th>IRR</th>
                <th>MOIC</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {portfolio.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sector}</td>
                  <td>€{Number(p.revenue || 0).toFixed(1)}m</td>
                  <td>€{Number(p.ebitda || 0).toFixed(1)}m</td>
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

function ChartCard({ title, children }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      {children}
    </div>
  );
}