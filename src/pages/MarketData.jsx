import { useEffect, useState } from "react";
import { WATCH_SYMBOLS } from "../data/mockData";
import { Sparkline, Spinner } from "../components/UI";

const STORAGE_KEY = "apex_watch_symbols";

export default function MarketData({ finnhubKey, setFinnhubKey }) {
  const [temp, setTemp] = useState(finnhubKey || "");
  const [symbols, setSymbols] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : WATCH_SYMBOLS;
  });

  const [newSymbol, setNewSymbol] = useState("");
  const [newName, setNewName] = useState("");
  const [newRelevance, setNewRelevance] = useState("");

  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
  }, [symbols]);

  async function refresh() {
    if (!finnhubKey) return;
    setLoading(true);

    const next = {};

    for (const { sym } of symbols) {
      try {
        const r = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${finnhubKey}`
        );
        const d = await r.json();

        next[sym] = {
          c: d.c,
          dp: d.dp,
          h: d.h,
          l: d.l,
          pc: d.pc,
          o: d.o,
        };
      } catch {}
    }

    setQuotes(next);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [finnhubKey, symbols]);

  function addSymbol() {
    const sym = newSymbol.trim().toUpperCase();
    if (!sym) return;

    if (symbols.some((s) => s.sym === sym)) {
      alert("Dieses Symbol existiert bereits.");
      return;
    }

    setSymbols((prev) => [
      ...prev,
      {
        sym,
        name: newName.trim() || sym,
        relevance: newRelevance.trim() || "Watchlist",
      },
    ]);

    setNewSymbol("");
    setNewName("");
    setNewRelevance("");
  }

    setQuotes((prev) => {
      const copy = { ...prev };
      delete copy[sym];
      return copy;
    });
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
            Finnhub Watchlist · Hinzufügen & Löschen möglich
          </div>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={refresh}
          disabled={loading || !finnhubKey}
        >
          {loading ? <Spinner /> : "⟳ REFRESH"}
        </button>
      </div>

      {!finnhubKey ? (
        <div className="api-key-banner">
          <b>Finnhub API-Key erforderlich</b>
          <input
            className="input"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            placeholder="Finnhub API-Key"
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setFinnhubKey(temp.trim())}
          >
            SPEICHERN
          </button>
        </div>
      ) : (
        <div className="connected">
          <span className="badge badge-green">● API VERBUNDEN</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFinnhubKey("")}
          >
            KEY ÄNDERN
          </button>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Marktdaten hinzufügen</div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Ticker</label>
            <input
              className="input"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="z. B. AAPL"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="z. B. Apple"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Relevanz</label>
            <input
              className="input"
              value={newRelevance}
              onChange={(e) => setNewRelevance(e.target.value)}
              placeholder="z. B. Tech Benchmark"
            />
          </div>

          <div className="form-group" style={{ display: "flex", gap: 8, alignItems: "end" }}>
            <button className="btn btn-primary" onClick={addSymbol}>
              + HINZUFÜGEN
            </button>

            <button className="btn btn-ghost" onClick={resetSymbols}>
              RESET
            </button>
          </div>
        </div>
      </div>

      <div className="market-grid">
        {symbols.map(({ sym, name, relevance }) => {
          const q = quotes[sym];
          const pos = !q || q.dp >= 0;

          return (
            <div className="market-card" key={sym}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div className="market-card-sym">
                    {sym} · {relevance}
                  </div>
                  <div className="market-card-name">{name}</div>
                </div>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeSymbol(sym)}
                >
                  ×
                </button>
              </div>

              {q ? (
                <>
                  <div
                    className="market-card-price"
                    style={{ color: pos ? "var(--accent)" : "var(--red)" }}
                  >
                    ${q.c?.toFixed(2)}
                  </div>

                  <div
                    className="market-card-change"
                    style={{ color: pos ? "var(--accent)" : "var(--red)" }}
                  >
                    {q.dp >= 0 ? "+" : ""}
                    {q.dp?.toFixed(2)}%
                  </div>

                  <Sparkline
                    data={[q.pc || 0, q.l || 0, q.o || 0, q.c || 0, q.h || 0]}
                    color={pos ? "var(--accent)" : "var(--red)"}
                  />
                </>
              ) : (
                <p className="muted">
                  {finnhubKey ? "Keine Daten" : "API-Key fehlt"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
const [symbols, setSymbols] = useState(WATCH_SYMBOLS);
const [newSymbol, setNewSymbol] = useState("");
function addSymbol() {
  if (!newSymbol) return;

  setSymbols([
    ...symbols,
    {
      sym: newSymbol.toUpperCase(),
      name: newSymbol.toUpperCase(),
      relevance: "Custom"
    }
  ]);

  setNewSymbol("");
}