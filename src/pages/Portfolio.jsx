import { useEffect, useState } from "react";
import { initialPortfolio } from "../data/mockData";

export default function Portfolio() {
  const STORAGE_KEY = "apex_portfolio";

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialPortfolio;
  });

  const emptyForm = {
    name: "",
    sector: "",
    revenue: "",
    ebitda: "",
    entryMultiple: "",
    currentMultiple: "",
    irr: "",
    moic: "",
    status: "Active",
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function saveCompany() {
    if (!form.name.trim()) return;

    const company = {
      id: editingId || Date.now(),
      name: form.name,
      sector: form.sector,
      revenue: Number(form.revenue) || 0,
      ebitda: Number(form.ebitda) || 0,
      entryMultiple: Number(form.entryMultiple) || 0,
      currentMultiple: Number(form.currentMultiple) || 0,
      irr: Number(form.irr) || 0,
      moic: Number(form.moic) || 1,
      status: form.status || "Active",
      notes: form.notes || "",
    };

    if (editingId) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === editingId ? company : c))
      );
      setSelectedId(company.id);
    } else {
      setCompanies((prev) => [...prev, company]);
      setSelectedId(company.id);
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function editCompany(company) {
    setEditingId(company.id);
    setSelectedId(company.id);

    setForm({
      name: company.name || "",
      sector: company.sector || "",
      revenue: company.revenue || "",
      ebitda: company.ebitda || "",
      entryMultiple: company.entryMultiple || "",
      currentMultiple: company.currentMultiple || "",
      irr: company.irr || "",
      moic: company.moic || "",
      status: company.status || "Active",
      notes: company.notes || "",
    });
  }

  function removeCompany(id) {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (editingId === id) cancelEdit();
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function resetPortfolio() {
    setCompanies(initialPortfolio);
    localStorage.removeItem(STORAGE_KEY);
    setSelectedId(null);
    cancelEdit();
  }

  function exportCsv() {
    const headers = [
      "Name",
      "Sector",
      "Revenue",
      "EBITDA",
      "Entry Multiple",
      "Current Multiple",
      "IRR",
      "MOIC",
      "Status",
      "Notes",
    ];

    const rows = companies.map((c) => [
      c.name,
      c.sector,
      c.revenue,
      c.ebitda,
      c.entryMultiple,
      c.currentMultiple,
      c.irr,
      c.moic,
      c.status,
      c.notes,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "apex-portfolio.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  function calcCompany(company) {
    const revenue = Number(company?.revenue) || 0;
    const ebitda = Number(company?.ebitda) || 0;
    const entryMultiple = Number(company?.entryMultiple) || 0;
    const currentMultiple = Number(company?.currentMultiple) || entryMultiple;
    const irr = Number(company?.irr) || 0;
    const moic = Number(company?.moic) || 0;

    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
    const entryEv = ebitda * entryMultiple;
    const currentEv = ebitda * currentMultiple;
    const multipleExpansion = currentMultiple - entryMultiple;
    const valueCreation = currentEv - entryEv;

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

    const warning =
      margin < 15
        ? "EBITDA-Marge niedrig"
        : irr < 15
        ? "IRR unter Zielrendite"
        : multipleExpansion < 0
        ? "Multiple Compression"
        : "";

    return {
      revenue,
      ebitda,
      entryMultiple,
      currentMultiple,
      margin,
      entryEv,
      currentEv,
      multipleExpansion,
      valueCreation,
      health,
      healthColor,
      warning,
    };
  }

  const totalRevenue = companies.reduce(
    (sum, c) => sum + (Number(c.revenue) || 0),
    0
  );

  const totalEbitda = companies.reduce(
    (sum, c) => sum + (Number(c.ebitda) || 0),
    0
  );

  const avgIrr =
    companies.length > 0
      ? companies.reduce((sum, c) => sum + (Number(c.irr) || 0), 0) /
        companies.length
      : 0;

  const avgMoic =
    companies.length > 0
      ? companies.reduce((sum, c) => sum + (Number(c.moic) || 0), 0) /
        companies.length
      : 0;

  const totalValue = companies.reduce((sum, c) => {
    const m = calcCompany(c);
    return sum + m.currentEv;
  }, 0);

  const attentionCount = companies.filter(
    (c) => calcCompany(c).health === "Attention"
  ).length;

  const selected = companies.find((c) => c.id === selectedId) || companies[0];
  const selectedMetrics = calcCompany(selected);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            PORT <span>FOLIO</span>
          </div>
          <div className="page-sub">
            Beteiligungen · Monitoring · Value Creation
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={exportCsv}>
            CSV EXPORT
          </button>

          <button className="btn btn-ghost btn-sm" onClick={resetPortfolio}>
            RESET
          </button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Beteiligungen" value={companies.length} />
        <Metric label="Portfolio Value" value={`€${totalValue.toFixed(1)}m`} />
        <Metric label="Gesamtumsatz" value={`€${totalRevenue.toFixed(1)}m`} />
        <Metric label="Gesamt-EBITDA" value={`€${totalEbitda.toFixed(1)}m`} />
        <Metric label="Ø IRR" value={`${avgIrr.toFixed(1)}%`} />
        <Metric label="Ø MOIC" value={`${avgMoic.toFixed(2)}x`} />
        <Metric label="Attention" value={attentionCount} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">
          {editingId ? "Beteiligung bearbeiten" : "Neue Beteiligung"}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          <input className="input" placeholder="Unternehmen" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
          <input className="input" placeholder="Sektor" value={form.sector} onChange={(e) => updateForm("sector", e.target.value)} />
          <input className="input" placeholder="Revenue €m" type="number" value={form.revenue} onChange={(e) => updateForm("revenue", e.target.value)} />
          <input className="input" placeholder="EBITDA €m" type="number" value={form.ebitda} onChange={(e) => updateForm("ebitda", e.target.value)} />
          <input className="input" placeholder="Entry Multiple" type="number" value={form.entryMultiple} onChange={(e) => updateForm("entryMultiple", e.target.value)} />
          <input className="input" placeholder="Current Multiple" type="number" value={form.currentMultiple} onChange={(e) => updateForm("currentMultiple", e.target.value)} />
          <input className="input" placeholder="IRR %" type="number" value={form.irr} onChange={(e) => updateForm("irr", e.target.value)} />
          <input className="input" placeholder="MOIC" type="number" value={form.moic} onChange={(e) => updateForm("moic", e.target.value)} />

          <select className="input" value={form.status} onChange={(e) => updateForm("status", e.target.value)}>
            <option>Active</option>
            <option>Exit</option>
            <option>Watchlist</option>
          </select>

          <input className="input" placeholder="Notiz" value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} />

          <button className="btn btn-primary" onClick={saveCompany}>
            {editingId ? "SPEICHERN" : "HINZUFÜGEN"}
          </button>

          {editingId && (
            <button className="btn btn-ghost" onClick={cancelEdit}>
              ABBRECHEN
            </button>
          )}
        </div>
      </div>

      {selected && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">Detailansicht</div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
            <div>
              <h2 style={{ marginBottom: 6 }}>{selected.name}</h2>

              <div className="muted" style={{ marginBottom: 14 }}>
                {selected.sector} · {selected.status}
              </div>

              <div
                style={{
                  display: "inline-block",
                  color: selectedMetrics.healthColor,
                  border: `1px solid ${selectedMetrics.healthColor}`,
                  padding: "6px 10px",
                  borderRadius: 6,
                  marginBottom: 14,
                }}
              >
                {selectedMetrics.health}
              </div>

              {selectedMetrics.warning && (
                <div style={{ color: "var(--red)", marginBottom: 12 }}>
                  ⚠ {selectedMetrics.warning}
                </div>
              )}

              <div style={{ display: "grid", gap: 8 }}>
                <div>Revenue: €{selectedMetrics.revenue.toFixed(1)}m</div>
                <div>EBITDA: €{selectedMetrics.ebitda.toFixed(1)}m</div>
                <div>EBITDA-Marge: {selectedMetrics.margin.toFixed(1)}%</div>
                <div>Entry EV: €{selectedMetrics.entryEv.toFixed(1)}m</div>
                <div>Current EV: €{selectedMetrics.currentEv.toFixed(1)}m</div>
                <div>Value Creation: €{selectedMetrics.valueCreation.toFixed(1)}m</div>
                <div>
                  Multiple Expansion:{" "}
                  <span
                    style={{
                      color:
                        selectedMetrics.multipleExpansion >= 0
                          ? "var(--accent)"
                          : "var(--red)",
                    }}
                  >
                    {selectedMetrics.multipleExpansion.toFixed(1)}x
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="metric-card" style={{ marginBottom: 10 }}>
                <div className="metric-label">IRR</div>
                <div className="metric-value">
                  {Number(selected.irr || 0).toFixed(1)}%
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">MOIC</div>
                <div className="metric-value">
                  {Number(selected.moic || 0).toFixed(2)}x
                </div>
              </div>
            </div>
          </div>

          {selected.notes && (
            <div style={{ marginTop: 16 }}>
              <div className="card-title">Notizen</div>
              <div className="muted">{selected.notes}</div>
            </div>
          )}
        </div>
      )}

      <div className="market-grid">
        {companies.map((company) => {
          const m = calcCompany(company);

          return (
            <div
              className="market-card"
              key={company.id}
              onClick={() => setSelectedId(company.id)}
              style={{
                cursor: "pointer",
                borderColor:
                  selectedId === company.id ? "var(--accent)" : undefined,
              }}
            >
              <div className="market-card-name">{company.name}</div>
              <div className="muted">{company.sector}</div>

              <div
                style={{
                  marginTop: 10,
                  color: m.healthColor,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {m.health}
              </div>

              {m.warning && (
                <div style={{ color: "var(--red)", fontSize: 12, marginTop: 6 }}>
                  ⚠ {m.warning}
                </div>
              )}

              <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                <div>Revenue: €{m.revenue.toFixed(1)}m</div>
                <div>EBITDA: €{m.ebitda.toFixed(1)}m</div>
                <div>Marge: {m.margin.toFixed(1)}%</div>
                <div>EV: €{m.currentEv.toFixed(1)}m</div>
                <div>Status: {company.status}</div>
                <div>IRR: {Number(company.irr || 0).toFixed(1)}%</div>
                <div>MOIC: {Number(company.moic || 0).toFixed(2)}x</div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    editCompany(company);
                  }}
                >
                  BEARBEITEN
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCompany(company.id);
                  }}
                >
                  LÖSCHEN
                </button>
              </div>
            </div>
          );
        })}
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