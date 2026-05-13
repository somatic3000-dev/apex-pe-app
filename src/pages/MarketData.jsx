import { useEffect, useState } from "react";
import { WATCH_SYMBOLS } from "../data/mockData";

export default function MarketData() {
  const STORAGE_KEY = "apex_market_watchlist";
  const API_KEY_STORAGE = "apex_finnhub_key";

  const [symbols, setSymbols] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : WATCH_SYMBOLS;
  });

  const [ticker, setTicker] = useState("");

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem(API_KEY_STORAGE) || "";
  });

  const [tempKey, setTempKey] = useState(apiKey);

  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
  }, [symbols]);

  useEffect(() => {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
  }, [apiKey]);

  useEffect(() => {
    refreshQuotes();
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

        next[item.sym] = {
          price: data.c,
          change: data.dp,
          high: data.h,
          low: data.l,
        };
      } catch {
        next[item.sym] = null;
      }
    }

    setQuotes(next);
    setLoading(false);
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
            Finnhub Live Watchlist
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

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">
          Finnhub API-Key
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
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Finnhub API-Key"
          />

          <button
            className="btn btn-primary"
            onClick={() => setApiKey(tempKey.trim())}
          >
            SPEICHERN
          </button>
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
        {symbols.map((item) => {
          const quote = quotes[item.sym];
          const positive = quote?.change >= 0;

          return (
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

              {quote ? (
                <>
                  <div
                    className="market-card-price"
                    style={{
                      color: positive
                        ? "var(--accent)"
                        : "var(--red)",
                    }}
                  >
                    ${quote.price?.toFixed(2)}
                  </div>

                  <div
                    className="market-card-change"
                    style={{
                      color: positive
                        ? "var(--accent)"
                        : "var(--red)",
                    }}
                  >
                    {positive ? "+" : ""}
                    {quote.change?.toFixed(2)}%
                  </div>

                  <div className="muted">
                    H: ${quote.high?.toFixed(2)} ·
                    L: ${quote.low?.toFixed(2)}
                  </div>
                </>
              ) : (
                <div className="muted">
                  {apiKey
                    ? "Keine Daten"
                    : "API-Key fehlt"}
                </div>
              )}

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
          );
        })}
      </div>
    </div>
  );
}