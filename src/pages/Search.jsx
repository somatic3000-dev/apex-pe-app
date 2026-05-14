import { useMemo, useState } from "react";

export default function Search({ portfolio = [], deals = [], tasks = [] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    const portfolioResults = portfolio
      .filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.sector || "").toLowerCase().includes(q)
      )
      .map((p) => ({
        type: "Portfolio",
        title: p.name,
        subtitle: p.sector,
        meta: `${Number(p.irr || 0).toFixed(1)}% IRR · ${Number(
          p.moic || 0
        ).toFixed(2)}x MOIC`,
      }));

    const dealResults = deals
      .filter(
        (d) =>
          (d.name || "").toLowerCase().includes(q) ||
          (d.sector || "").toLowerCase().includes(q) ||
          (d.status || "").toLowerCase().includes(q)
      )
      .map((d) => ({
        type: "Deal",
        title: d.name,
        subtitle: `${d.sector} · ${d.status}`,
        meta: `Score ${Number(d.score || 0).toFixed(0)} · ${d.priority}`,
      }));

    const taskResults = tasks
      .filter(
        (t) =>
          (t.title || "").toLowerCase().includes(q) ||
          (t.owner || "").toLowerCase().includes(q) ||
          (t.relatedDeal || "").toLowerCase().includes(q)
      )
      .map((t) => ({
        type: "Task",
        title: t.title,
        subtitle: t.relatedDeal || "General",
        meta: `${t.priority} · ${t.status} · ${t.owner || "No owner"}`,
      }));

    return [...portfolioResults, ...dealResults, ...taskResults];
  }, [query, portfolio, deals, tasks]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            GLOBAL <span>SEARCH</span>
          </div>
          <div className="page-sub">Portfolio · Deals · Tasks</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <input
          className="input"
          placeholder="Suchen..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ height: 56, fontSize: 18 }}
        />

        <div className="muted" style={{ marginTop: 10 }}>
          {query.trim()
            ? `${results.length} Ergebnisse gefunden`
            : "Suchbegriff eingeben"}
        </div>
      </div>

      <div className="market-grid">
        {results.map((result, index) => {
          const color =
            result.type === "Portfolio"
              ? "var(--accent)"
              : result.type === "Deal"
              ? "var(--orange)"
              : "var(--blue)";

          return (
            <div className="market-card" key={index}>
              <div
                style={{
                  color,
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {result.type}
              </div>

              <div className="market-card-name">{result.title}</div>
              <div className="muted">{result.subtitle}</div>
              <div style={{ marginTop: 10 }}>{result.meta}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}