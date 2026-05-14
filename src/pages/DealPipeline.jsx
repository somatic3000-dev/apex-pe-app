// src/pages/DealPipeline.jsx

import { useMemo, useState } from "react";

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

export default function DealPipeline({ deals = [], setDeals }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      score >= 75 && ["LOI", "Due Diligence", "Closed"].includes(deal.status);

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
      score,
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
    if (!form.name.trim()) {
      alert("Bitte Unternehmensname eintragen.");
      return;
    }

    const revenue = Number(form.revenue) || 0;
    const ebitda = Number(form.ebitda) || 0;

    const deal = {
      id: editingId || Date.now(),
      name: form.name.trim(),
      sector: form.sector.trim(),
      revenue,
      ebitda,
      margin: revenue > 0 ? (ebitda / revenue) * 100 : 0,
      multiple: Number(form.multiple) || 0,
      status: form.status,
      priority: form.priority,
      score: Number(form.score) || 50,
    };

    if (editingId) {
      setDeals((prev) => prev.map((item) => (item.id === editingId ? deal : item)));
    } else {
      setDeals((prev) => [deal, ...prev]);
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
    if (!confirm("Diesen Deal löschen?")) return;

    setDeals((prev) => prev.filter((deal) => deal.id !== id));

    if (editingId === id) {
      cancelEdit();
    }
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
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
      const metrics = calcDeal(deal);

      return [
        deal.name,
        deal.sector,
        metrics.revenue,
        metrics.ebitda,
        metrics.margin.toFixed(1),
        metrics.multiple,
        metrics.ev.toFixed(1),
        `${(metrics.probability * 100).toFixed(0)}%`,
        metrics.weightedValue.toFixed(1),
        deal.status,
        deal.priority,
        deal.score,
        metrics.icReady ? "Yes" : "No",
        metrics.quality,
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

  const filteredDeals = useMemo(() => {
    return [...deals]
      .filter((deal) => {
        const q = search.toLowerCase();

        const matchesSearch =
          (deal.name || "").toLowerCase().includes(q) ||
          (deal.sector || "").toLowerCase().includes(q) ||
          (deal.status || "").toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "All" || deal.status === statusFilter;

        const matchesPriority =
          priorityFilter === "All" || deal.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
  }, [deals, search, statusFilter, priorityFilter]);

  const metrics = useMemo(() => {
    const totalRevenue = deals.reduce(
      (sum, deal) => sum + (Number(deal.revenue) || 0),
      0
    );

    const totalEbitda = deals.reduce(
      (sum, deal) => sum + (Number(deal.ebitda) || 0),
      0
    );

    const grossEv = deals.reduce((sum, deal) => sum + calcDeal(deal).ev, 0);

    const weightedEv = deals.reduce(
      (sum, deal) => sum + calcDeal(deal).weightedValue,
      0
    );

    const avgScore =
      deals.length > 0
        ? deals.reduce((sum, deal) => sum + (Number(deal.score) || 0), 0) /
          deals.length
        : 0;

    const highPriority = deals.filter((deal) => deal.priority === "High").length;
    const icReady = deals.filter((deal) => calcDeal(deal).icReady).length;

    return {
      totalRevenue,
      totalEbitda,
      grossEv,
      weightedEv,
      avgScore,
      highPriority,
      icReady,
    };
  }, [deals]);

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

        <div className="button-row">
          <button className="btn btn-ghost btn-sm" onClick={exportCsv}>
            CSV EXPORT
          </button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Deals" value={deals.length} />
        <Metric label="Pipeline Revenue" value={`€${metrics.totalRevenue.toFixed(1)}m`} />
        <Metric label="Pipeline EBITDA" value={`€${metrics.totalEbitda.toFixed(1)}m`} />
        <Metric label="Gross EV" value={`€${metrics.grossEv.toFixed(1)}m`} />
        <Metric label="Weighted EV" value={`€${metrics.weightedEv.toFixed(1)}m`} />
        <Metric label="Ø Score" value={metrics.avgScore.toFixed(0)} />
        <Metric label="High Priority" value={metrics.highPriority} />
        <Metric label="IC Ready" value={metrics.icReady} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Search & Filter</div>

        <div className="market-grid">
          <input
            className="input"
            placeholder="Deal suchen..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="input"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All</option>
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>

          <select
            className="input"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
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

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">
          {editingId ? "Deal bearbeiten" : "Neuer Deal"}
        </div>

        <div className="market-grid">
          <input
            className="input"
            placeholder="Unternehmen"
            value={form.name}
            onChange={(event) => updateForm("name", event.target.value)}
          />

          <input
            className="input"
            placeholder="Sektor"
            value={form.sector}
            onChange={(event) => updateForm("sector", event.target.value)}
          />

          <input
            className="input"
            placeholder="Revenue €m"
            type="number"
            value={form.revenue}
            onChange={(event) => updateForm("revenue", event.target.value)}
          />

          <input
            className="input"
            placeholder="EBITDA €m"
            type="number"
            value={form.ebitda}
            onChange={(event) => updateForm("ebitda", event.target.value)}
          />

          <input
            className="input"
            placeholder="EV/EBITDA Multiple"
            type="number"
            value={form.multiple}
            onChange={(event) => updateForm("multiple", event.target.value)}
          />

          <input
            className="input"
            placeholder="Score 0-100"
            type="number"
            value={form.score}
            onChange={(event) => updateForm("score", event.target.value)}
          />

          <select
            className="input"
            value={form.status}
            onChange={(event) => updateForm("status", event.target.value)}
          >
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>

          <select
            className="input"
            value={form.priority}
            onChange={(event) => updateForm("priority", event.target.value)}
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

        <div className="market-grid">
          {stages.map((stage) => {
            const stageDeals = deals.filter((deal) => deal.status === stage);
            const stageEv = stageDeals.reduce(
              (sum, deal) => sum + calcDeal(deal).ev,
              0
            );

            const probability = stageProbability[stage] ?? 0;

            return (
              <div className="market-card" key={stage}>
                <div className="muted">{stage}</div>

                <div className="market-card-price">{stageDeals.length}</div>

                <div className="muted">EV: €{stageEv.toFixed(1)}m</div>

                <div className="muted">
                  Probability: {(probability * 100).toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="market-grid">
        {filteredDeals.map((deal) => {
          const metrics = calcDeal(deal);

          return (
            <DealCard
              key={deal.id}
              deal={deal}
              metrics={metrics}
              onEdit={() => editDeal(deal)}
              onRemove={() => removeDeal(deal.id)}
            />
          );
        })}

        {filteredDeals.length === 0 && (
          <div className="card">
            <div className="card-title">Keine Deals gefunden</div>
            <p className="muted">
              Passe Suchbegriff oder Filter an, um Deals anzuzeigen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DealCard({ deal, metrics, onEdit, onRemove }) {
  const priorityColor =
    deal.priority === "High"
      ? "var(--red)"
      : deal.priority === "Medium"
      ? "var(--orange)"
      : "var(--accent)";

  return (
    <div
      className="market-card"
      style={{
        borderLeft: `4px solid ${metrics.icReady ? "var(--accent)" : metrics.qualityColor}`,
      }}
    >
      <div className="market-card-name">{deal.name}</div>

      <div className="muted">{deal.sector}</div>

      <div
        style={{
          marginTop: 10,
          color: metrics.qualityColor,
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: "0.08em",
        }}
      >
        {metrics.quality}
      </div>

      {metrics.icReady && (
        <div
          style={{
            color: "var(--accent)",
            fontSize: 12,
            fontWeight: 900,
            marginTop: 6,
          }}
        >
          IC READY
        </div>
      )}

      <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
        <InfoRow label="Revenue" value={`€${metrics.revenue.toFixed(1)}m`} />
        <InfoRow label="EBITDA" value={`€${metrics.ebitda.toFixed(1)}m`} />
        <InfoRow label="Margin" value={`${metrics.margin.toFixed(1)}%`} />
        <InfoRow label="EV" value={`€${metrics.ev.toFixed(1)}m`} />
        <InfoRow
          label="Weighted EV"
          value={`€${metrics.weightedValue.toFixed(1)}m`}
        />
        <InfoRow label="Status" value={deal.status} />
        <InfoRow label="Priority" value={deal.priority} color={priorityColor} />
        <InfoRow label="Score" value={`${metrics.score.toFixed(0)}/100`} />
      </div>

      <div className="button-row" style={{ marginTop: 14 }}>
        <button className="btn btn-ghost btn-sm" onClick={onEdit}>
          BEARBEITEN
        </button>

        <button className="btn btn-danger btn-sm" onClick={onRemove}>
          LÖSCHEN
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span className="muted">{label}</span>
      <strong style={{ color }}>{value}</strong>
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