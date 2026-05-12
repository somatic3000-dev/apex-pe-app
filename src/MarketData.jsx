import { useEffect, useState } from "react";
import { WATCH_SYMBOLS } from "../data/mockData";
import { Sparkline, Spinner } from "../components/UI";

export default function MarketData({ finnhubKey, setFinnhubKey }) {
  const [temp, setTemp] = useState(finnhubKey || "");
  const [quotes, setQuotes] = useState({});
  const [selected, setSelected] = useState("SPY");
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState("");

  async function refresh() {
    if (!finnhubKey) return;

    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled(
        WATCH_SYMBOLS.map(async ({ sym }) => {
          const r = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${finnhubKey}`
          );

          if (!r.ok) {
            throw new Error(`HTTP ${r.status}`);
          }

          const d = await r.json();

          return {
            sym,
            quote: {
              current: d.c,
              changePercent: d.dp,
              high: d.h,
              low: d.l,
              open: d.o,
              previousClose: d.pc,
            },
          };
        })
      );

      const next = {};

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          next[result.value.sym] = result.value.quote;
        }
      });

      setQuotes(next);
      setLastUpdate(new Date());
    } catch (e) {
      setError("Finnhub-Daten konnten nicht geladen werden.");
    }

    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [finnhubKey]);

  useEffect(() => {
    if (!finnhubKey) return;

    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [finnhubKey]);

  const selectedQuote = quotes[selected];
  const selectedInfo = WATCH_SYMBOLS.find((s) => s.sym === selected);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            MARKT <span>DATEN</span>
          </div>
          <div className="page-sub">
            Live via Finnhub · PE Benchmarks · Auto-Refresh 60s
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {lastUpdate && (
            <span className="last-update">
              Update: {lastUpdate.toLocaleTimeString("de-DE")}
            </span>
          )}

          <button
            className="btn btn-ghost btn-sm"
            onClick={refresh}
            disabled={loading || !finnhubKey}
          >
            {loading ? <Spinner /> : "⟳ REFRESH"}
          </button>
        </div>
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
          {error && <span className="badge badge-red">{error}</span>}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setFinnhubKey("");
              setTemp("");
              setQuotes({});
            }}
          >
            KEY ÄNDERN
          </button>
        </div>
      )}

      <div className="market-grid">
        {WATCH_SYMBOLS.map(({ sym, name, relevance }) => {
          const q = quotes[sym];
          const positive = !q || q.changePercent >= 0;

          return (
            <div
              className={`market-card ${selected === sym ? "selected" : ""}`}
              key={sym}
              onClick={() => setSelected(sym)}
            >
              <div className="market-card-sym">
                {sym} · {relevance}
              </div>

              <div className="market-card-name">{name || sym}</div>

              {q ? (
                <>
                  <div
                    className="market-card-price"
                    style={{
                      color: positive ? "var(--accent)" : "var(--red)",
                    }}
                  >
                    ${q.current?.toFixed(2)}
                  </div>

                  <div
                    className="market-card-change"
                    style={{
                      color: positive ? "var(--accent)" : "var(--red)",
                    }}
                  >
                    {q.changePercent >= 0 ? "+" : ""}
                    {q.changePercent?.toFixed(2)}%
                  </div>

                  <Sparkline
                    data={[
                      q.previousClose || 0,
                      q.low || 0,
                      q.open || 0,
                      q.current || 0,
                      q.high || 0,
                    ]}
                    color={positive ? "var(--accent)" : "var(--red)"}
                  />
                </>
              ) : (
                <p className="muted">
                  {finnhubKey
                    ? loading
                      ? "Lade Daten..."
                      : "Keine Daten"
                    : "API-Key fehlt"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title">Detailansicht</div>

        {selectedQuote ? (
          <div>
            <h2 style={{ color: "var(--accent)", marginBottom: 10 }}>
              {selectedInfo?.name || selected}
            </h2>

            <table className="table">
              <tbody>
                <tr>
                  <td>Symbol</td>
                  <td className="mono">{selected}</td>
                </tr>
                <tr>
                  <td>Relevanz</td>
                  <td className="mono">{selectedInfo?.relevance}</td>
                </tr>
                <tr>
                  <td>Aktueller Kurs</td>
                  <td className="mono green">
                    ${selectedQuote.current?.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td>Veränderung</td>
                  <td
                    className="mono"
                    style={{
                      color:
                        selectedQuote.changePercent >= 0
                          ? "var(--accent)"
                          : "var(--red)",
                    }}
                  >
                    {selectedQuote.changePercent >= 0 ? "+" : ""}
                    {selectedQuote.changePercent?.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td>Eröffnung</td>
                  <td className="mono">${selectedQuote.open?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Tageshoch</td>
                  <td className="mono">${selectedQuote.high?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Tagestief</td>
                  <td className="mono">${selectedQuote.low?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Vortag</td>
                  <td className="mono">
                    ${selectedQuote.previousClose?.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">
            Wähle ein Symbol aus oder speichere deinen Finnhub API-Key.
          </p>
        )}
      </div>
    </div>
  );
}
