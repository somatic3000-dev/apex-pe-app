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

const stageProbability = {
  "Initial Contact": 0.1,
  Screening: 0.2,
  NDA: 0.35,
  LOI: 0.6,
  "Due Diligence": 0.8,
  Closed: 1,
};

export default function DealPipeline() {
  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialDeals;
  });

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }, [deals]);

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function calcDeal(deal) {
    const revenue = Number(deal.revenue) || 0;
    const ebitda = Number(deal.ebitda) || 0;
    const multiple = Number(deal.multiple) || 0;
    const score = Number(deal.score) || 0;

    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
    const ev = ebitda * multiple;
    const probability = stageProbability[deal.status] ?? 0.2;
    const weightedValue = ev * probability;

    const icReady =
      score >= 75 &&
      ["LOI", "Due Diligence", "Closed"].includes(deal.status);

    const quality =
      score >= 80 ? "High Conviction" : score >= 60 ? "Review" : "Weak";

    const qualityColor =
      quality === "High Conviction"
        ? "var(--accent)"
        : quality === "Review"
        ? "var(--orange)"
        : "var(--red)";

    return {
      revenue,
      ebitda,
      multiple,
      margin,
      ev,
      probability,
      weightedValue,
      icReady,
      quality,
      qualityColor,
    };
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

  function exportCsv() {
    const headers = [
      "Name",
      "Sector",
      "Revenue",
      "EBITDA",
      "Margin",
      "Multiple",
      "EV",
      "Probability",
      "Weighted EV",
      "Status",
      "Priority",
      "Score",
      "IC Ready",
      "Quality",
    ];

    const rows = deals.map((deal) => {
      const m = calcDeal(deal);

      return [
        deal.name,
        deal.sector,
        m.revenue,
        m.ebitda,
        m.margin.toFixed(1),
        m.multiple,
        m.ev.toFixed(1),
        `${(m.probability * 100).toFixed(0)}%`,
        m.weightedValue.toFixed(1),
        deal.status,
        deal.priority,
        deal.score,
        m.icReady ? "Yes" : "No",
        m.quality,
      ];
    });

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
    link.download = "apex-deal-pipeline.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  const filteredDeals = [...deals]
    .filter((deal) => {
      const matchesSearch =
        (deal.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (deal.sector || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || deal.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || deal.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

  const totalPipelineRevenue = deals.reduce(
    (sum, d) => sum + (Number(d.revenue) || 0),
    0
  );

  const totalPipelineEbitda = deals.reduce(
    (sum, d) => sum + (Number(d.ebitda) || 0),
    0
  );

  const totalEv = deals.reduce((sum, d) => sum + calcDeal(d).ev, 0);

  const weightedPipeline = deals.reduce(
    (sum, d) => sum + calcDeal(d).weightedValue,
    0
  );

  const avgScore =
    deals.length > 0
      ? deals.reduce((sum, d) => sum + (Number(d.score) || 0), 0) / deals.length
      : 0;

  const highPriority = deals.filter((d) => d.priority === "High").length;
  const icReadyCount = deals.filter((d) => calcDeal(d).icReady).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            DEAL <span>PIPELINE</span>
          </div>
          <div className="page-sub">
            Stage Funnel · Weighted Value · IC Readiness
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={exportCsv}>
            CSV EXPORT
          </button>

          <button className="btn btn-ghost btn-sm" onClick={resetDeals}>
            RESET
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Search & Filter</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12,
          }}
        >
          <input
            className="input"
            placeholder="Deal suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>

          <select
            className="input"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="muted" style={{ marginTop: 10 }}>
          Angezeigt: {filteredDeals.length} von {deals.length} Deals
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Deals" value={deals.length} />
        <Metric label="Pipeline Revenue" value={`€${totalPipelineRevenue.toFixed(1)}m`} />
        <Metric label="Pipeline EBITDA" value={`€${totalPipelineEbitda.toFixed(1)}m`} />
        <Metric label="Gross EV" value={`€${totalEv.toFixed(1)}m`} />
        <Metric label="Weighted EV" value={`€${weightedPipeline.toFixed(1)}m`} />
        <Metric label="Ø Score" value={avgScore.toFixed(0)} />
        <Metric label="High Priority" value={highPriority} />
        <Metric label="IC Ready" value={icReadyCount} />
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
        <div className="card-title">Pipeline Funnel</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 10,
          }}
        >
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.status === stage);
            const stageEv = stageDeals.reduce(
              (sum, d) => sum + calcDeal(d).ev,
              0
            );
            const probability = stageProbability[stage] ?? 0;

            return (
              <div className="market-card" key={stage}>
                <div className="market-card-sym">{stage}</div>
                <div className="market-card-price">{stageDeals.length}</div>
                <div className="muted">EV: €{stageEv.toFixed(1)}m</div>
                <div className="muted">
                  Prob.: {(probability * 100).toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="market-grid">
        {filteredDeals.map((deal) => {
          const m = calcDeal(deal);

          const priorityColor =
            deal.priority === "High"
              ? "var(--accent)"
              : deal.priority === "Medium"
              ? "var(--orange)"
              : "var(--muted)";

          return (
            <div className="market-card" key={deal.id}>
              <div className="market-card-name">{deal.name}</div>
              <div className="muted">{deal.sector}</div>

              <div
                style={{
                  marginTop: 10,
                  color: m.qualityColor,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {m.quality}
              </div>

              {m.icReady && (
                <div style={{ color: "var(--accent)", fontSize: 12, marginTop: 6 }}>
                  IC READY
                </div>
              )}

              <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                <div>Revenue: €{m.revenue.toFixed(1)}m</div>
                <div>EBITDA: €{m.ebitda.toFixed(1)}m</div>
                <div>Marge: {m.margin.toFixed(1)}%</div>
                <div>EV: €{m.ev.toFixed(1)}m</div>
                <div>Weighted EV: €{m.weightedValue.toFixed(1)}m</div>
                <div>Status: {deal.status}</div>
                <div style={{ color: priorityColor }}>Priorität: {deal.priority}</div>
                <div>Score: {Number(deal.score || 0).toFixed(0)}/100</div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => editDeal(deal)}>
                  BEARBEITEN
                </button>

                <button className="btn btn-danger btn-sm" onClick={() => removeDeal(deal.id)}>
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