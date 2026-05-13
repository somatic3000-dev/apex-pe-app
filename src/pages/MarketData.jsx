import { useEffect, useState } from "react";
import { WATCH_SYMBOLS } from "../data/mockData";

export default function MarketData() {
  const STORAGE_KEY = "apex_market_watchlist";

  const [symbols, setSymbols] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : WATCH_SYMBOLS;
  });

  const [ticker, setTicker] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
  }, [symbols]);

  function addSymbol() {
    const sym = ticker.trim().toUpperCase();

    if (!sym) return;

    if (symbols.some((item) => item.sym === sym)) {
      alert("Ticker existiert bereits.");
      return;
    }

    setSymbols((prev) => [
      ...prev,
      {
        sym,
        name: sym,
        relevance: "Custom",
      },
    ]);

    setTicker("");
  }

  function removeSymbol(sym) {
    setSymbols((prev) =>
      prev.filter((item) => item.sym !== sym)
    );
  }

  function resetSymbols() {
    setSymbols(WATCH_SYMBOLS);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            MARKT <span>DATEN</span>
          </div>

          <div className="page-sub">
            Watchlist hinzufügen und löschen
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">
          Ticker hinzufügen
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <input
            className="input"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="z. B. AAPL"
          />

          <button
            className="btn btn-primary"
            onClick={addSymbol}
          >
            HINZUFÜGEN
          </button>

          <button
            className="btn btn-ghost"
            onClick={resetSymbols}
          >
            RESET
          </button>
        </div>
      </div>

      <div className="market-grid">
        {symbols.map((item) => (
          <div
            className="market-card"
            key={item.sym}
          >
            <div className="market-card-sym">
              {item.sym}
            </div>

            <div className="market-card-name">
              {item.name}
            </div>

            <div className="muted">
              {item.relevance}
            </div>

            <button
              className="btn btn-danger btn-sm"
              style={{ marginTop: 12 }}
              onClick={() =>
                removeSymbol(item.sym)
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