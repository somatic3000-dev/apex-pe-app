import { useEffect, useState } from "react";
import { initialDeals } from "../data/mockData";

const STORAGE_KEY = "apex_deals";

const emptyForm = {
  name: "",
  sector: "",
  revenue: "",
  ebitda: "",
  multiple: "",
  status: "Screening",
  priority: "Medium",
  score: "",
};

const stages = [
  "Initial Contact",
  "Screening",
  "NDA",
  "LOI",
  "Due Diligence",
  "Closed",
];

export default function DealPipeline() {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialDeals;
  });

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }, [deals]);

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function saveDeal() {
    if (!form.name.trim()) return;

    const revenue = Number(form.revenue) || 0;
    const ebitda = Number(form.ebitda) || 0;

    const deal = {
      id: editingId || Date.now(),
      name: form.name,
      sector: form.sector,
      revenue,
      ebitda,
      margin: revenue > 0 ? (ebitda / revenue) * 100 : 0,
      multiple: Number(form.multiple) || 0,
      status: form.status,
      priority: form.priority,
      score: Number(form.score) || 50,
    };

    if (editingId) {
      setDeals((prev) => prev.map((d) => (d.id === editingId ? deal : d)));
    } else {
      setDeals((prev) => [...prev, deal]);
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function editDeal(deal) {
    setEditingId(deal.id);
    setForm({
      name: deal.name || "",
      sector: deal.sector || "",
      revenue: deal.revenue || "",
      ebitda: deal.ebitda || "",
      multiple: deal.multiple || "",
      status: deal.status || "Screening",
      priority: deal.priority || "Medium",
      score: deal.score || "",
    });
  }

  function removeDeal(id) {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function resetDeals() {
    setDeals(initialDeals);
    localStorage.removeItem(STORAGE_KEY);
    cancelEdit();
  }

  const totalPipelineRevenue = deals.reduce(
    (sum, d) => sum + (Number(d.revenue) || 0),
    0
  );

  const totalPipelineEbitda = deals.reduce(
    (sum, d) => sum + (Number(d.ebitda) || 0),
    0
  );

  const avgScore =
    deals.length > 0
      ? deals.reduce((sum, d) => sum + (Number(d.score) || 0), 0) / deals.length
      : 0;

  const highPriority = deals.filter((d) => d.priority === "High").length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            DEAL <span>PIPELINE</span>
          </div>
          <div className="page-sub">
            Targets, Prioritäten, Scores und Status-Workflow
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={resetDeals}>
          RESET
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Deals" value={deals.length} />
        <Metric label="Pipeline Revenue" value={`€${totalPipelineRevenue.toFixed(1)}m`} />
        <Metric label="Pipeline EBITDA" value={`€${totalPipelineEbitda.toFixed(1)}m`} />
        <Metric label="Ø Score" value={avgScore.toFixed(0)} />
        <Metric label="High Priority" value={highPriority} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">
          {editingId ? "Deal bearbeiten" : "Neuer Deal"}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          <input
            className="input"
            placeholder="Unternehmen"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          />

          <input
            className="input"
            placeholder="Sektor"
            value={form.sector}
            onChange={(e) => updateForm("sector", e.target.value)}
          />

          <input
            className="input"
            placeholder="Revenue €m"
            type="number"
            value={form.revenue}
            onChange={(e) => updateForm("revenue", e.target.value)}
          />

          <input
            className="input"
            placeholder="EBITDA €m"
            type="number"
            value={form.ebitda}
            onChange={(e) => updateForm("ebitda", e.target.value)}
          />

          <input
            className="input"
            placeholder="EV/EBITDA Multiple"
            type="number"
            value={form.multiple}
            onChange={(e) => updateForm("multiple", e.target.value)}
          />

          <input
            className="input"
            placeholder="Score 0-100"
            type="number"
            value={form.score}
            onChange={(e) => updateForm("score", e.target.value)}
          />

          <select
            className="input"
            value={form.status}
            onChange={(e) => updateForm("status", e.target.value)}
          >
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>

          <select
            className="input"
            value={form.priority}
            onChange={(e) => updateForm("priority", e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button className="btn btn-primary" onClick={saveDeal}>
            {editingId ? "SPEICHERN" : "HINZUFÜGEN"}
          </button>

          {editingId && (
            <button className="btn btn-ghost" onClick={cancelEdit}>
              ABBRECHEN
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Pipeline Stages</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 10,
          }}
        >
          {stages.map((stage) => {
            const count = deals.filter((d) => d.status === stage).length;

            return (
              <div className="market-card" key={stage}>
                <div className="market-card-sym">{stage}</div>
                <div className="market-card-price">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="market-grid">
        {[...deals]
          .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
          .map((deal) => {
            const revenue = Number(deal.revenue) || 0;
            const ebitda = Number(deal.ebitda) || 0;
            const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
            const ev = ebitda * (Number(deal.multiple) || 0);

            return (
              <div className="market-card" key={deal.id}>
                <div className="market-card-name">{deal.name}</div>
                <div className="muted">{deal.sector}</div>

                <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                  <div>Revenue: €{revenue.toFixed(1)}m</div>
                  <div>EBITDA: €{ebitda.toFixed(1)}m</div>
                  <div>Marge: {margin.toFixed(1)}%</div>
                  <div>EV: €{ev.toFixed(1)}m</div>
                  <div>Status: {deal.status}</div>
                  <div>Priorität: {deal.priority}</div>
                  <div>Score: {Number(deal.score || 0).toFixed(0)}/100</div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => editDeal(deal)}
                  >
                    BEARBEITEN
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeDeal(deal.id)}
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