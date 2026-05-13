import { useMemo, useState } from "react";

export default function LBOCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(100);
  const [equityPercent, setEquityPercent] = useState(40);
  const [ebitda, setEbitda] = useState(12);
  const [entryMultiple, setEntryMultiple] = useState(8);
  const [exitMultiple, setExitMultiple] = useState(10);
  const [growthRate, setGrowthRate] = useState(12);
  const [holdingPeriod, setHoldingPeriod] = useState(5);

  const metrics = useMemo(() => {
    const equity = purchasePrice * (equityPercent / 100);
    const debt = purchasePrice - equity;

    const projectedEbitda =
      ebitda * Math.pow(1 + growthRate / 100, holdingPeriod);

    const exitEnterpriseValue =
      projectedEbitda * exitMultiple;

    const remainingDebt = Math.max(
      debt - holdingPeriod * 5,
      0
    );

    const exitEquityValue =
      exitEnterpriseValue - remainingDebt;

    const moic =
      equity > 0
        ? exitEquityValue / equity
        : 0;

    const irr =
      moic > 0
        ? (Math.pow(moic, 1 / holdingPeriod) - 1) * 100
        : 0;

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
  }, [
    purchasePrice,
    equityPercent,
    ebitda,
    exitMultiple,
    growthRate,
    holdingPeriod,
  ]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            LBO <span>MODELL</span>
          </div>

          <div className="page-sub">
            Leveraged Buyout Analyse
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div className="card-title">
          Annahmen
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12,
          }}
        >
          <Input
            label="Kaufpreis (€m)"
            value={purchasePrice}
            setValue={setPurchasePrice}
          />

          <Input
            label="Equity Anteil (%)"
            value={equityPercent}
            setValue={setEquityPercent}
          />

          <Input
            label="EBITDA (€m)"
            value={ebitda}
            setValue={setEbitda}
          />

          <Input
            label="Entry Multiple"
            value={entryMultiple}
            setValue={setEntryMultiple}
          />

          <Input
            label="Exit Multiple"
            value={exitMultiple}
            setValue={setExitMultiple}
          />

          <Input
            label="EBITDA Wachstum (%)"
            value={growthRate}
            setValue={setGrowthRate}
          />

          <Input
            label="Haltedauer (Jahre)"
            value={holdingPeriod}
            setValue={setHoldingPeriod}
          />
        </div>
      </div>

      <div
        className="dashboard-grid"
        style={{ marginBottom: 20 }}
      >
        <Metric
          label="Equity Einsatz"
          value={`€${metrics.equity.toFixed(1)}m`}
        />

        <Metric
          label="Debt Finanzierung"
          value={`€${metrics.debt.toFixed(1)}m`}
        />

        <Metric
          label="Projected EBITDA"
          value={`€${metrics.projectedEbitda.toFixed(
            1
          )}m`}
        />

        <Metric
          label="Exit Enterprise Value"
          value={`€${metrics.exitEnterpriseValue.toFixed(
            1
          )}m`}
        />

        <Metric
          label="Exit Equity Value"
          value={`€${metrics.exitEquityValue.toFixed(
            1
          )}m`}
        />

        <Metric
          label="Remaining Debt"
          value={`€${metrics.remainingDebt.toFixed(
            1
          )}m`}
        />

        <Metric
          label="MOIC"
          value={`${metrics.moic.toFixed(2)}x`}
        />

        <Metric
          label="IRR"
          value={`${metrics.irr.toFixed(1)}%`}
        />
      </div>

      <div className="card">
        <div className="card-title">
          Investment Summary
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            lineHeight: 1.6,
          }}
        >
          <div>
            Kaufpreis:
            <b> €{purchasePrice}m</b>
          </div>

          <div>
            Entry Multiple:
            <b> {entryMultiple}x</b>
          </div>

          <div>
            Exit Multiple:
            <b> {exitMultiple}x</b>
          </div>

          <div>
            EBITDA CAGR:
            <b> {growthRate}%</b>
          </div>

          <div>
            Halteperiode:
            <b> {holdingPeriod} Jahre</b>
          </div>

          <div>
            Erwarteter MOIC:
            <b> {metrics.moic.toFixed(2)}x</b>
          </div>

          <div>
            Erwarteter IRR:
            <b> {metrics.irr.toFixed(1)}%</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, setValue }) {
  return (
    <div>
      <div
        style={{
          marginBottom: 6,
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        {label}
      </div>

      <input
        className="input"
        type="number"
        value={value}
        onChange={(e) => {
          const value = e.target.value;

          setValue(
            value === ""
              ? ""
              : Number(value)
          );
        }}
      />
    </div>
  );
}

function Metric({ label, value }) {
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