// src/pages/MarketData.jsx

import { useEffect, useMemo, useState } from "react";
import { WATCH_SYMBOLS } from "../data/mockData";

const STORAGE_KEY = "apex_market_watchlist";
const API_KEY_STORAGE = "apex_finnhub_key";

const ENV_FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY || "";

function normalizeWatchlist(items = []) {
  return items.map((item) => {
    if (typeof item === "string") {
      return {
        sym: item,
        name: item,
        relevance: "Watchlist",
      };
    }

    return {
      sym: item.sym || item.symbol || item.name,
      name: item.name || item.sym || item.symbol,
      relevance: item.relevance || "Watchlist",
    };
  });
}

export default function MarketData() {
  const defaultSymbols = useMemo(() => normalizeWatchlist(WATCH_SYMBOLS), []);

  const [symbols, setSymbols] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeWatchlist(JSON.parse(saved)) : defaultSymbols;
  });

  const [ticker, setTicker] = useState("");

  const [manualApiKey, setManualApiKey] = useState(
    () => localStorage.getItem(API_KEY_STORAGE) || ""
  );

  const [tempKey, setTempKey] = useState(manualApiKey);

  const apiKey = ENV_FINNHUB_KEY || manualApiKey;

  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
  }, [symbols]);

  useEffect(() => {
    localStorage.setItem(API_KEY_STORAGE, manualApiKey);
  }, [manualApiKey]);

  useEffect(() => {
    if (apiKey && symbols.length > 0) {
      refreshQuotes();
    }
  }, [apiKey, symbols]);

  async function refreshQuotes() {
    if (!apiKey) return;

    setLoading(true);

    const next = {};

    for (const item of symbols) {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${item.sym}&token=${apiKey}`
        );

        const data = await response.json();

        if (data && Number(data.c) > 0) {
          next[item.sym] = {
            price: Number(data.c) || 0,
            change: Number(data.dp) || 0,
            high: Number(data.h) || 0,
            low: Number(data.l) || 0,
            open: Number(data.o) || 0,
            previousClose: Number(data.pc) || 0,
          };
        } else {
          next[item.sym] = null;
        }
      } catch {
        next[item.sym] = null;
      }
    }

    setQuotes(next);
    setLastUpdated(new Date());
    setLoading(false);
  }

  function saveManualApiKey() {
    setManualApiKey(tempKey.trim());
  }

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
    setSymbols((prev) => prev.filter((item) => item.sym !== sym));
  }

  function resetSymbols() {
    setSymbols(defaultSymbols);
    localStorage.removeItem(STORAGE_KEY);
  }

  const marketSummary = useMemo(() => {
    const availableQuotes = Object.values(quotes).filter(Boolean);

    const gainers = availableQuotes.filter((q) => q.change > 0).length;
    const losers = availableQuotes.filter((q) => q.change < 0).length;

    const avgChange =
      availableQuotes.length > 0
        ? availableQuotes.reduce((sum, q) => sum + q.change, 0) /
          availableQuotes.length
        : 0;

    return {
      loaded: availableQuotes.length,
      gainers,
      losers,
      avgChange,
    };
  }, [quotes]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            MARKT <span>DATEN</span>
          </div>

          <div className="page-sub">
            Finnhub Live Watchlist · Public Markets · PE Benchmarks
          </div>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={refreshQuotes}
          disabled={loading || !apiKey}
        >
          {loading ? "LÄDT..." : "⟳ REFRESH"}
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Ticker" value={symbols.length} />
        <Metric label="Loaded" value={marketSummary.loaded} />
        <Metric label="Gainers" value={marketSummary.gainers} />
        <Metric label="Losers" value={marketSummary.losers} />
        <Metric label="Ø Change" value={`${marketSummary.avgChange.toFixed(2)}%`} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Finnhub API-Key</div>

        {ENV_FINNHUB_KEY ? (
          <div className="muted">
            API-Key wird über Vercel Environment Variable geladen.
          </div>
        ) : (
          <>
            <div className="market-grid">
              <input
                className="input"
                value={tempKey}
                onChange={(event) => setTempKey(event.target.value)}
                placeholder="Finnhub API-Key"
              />

              <button className="btn btn-primary" onClick={saveManualApiKey}>
                SPEICHERN
              </button>
            </div>

            <div className="muted" style={{ marginTop: 10 }}>
              Kein Vercel API-Key gefunden. Du kannst temporär hier einen lokalen
              Key speichern.
            </div>
          </>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Ticker hinzufügen</div>

        <div className="market-grid">
          <input
            className="input"
            value={ticker}
            onChange={(event) => setTicker(event.target.value)}
            placeholder="z. B. AAPL, MSFT, NVDA"
          />

          <button className="btn btn-primary" onClick={addSymbol}>
            HINZUFÜGEN
          </button>

          <button className="btn btn-ghost" onClick={resetSymbols}>
            RESET
          </button>
        </div>

        {lastUpdated && (
          <div className="muted" style={{ marginTop: 10 }}>
            Letztes Update: {lastUpdated.toLocaleString("de-DE")}
          </div>
        )}
      </div>

      <div className="market-grid">
        {symbols.map((item) => {
          const quote = quotes[item.sym];
          const positive = Number(quote?.change) >= 0;

          return (
            <div className="market-card" key={item.sym}>
              <div className="muted">{item.sym}</div>

              <div className="market-card-name">{item.name}</div>

              <div className="muted">{item.relevance}</div>

              {quote ? (
                <>
                  <div
                    className="market-card-price"
                    style={{
                      color: positive ? "var(--accent)" : "var(--red)",
                    }}
                  >
                    ${quote.price.toFixed(2)}
                  </div>

                  <div
                    style={{
                      color: positive ? "var(--accent)" : "var(--red)",
                      fontWeight: 800,
                      marginTop: 6,
                    }}
                  >
                    {positive ? "+" : ""}
                    {quote.change.toFixed(2)}%
                  </div>

                  <div style={{ display: "grid", gap: 6, marginTop: 14 }}>
                    <InfoRow label="Open" value={`$${quote.open.toFixed(2)}`} />
                    <InfoRow label="High" value={`$${quote.high.toFixed(2)}`} />
                    <InfoRow label="Low" value={`$${quote.low.toFixed(2)}`} />
                    <InfoRow
                      label="Prev. Close"
                      value={`$${quote.previousClose.toFixed(2)}`}
                    />
                  </div>
                </>
              ) : (
                <div className="muted" style={{ marginTop: 14 }}>
                  {apiKey ? "Keine Daten verfügbar" : "API-Key fehlt"}
                </div>
              )}

              <button
                className="btn btn-danger btn-sm"
                style={{ marginTop: 14 }}
                onClick={() => removeSymbol(item.sym)}
              >
                LÖSCHEN
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span className="muted">{label}</span>
      <strong>{value}</strong>
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