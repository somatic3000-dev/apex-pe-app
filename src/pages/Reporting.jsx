import { Pill } from "../components/UI";

export default function Reporting({
  portfolio = [],
  fund = {},
}) {
  const active = portfolio.filter(
    (p) => p.status === "Active"
  );

  const exits = portfolio.filter(
    (p) => p.status === "Exit"
  );

  function companyValue(p) {
    const ebitda =
      Number(p.ebitda) || 0;

    const multiple =
      Number(p.currentMultiple) ||
      Number(p.entryMultiple) ||
      0;

    return ebitda * multiple;
  }

  const portfolioValue =
    active.reduce(
      (sum, p) =>
        sum + companyValue(p),
      0
    );

  const dryPowder =
    Number(fund.dryPowder) || 0;

  const dynamicAum =
    portfolioValue + dryPowder;

  const avgIrr =
    active.length > 0
      ? active.reduce(
          (s, p) =>
            s +
            (Number(p.irr) || 0),
          0
        ) / active.length
      : 0;

  const avgMoic =
    active.length > 0
      ? active.reduce(
          (s, p) =>
            s +
            (Number(p.moic) || 0),
          0
        ) / active.length
      : 0;

  const totalRevenue =
    active.reduce(
      (s, p) =>
        s +
        (Number(p.revenue) || 0),
      0
    );

  const totalEbitda =
    active.reduce(
      (s, p) =>
        s +
        (Number(p.ebitda) || 0),
      0
    );

  const topPerformer = [...active].sort(
    (a, b) =>
      (Number(b.irr) || 0) -
      (Number(a.irr) || 0)
  )[0];

  const underperformer = [
    ...active,
  ].sort(
    (a, b) =>
      (Number(a.irr) || 0) -
      (Number(b.irr) || 0)
  )[0];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            LP <span>REPORTING</span>
          </div>

          <div className="page-sub">
            Quarterly Portfolio Report
          </div>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => window.print()}
        >
          PRINT / PDF
        </button>
      </div>

      <div
        className="dashboard-grid"
        style={{ marginBottom: 20 }}
      >
        <Metric
          label="Gross IRR"
          value={`${avgIrr.toFixed(
            1
          )}%`}
        />

        <Metric
          label="Avg. MOIC"
          value={`${avgMoic.toFixed(
            2
          )}x`}
        />

        <Metric
          label="AUM"
          value={`€${dynamicAum.toFixed(
            1
          )}M`}
        />

        <Metric
          label="Portfolio Value"
          value={`€${portfolioValue.toFixed(
            1
          )}M`}
        />

        <Metric
          label="Dry Powder"
          value={`€${dryPowder.toFixed(
            1
          )}M`}
        />

        <Metric
          label="Active Companies"
          value={active.length}
        />

        <Metric
          label="Exits"
          value={exits.length}
        />

        <Metric
          label="Revenue"
          value={`€${totalRevenue.toFixed(
            1
          )}m`}
        />

        <Metric
          label="EBITDA"
          value={`€${totalEbitda.toFixed(
            1
          )}m`}
        />
      </div>

      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div className="card-title">
          Executive Summary
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            lineHeight: 1.6,
          }}
        >
          <div>
            Der Fonds hält aktuell{" "}
            <b>{active.length}</b>{" "}
            aktive Beteiligungen und
            hat <b>{exits.length}</b>{" "}
            realisierte Exits.
          </div>

          <div>
            Das aktive Portfolio
            erwirtschaftet aggregiert{" "}
            <b>
              €
              {totalRevenue.toFixed(1)}
              m Umsatz
            </b>{" "}
            und{" "}
            <b>
              €
              {totalEbitda.toFixed(1)}
              m EBITDA
            </b>
            .
          </div>

          <div>
            Der aktuelle
            Portfolio-Wert beträgt{" "}
            <b>
              €
              {portfolioValue.toFixed(
                1
              )}
              M
            </b>
            .
          </div>

          <div>
            Das gesamte verwaltete
            Vermögen (AUM) liegt bei{" "}
            <b>
              €
              {dynamicAum.toFixed(1)}
              M
            </b>
            .
          </div>

          <div>
            Die durchschnittliche
            Performance liegt bei{" "}
            <b>
              {avgIrr.toFixed(1)}%
              IRR
            </b>{" "}
            und{" "}
            <b>
              {avgMoic.toFixed(2)}x
              MOIC
            </b>
            .
          </div>
        </div>
      </div>

      <div
        className="market-grid"
        style={{ marginBottom: 20 }}
      >
        {topPerformer && (
          <div className="market-card">
            <div className="card-title">
              Top Performer
            </div>

            <div className="market-card-name">
              {topPerformer.name}
            </div>

            <div className="muted">
              {topPerformer.sector}
            </div>

            <div
              className="market-card-price"
              style={{
                color:
                  "var(--accent)",
              }}
            >
              {Number(
                topPerformer.irr || 0
              ).toFixed(1)}
              % IRR
            </div>

            <div className="muted">
              {Number(
                topPerformer.moic || 0
              ).toFixed(2)}
              x MOIC
            </div>
          </div>
        )}

        {underperformer && (
          <div className="market-card">
            <div className="card-title">
              Underperformer
            </div>

            <div className="market-card-name">
              {underperformer.name}
            </div>

            <div className="muted">
              {underperformer.sector}
            </div>

            <div
              className="market-card-price"
              style={{
                color:
                  "var(--orange)",
              }}
            >
              {Number(
                underperformer.irr || 0
              ).toFixed(1)}
              % IRR
            </div>

            <div className="muted">
              {Number(
                underperformer.moic || 0
              ).toFixed(2)}
              x MOIC
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">
          Portfolio Performance
        </div>

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>
                  Unternehmen
                </th>
                <th>Sektor</th>
                <th>Revenue</th>
                <th>EBITDA</th>
                <th>Value</th>
                <th>IRR</th>
                <th>MOIC</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {portfolio.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>

                  <td>
                    {p.sector}
                  </td>

                  <td>
                    €
                    {Number(
                      p.revenue || 0
                    ).toFixed(1)}
                    m
                  </td>

                  <td>
                    €
                    {Number(
                      p.ebitda || 0
                    ).toFixed(1)}
                    m
                  </td>

                  <td>
                    €
                    {companyValue(
                      p
                    ).toFixed(1)}
                    m
                  </td>

                  <td>
                    {Number(
                      p.irr || 0
                    ).toFixed(1)}
                    %
                  </td>

                  <td>
                    {Number(
                      p.moic || 0
                    ).toFixed(2)}
                    x
                  </td>

                  <td>
                    <Pill
                      type={
                        p.status ===
                        "Exit"
                          ? "gray"
                          : "green"
                      }
                    >
                      {p.status}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}) {
  return (
    <div className="metric-card">
      <div className="metric-label">
        {label}
      </div>

      <div className="metric-value">
        {value}
      </div>
    </div>
  );
}