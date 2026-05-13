import { useMemo, useState } from "react";

export default function LBOCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(100);
  const [equityPercent, setEquityPercent] = useState(40);
  const [ebitda, setEbitda] = useState(12);
  const [entryMultiple, setEntryMultiple] = useState(8);
  const [exitMultiple, setExitMultiple] = useState(10);
  const [growthRate, setGrowthRate] = useState(12);
  const [holdingPeriod, setHoldingPeriod] = useState(5);
  const [annualDebtPaydown, setAnnualDebtPaydown] = useState(5);

  function calculate({ growth = growthRate, exit = exitMultiple } = {}) {
    const equity = purchasePrice * (equityPercent / 100);
    const debt = purchasePrice - equity;
    const projectedEbitda = ebitda * Math.pow(1 + growth / 100, holdingPeriod);
    const exitEnterpriseValue = projectedEbitda * exit;
    const remainingDebt = Math.max(debt - holdingPeriod * annualDebtPaydown, 0);
    const exitEquityValue = exitEnterpriseValue - remainingDebt;
    const moic = equity > 0 ? exitEquityValue / equity : 0;
    const irr = moic > 0 ? (Math.pow(moic, 1 / holdingPeriod) - 1) * 100 : 0;

    return {
      equity,
      debt,
      projectedEbitda,
      exitEnterpriseValue,
      remainingDebt,
      exitEquityValue,
      moic,
      irr,
    };
  }

  const metrics = useMemo(
    () => calculate(),
    [
      purchasePrice,
      equityPercent,
      ebitda,
      exitMultiple,
      growthRate,
      holdingPeriod,
      annualDebtPaydown,
    ]
  );

  const rating =
    metrics.irr >= 25
      ? "ATTRAKTIV"
      : metrics.irr >= 15
      ? "OK / PRÜFEN"
      : "UNTER HÜRDE";

  const ratingColor =
    metrics.irr >= 25
      ? "var(--accent)"
      : metrics.irr >= 15
      ? "var(--orange)"
      : "var(--red)";

  const exitMultiples = [7, 8, 9, 10, 11, 12];
  const growthRates = [4, 8, 12, 16, 20];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            LBO <span>MODELL</span>
          </div>
          <div className="page-sub">
            Leveraged Buyout Analyse · IRR / MOIC / Sensitivität
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Annahmen</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12,
          }}
        >
          <Input label="Kaufpreis (€m)" value={purchasePrice} setValue={setPurchasePrice} />
          <Input label="Equity Anteil (%)" value={equityPercent} setValue={setEquityPercent} />
          <Input label="EBITDA (€m)" value={ebitda} setValue={setEbitda} />
          <Input label="Entry Multiple" value={entryMultiple} setValue={setEntryMultiple} />
          <Input label="Exit Multiple" value={exitMultiple} setValue={setExitMultiple} />
          <Input label="EBITDA Wachstum (%)" value={growthRate} setValue={setGrowthRate} />
          <Input label="Debt Paydown p.a. (€m)" value={annualDebtPaydown} setValue={setAnnualDebtPaydown} />
          <Input label="Haltedauer (Jahre)" value={holdingPeriod} setValue={setHoldingPeriod} />
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Equity Einsatz" value={`€${metrics.equity.toFixed(1)}m`} />
        <Metric label="Debt Finanzierung" value={`€${metrics.debt.toFixed(1)}m`} />
        <Metric label="Projected EBITDA" value={`€${metrics.projectedEbitda.toFixed(1)}m`} />
        <Metric label="Exit EV" value={`€${metrics.exitEnterpriseValue.toFixed(1)}m`} />
        <Metric label="Exit Equity Value" value={`€${metrics.exitEquityValue.toFixed(1)}m`} />
        <Metric label="Remaining Debt" value={`€${metrics.remainingDebt.toFixed(1)}m`} />
        <Metric label="MOIC" value={`${metrics.moic.toFixed(2)}x`} />
        <Metric label="IRR" value={`${metrics.irr.toFixed(1)}%`} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Investment Rating</div>

        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: ratingColor,
            marginBottom: 10,
          }}
        >
          {rating}
        </div>

        <div className="muted">
          Zielwerte: ≥25% IRR attraktiv, 15–25% prüfenswert, unter 15% unter Hürde.
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Sensitivitätsanalyse — IRR</div>

        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Growth / Exit</th>
                {exitMultiples.map((m) => (
                  <th key={m}>{m}x</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {growthRates.map((g) => (
                <tr key={g}>
                  <td>{g}%</td>
                  {exitMultiples.map((m) => {
                    const scenario = calculate({ growth: g, exit: m });
                    const color =
                      scenario.irr >= 25
                        ? "var(--accent)"
                        : scenario.irr >= 15
                        ? "var(--orange)"
                        : "var(--red)";

                    return (
                      <td key={m} style={{ color }}>
                        {scenario.irr.toFixed(1)}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Investment Summary</div>

        <div style={{ display: "grid", gap: 10, lineHeight: 1.6 }}>
          <div>
            Kaufpreis: <b>€{purchasePrice}m</b>
          </div>
          <div>
            Entry Multiple: <b>{entryMultiple}x</b>
          </div>
          <div>
            Exit Multiple: <b>{exitMultiple}x</b>
          </div>
          <div>
            EBITDA CAGR: <b>{growthRate}%</b>
          </div>
          <div>
            Halteperiode: <b>{holdingPeriod} Jahre</b>
          </div>
          <div>
            Debt Paydown: <b>€{annualDebtPaydown}m p.a.</b>
          </div>
          <div>
            Erwarteter MOIC: <b>{metrics.moic.toFixed(2)}x</b>
          </div>
          <div>
            Erwarteter IRR: <b>{metrics.irr.toFixed(1)}%</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, setValue }) {
  return (
    <div>
      <div style={{ marginBottom: 6, fontSize: 12, opacity: 0.7 }}>
        {label}
      </div>

      <input
        className="input"
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
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