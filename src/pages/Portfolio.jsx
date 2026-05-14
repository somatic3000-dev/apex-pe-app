// src/pages/Portfolio.jsx

import { useMemo, useState } from "react";
import { ScoreBar, Pill, ProgressBar } from "../components/UI";

const emptyCompany = {
  name: "",
  sector: "",
  status: "Active",
  entry: new Date().getFullYear(),
  revenue: "",
  ebitda: "",
  equity: "",
  entryMultiple: "",
  currentMultiple: "",
  irr: "",
  moic: "",
  score: "65",
  stage: "Optimize",
  notes: "",
  aiScore: "60",
  peerTickers: "",
};

const numberFields = [
  "entry",
  "revenue",
  "ebitda",
  "equity",
  "entryMultiple",
  "currentMultiple",
  "irr",
  "moic",
  "score",
  "aiScore",
];

function parsePeerTickers(value) {
  if (Array.isArray(value)) {
    return value
      .map((ticker) => String(ticker).trim().toUpperCase())
      .filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((ticker) => ticker.trim().toUpperCase())
    .filter(Boolean);
}

function normalizeCompany(form, id) {
  const out = {
    id,
    ...form,
    name: form.name.trim(),
    sector: form.sector.trim(),
    notes: form.notes?.trim() || "",
    peerTickers: parsePeerTickers(form.peerTickers),
  };

  numberFields.forEach((key) => {
    out[key] = parseFloat(out[key]) || 0;
  });

  out.margin =
    out.revenue > 0
      ? Number(((out.ebitda / out.revenue) * 100).toFixed(1))
      : 0;

  return out;
}

function calcCompany(company) {
  const revenue = Number(company?.revenue) || 0;
  const ebitda = Number(company?.ebitda) || 0;
  const equity = Number(company?.equity) || 0;
  const entryMultiple = Number(company?.entryMultiple) || 0;
  const currentMultiple = Number(company?.currentMultiple) || entryMultiple;
  const irr = Number(company?.irr) || 0;
  const moic = Number(company?.moic) || 0;

  const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
  const entryEv = ebitda * entryMultiple;
  const currentEv =
    ebitda * currentMultiple > 0
      ? ebitda * currentMultiple
      : revenue > 0
      ? revenue
      : 0;

  const valueCreation = currentEv - entryEv;
  const multipleExpansion = currentMultiple - entryMultiple;
  const impliedGain = equity > 0 ? currentEv - equity : valueCreation;

  const health =
    irr >= 25 && moic >= 2
      ? "Outperformer"
      : irr >= 15 && moic >= 1.5
      ? "On Track"
      : "Attention";

  const healthColor =
    health === "Outperformer"
      ? "var(--accent)"
      : health === "On Track"
      ? "var(--orange)"
      : "var(--red)";

  return {
    revenue,
    ebitda,
    equity,
    entryMultiple,
    currentMultiple,
    irr,
    moic,
    margin,
    entryEv,
    currentEv,
    valueCreation,
    multipleExpansion,
    impliedGain,
    health,
    healthColor,
  };
}

function CompanyForm({ form, setForm, onSave, onCancel, isEdit }) {
  const set = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const fields = [
    ["Unternehmensname *", "name", "text"],
    ["Sektor", "sector", "text"],
    ["Umsatz (€M)", "revenue", "number"],
    ["EBITDA (€M)", "ebitda", "number"],
    ["Equity investiert (€M)", "equity", "number"],
    ["Entry Multiple", "entryMultiple", "number"],
    ["Current Multiple", "currentMultiple", "number"],
    ["IRR (%)", "irr", "number"],
    ["MOIC", "moic", "number"],
    ["Score", "score", "number"],
    ["KI-Score", "aiScore", "number"],
    ["Entry Jahr", "entry", "number"],
  ];

  return (
    <div className="card editor-card" style={{ marginBottom: 20 }}>
      <div className="card-title">
        {isEdit ? "Beteiligung bearbeiten" : "Neue Beteiligung"}
      </div>

      <div className="market-grid">
        {fields.map(([label, key, type]) => (
          <div key={key}>
            <label className="muted">{label}</label>
            <input
              className="input"
              type={type}
              value={form[key] ?? ""}
              onChange={(event) => set(key, event.target.value)}
              style={{ marginTop: 6 }}
            />
          </div>
        ))}

        <div>
          <label className="muted">Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(event) => set("status", event.target.value)}
            style={{ marginTop: 6 }}
          >
            <option>Active</option>
            <option>Exit</option>
            <option>Watchlist</option>
          </select>
        </div>

        <div>
          <label className="muted">Stage</label>
          <select
            className="input"
            value={form.stage}
            onChange={(event) => set("stage", event.target.value)}
            style={{ marginTop: 6 }}
          >
            {["Hold", "Scale", "Optimize", "Roll-up", "Sold"].map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="muted">Public Peers</label>
          <input
            className="input"
            value={
              Array.isArray(form.peerTickers)
                ? form.peerTickers.join(", ")
                : form.peerTickers || ""
            }
            onChange={(event) => set("peerTickers", event.target.value)}
            placeholder="z. B. MSFT, CRM, NOW"
            style={{ marginTop: 6 }}
          />
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <label className="muted">Notizen</label>
        <textarea
          className="input"
          value={form.notes ?? ""}
          onChange={(event) => set("notes", event.target.value)}
          placeholder="Kurzbeschreibung, Value Creation, Risiken…"
          style={{
            marginTop: 6,
            minHeight: 120,
            resize: "vertical",
          }}
        />
      </div>

      <div className="button-row" style={{ marginTop: 16 }}>
        <button className="btn btn-primary" onClick={onSave}>
          {isEdit ? "ÄNDERUNGEN SPEICHERN" : "BETEILIGUNG HINZUFÜGEN"}
        </button>

        <button className="btn btn-ghost" onClick={onCancel}>
          ABBRECHEN
        </button>
      </div>
    </div>
  );
}

export default function Portfolio({ portfolio = [], setPortfolio, resetPortfolio }) {
  const [selected, setSelected] = useState(portfolio[0]?.id ?? null);
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState(emptyCompany);

  const active = portfolio.filter((p) => p.status === "Active");

  const selectedCompany =
    portfolio.find((p) => p.id === selected) || portfolio[0] || null;

  const selectedMetrics = calcCompany(selectedCompany);

  const selectedPeers = parsePeerTickers(selectedCompany?.peerTickers);

  const totals = useMemo(
    () => ({
      count: active.length,
      revenue: active.reduce(
        (sum, company) => sum + (Number(company.revenue) || 0),
        0
      ),
      ebitda: active.reduce(
        (sum, company) => sum + (Number(company.ebitda) || 0),
        0
      ),
      equity: active.reduce(
        (sum, company) => sum + (Number(company.equity) || 0),
        0
      ),
      value: active.reduce((sum, company) => sum + calcCompany(company).currentEv, 0),
    }),
    [portfolio]
  );

  function startAdd() {
    setForm(emptyCompany);
    setMode("add");
  }

  function startEdit(company) {
    setForm({
      ...company,
      peerTickers: parsePeerTickers(company.peerTickers).join(", "),
    });

    setMode("edit");
  }

  function cancel() {
    setMode("view");
  }

  function saveAdd() {
    if (!form.name.trim()) {
      alert("Bitte Unternehmensname eintragen.");
      return;
    }

    const company = normalizeCompany(form, Date.now());

    setPortfolio((prev) => [...prev, company]);
    setSelected(company.id);
    setMode("view");
  }

  function saveEdit() {
    if (!form.name.trim()) {
      alert("Bitte Unternehmensname eintragen.");
      return;
    }

    const company = normalizeCompany(form, form.id);

    setPortfolio((prev) =>
      prev.map((item) => (item.id === company.id ? company : item))
    );

    setSelected(company.id);
    setMode("view");
  }

  function remove(id) {
    if (!confirm("Diese Beteiligung löschen?")) return;

    setPortfolio((prev) => prev.filter((item) => item.id !== id));
    setSelected(null);
    setMode("view");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(portfolio, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "apex-portfolio.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            PORTFOLIO <span>MANAGEMENT</span>
          </div>

          <div className="page-sub">
            Beteiligungen · Detail View · Value Creation · Public Peers
          </div>
        </div>

        <div className="button-row">
          <button className="btn btn-primary" onClick={startAdd}>
            + BETEILIGUNG
          </button>

          <button className="btn btn-ghost" onClick={exportJson}>
            EXPORT JSON
          </button>

          <button className="btn btn-ghost" onClick={resetPortfolio}>
            RESET
          </button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Aktive Beteiligungen" value={totals.count} />
        <Metric label="Revenue aktiv" value={`€${totals.revenue.toFixed(1)}M`} />
        <Metric label="EBITDA aktiv" value={`€${totals.ebitda.toFixed(1)}M`} />
        <Metric label="Equity aktiv" value={`€${totals.equity.toFixed(1)}M`} />
        <Metric label="Portfolio Value" value={`€${totals.value.toFixed(1)}M`} />
      </div>

      {mode !== "view" && (
        <CompanyForm
          form={form}
          setForm={setForm}
          onSave={mode === "add" ? saveAdd : saveEdit}
          onCancel={cancel}
          isEdit={mode === "edit"}
        />
      )}

      {selectedCompany && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">Portfolio Detail View</div>

          <div className="market-grid">
            <div>
              <div className="market-card-name">{selectedCompany.name}</div>

              <div className="muted" style={{ marginTop: 4 }}>
                {selectedCompany.sector} · {selectedCompany.status}
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "inline-block",
                  color: selectedMetrics.healthColor,
                  border: `1px solid ${selectedMetrics.healthColor}`,
                  borderRadius: 999,
                  padding: "6px 12px",
                  fontWeight: 800,
                }}
              >
                {selectedMetrics.health}
              </div>

              <p className="muted" style={{ marginTop: 16, lineHeight: 1.6 }}>
                {selectedCompany.notes || "Keine Notizen hinterlegt."}
              </p>

              <div style={{ marginTop: 14 }}>
                <div className="card-title" style={{ marginBottom: 8 }}>
                  Public Peers
                </div>

                {selectedPeers.length > 0 ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {selectedPeers.map((ticker) => (
                      <Pill key={ticker} type="blue">
                        {ticker}
                      </Pill>
                    ))}
                  </div>
                ) : (
                  <div className="muted">Keine Public Peers hinterlegt.</div>
                )}
              </div>

              <div className="button-row" style={{ marginTop: 18 }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => startEdit(selectedCompany)}
                >
                  BEARBEITEN
                </button>

                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => remove(selectedCompany.id)}
                >
                  LÖSCHEN
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <DetailMetric
                label="Revenue"
                value={`€${selectedMetrics.revenue.toFixed(1)}M`}
              />
              <DetailMetric
                label="EBITDA"
                value={`€${selectedMetrics.ebitda.toFixed(1)}M`}
              />
              <DetailMetric
                label="EBITDA Margin"
                value={`${selectedMetrics.margin.toFixed(1)}%`}
              />
              <DetailMetric
                label="Entry EV"
                value={`€${selectedMetrics.entryEv.toFixed(1)}M`}
              />
              <DetailMetric
                label="Current EV"
                value={`€${selectedMetrics.currentEv.toFixed(1)}M`}
              />
              <DetailMetric
                label="Value Creation"
                value={`€${selectedMetrics.valueCreation.toFixed(1)}M`}
              />
              <DetailMetric
                label="Multiple Expansion"
                value={`${selectedMetrics.multipleExpansion.toFixed(1)}x`}
              />
              <DetailMetric label="IRR" value={`${selectedMetrics.irr.toFixed(1)}%`} />
              <DetailMetric
                label="MOIC"
                value={`${selectedMetrics.moic.toFixed(2)}x`}
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <ProgressBar
              label="KI-Potenzial"
              value={Number(selectedCompany.aiScore) || 0}
            />
            <ProgressBar
              label="EBITDA Impact"
              value={Math.max(20, (Number(selectedCompany.aiScore) || 0) - 25)}
              color="var(--orange)"
            />
          </div>
        </div>
      )}

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
                <th>Score</th>
                <th>Peers</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {portfolio.map((company) => {
                const metrics = calcCompany(company);
                const peers = parsePeerTickers(company.peerTickers);

                return (
                  <tr
                    key={company.id}
                    onClick={() => setSelected(company.id)}
                    style={{
                      cursor: "pointer",
                      background:
                        company.id === selected
                          ? "rgba(201,255,59,0.08)"
                          : "transparent",
                    }}
                  >
                    <td style={{ fontWeight: 800 }}>{company.name}</td>
                    <td>{company.sector}</td>
                    <td>€{metrics.revenue.toFixed(1)}M</td>
                    <td style={{ color: "var(--accent)" }}>
                      €{metrics.ebitda.toFixed(1)}M
                    </td>
                    <td style={{ color: metrics.healthColor }}>
                      {metrics.irr.toFixed(1)}%
                    </td>
                    <td style={{ color: "var(--blue)" }}>
                      {metrics.moic.toFixed(2)}x
                    </td>
                    <td>
                      <ScoreBar value={Number(company.score) || 0} />
                    </td>
                    <td>{peers.length > 0 ? peers.join(", ") : "-"}</td>
                    <td>
                      <Pill type={company.status === "Exit" ? "gray" : "green"}>
                        {company.status}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
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

function DetailMetric({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}