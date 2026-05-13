import { useEffect, useState } from "react";
import { initialPortfolio } from "../data/mockData";

export default function Portfolio() {
  const STORAGE_KEY = "apex_portfolio";

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialPortfolio;
  });

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [revenue, setRevenue] = useState("");
  const [ebitda, setEbitda] = useState("");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(companies)
    );
  }, [companies]);

  function addCompany() {
    if (!name.trim()) return;

    const newCompany = {
      id: Date.now(),
      name,
      sector,
      revenue: Number(revenue),
      ebitda: Number(ebitda),
      status: "Active",
      irr: 0,
      moic: 1,
    };

    setCompanies((prev) => [
      ...prev,
      newCompany,
    ]);

    setName("");
    setSector("");
    setRevenue("");
    setEbitda("");
  }

  function removeCompany(id) {
    setCompanies((prev) =>
      prev.filter((c) => c.id !== id)
    );
  }

  const totalRevenue = companies.reduce(
    (sum, c) => sum + (c.revenue || 0),
    0
  );

  const totalEbitda = companies.reduce(
    (sum, c) => sum + (c.ebitda || 0),
    0
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            PORT <span>FOLIO</span>
          </div>

          <div className="page-sub">
            Private Equity Beteiligungen
          </div>
        </div>
      </div>

      <div
        className="dashboard-grid"
        style={{ marginBottom: 20 }}
      >
        <div className="metric-card">
          <div className="metric-label">
            Beteiligungen
          </div>

          <div className="metric-value">
            {companies.length}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            Gesamtumsatz
          </div>

          <div className="metric-value">
            €{totalRevenue.toFixed(1)}m
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            Gesamt-EBITDA
          </div>

          <div className="metric-value">
            €{totalEbitda.toFixed(1)}m
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div className="card-title">
          Neue Beteiligung
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12,
          }}
        >
          <input
            className="input"
            placeholder="Unternehmen"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            className="input"
            placeholder="Sektor"
            value={sector}
            onChange={(e) =>
              setSector(e.target.value)
            }
          />

          <input
            className="input"
            placeholder="Revenue"
            value={revenue}
            onChange={(e) =>
              setRevenue(e.target.value)
            }
          />

          <input
            className="input"
            placeholder="EBITDA"
            value={ebitda}
            onChange={(e) =>
              setEbitda(e.target.value)
            }
          />

          <button
            className="btn btn-primary"
            onClick={addCompany}
          >
            HINZUFÜGEN
          </button>
        </div>
      </div>

      <div className="market-grid">
        {companies.map((company) => (
          <div
            className="market-card"
            key={company.id}
          >
            <div className="market-card-name">
              {company.name}
            </div>

            <div className="muted">
              {company.sector}
            </div>

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gap: 6,
              }}
            >
              <div>
                Umsatz: €
                {company.revenue}m
              </div>

              <div>
                EBITDA: €
                {company.ebitda}m
              </div>

              <div>
                Status: {company.status}
              </div>

              <div>
                IRR: {company.irr}%
              </div>

              <div>
                MOIC: {company.moic}x
              </div>
            </div>

            <button
              className="btn btn-danger btn-sm"
              style={{ marginTop: 12 }}
              onClick={() =>
                removeCompany(company.id)
              }
            >
              LÖSCHEN
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}