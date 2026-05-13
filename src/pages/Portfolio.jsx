// src/pages/Portfolio.jsx

import { useEffect, useState } from "react";
import { initialPortfolio } from "../data/mockData";

export default function Portfolio() {
  const STORAGE_KEY = "apex_portfolio";

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved
      ? JSON.parse(saved)
      : initialPortfolio;
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

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [selectedId, setSelectedId] =
    useState(null);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(companies)
    );
  }, [companies]);

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function saveCompany() {
    if (!form.name.trim()) return;

    const company = {
      id: editingId || Date.now(),

      name: form.name.trim(),

      sector: form.sector.trim(),

      revenue:
        Number(form.revenue) || 0,

      ebitda:
        Number(form.ebitda) || 0,

      entryMultiple:
        Number(form.entryMultiple) || 0,

      currentMultiple:
        Number(form.currentMultiple) || 0,

      irr:
        Number(form.irr) || 0,

      moic:
        Number(form.moic) || 1,

      status:
        form.status || "Active",

      notes: form.notes.trim(),
    };

    if (editingId) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? company
            : c
        )
      );

      setSelectedId(company.id);
    } else {
      setCompanies((prev) => [
        ...prev,
        company,
      ]);

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
      revenue:
        company.revenue || "",
      ebitda:
        company.ebitda || "",
      entryMultiple:
        company.entryMultiple || "",
      currentMultiple:
        company.currentMultiple || "",
      irr: company.irr || "",
      moic: company.moic || "",
      status:
        company.status || "Active",
      notes: company.notes || "",
    });
  }

  function removeCompany(id) {
    setCompanies((prev) =>
      prev.filter((c) => c.id !== id)
    );

    if (selectedId === id)
      setSelectedId(null);

    if (editingId === id)
      cancelEdit();
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function resetPortfolio() {
    setCompanies(initialPortfolio);

    localStorage.removeItem(
      STORAGE_KEY
    );

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
          .map((value) =>
            `"${String(
              value ?? ""
            ).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "apex-portfolio.csv";

    link.click();

    URL.revokeObjectURL(url);
  }

  function calcCompany(company) {
    const revenue =
      Number(company?.revenue) || 0;

    const ebitda =
      Number(company?.ebitda) || 0;

    const entryMultiple =
      Number(company?.entryMultiple) ||
      0;

    const currentMultiple =
      Number(
        company?.currentMultiple
      ) || entryMultiple;

    const irr =
      Number(company?.irr) || 0;

    const moic =
      Number(company?.moic) || 0;

    const margin =
      revenue > 0
        ? (ebitda / revenue) * 100
        : 0;

    const entryEv =
      ebitda * entryMultiple;

    const currentEv =
      ebitda * currentMultiple;

    const multipleExpansion =
      currentMultiple -
      entryMultiple;

    const valueCreation =
      currentEv - entryEv;

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

  const totalRevenue =
    companies.reduce(
      (sum, c) =>
        sum +
        (Number(c.revenue) || 0),
      0
    );

  const totalEbitda =
    companies.reduce(
      (sum, c) =>
        sum +
        (Number(c.ebitda) || 0),
      0
    );

  const avgIrr =
    companies.length > 0
      ? companies.reduce(
          (sum, c) =>
            sum +
            (Number(c.irr) || 0),
          0
        ) / companies.length
      : 0;

  const avgMoic =
    companies.length > 0
      ? companies.reduce(
          (sum, c) =>
            sum +
            (Number(c.moic) || 0),
          0
        ) / companies.length
      : 0;

  const totalValue =
    companies.reduce((sum, c) => {
      const m = calcCompany(c);

      return sum + m.currentEv;
    }, 0);

  const attentionCount =
    companies.filter(
      (c) =>
        calcCompany(c).health ===
        "Attention"
    ).length;

  const selected =
    companies.find(
      (c) => c.id === selectedId
    ) || companies[0];

  const selectedMetrics =
    calcCompany(selected);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            PORT <span>FOLIO</span>
          </div>

          <div className="page-sub">
            Beteiligungen · Monitoring
            · Value Creation
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button
            className="btn btn-ghost btn-sm"
            onClick={exportCsv}
          >
            CSV EXPORT
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={resetPortfolio}
          >
            RESET
          </button>
        </div>
      </div>

      <div
        className="dashboard-grid"
        style={{ marginBottom: 20 }}
      >
        <Metric
          label="Beteiligungen"
          value={companies.length}
        />

        <Metric
          label="Portfolio Value"
          value={`€${totalValue.toFixed(
            1
          )}m`}
        />

        <Metric
          label="Gesamtumsatz"
          value={`€${totalRevenue.toFixed(
            1
          )}m`}
        />

        <Metric
          label="Gesamt-EBITDA"
          value={`€${totalEbitda.toFixed(
            1
          )}m`}
        />

        <Metric
          label="Ø IRR"
          value={`${avgIrr.toFixed(
            1
          )}%`}
        />

        <Metric
          label="Ø MOIC"
          value={`${avgMoic.toFixed(
            2
          )}x`}
        />

        <Metric
          label="Attention"
          value={attentionCount}
        />
      </div>
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