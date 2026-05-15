// src/pages/Reporting.jsx

import { Pill } from "../components/UI";

function parsePeerTickers(value) {
  if (Array.isArray(value)) {
    return value.map((ticker) => String(ticker).trim().toUpperCase()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((ticker) => ticker.trim().toUpperCase())
    .filter(Boolean);
}

function getPeerMetrics(company, quotes = {}) {
  const peers = parsePeerTickers(company.peerTickers);
  const peerQuotes = peers.map((ticker) => quotes[ticker]).filter(Boolean);

  const avgChange =
    peerQuotes.length > 0
      ? peerQuotes.reduce((sum, quote) => sum + (Number(quote.change) || 0), 0) /
        peerQuotes.length
      : 0;

  const signal =
    avgChange >= 1
      ? "Positive"
      : avgChange <= -1
      ? "Negative"
      : peerQuotes.length > 0
      ? "Neutral"
      : "No Data";

  const color =
    signal === "Positive"
      ? "var(--accent)"
      : signal === "Negative"
      ? "var(--red)"
      : signal === "Neutral"
      ? "var(--orange)"
      : "var(--muted)";

  return {
    peers,
    loaded: peerQuotes.length,
    avgChange,
    signal,
    color,
  };
}

function getMarketContext(marketContext = {}) {
  const summary = marketContext.summary || {};
  const quotes = marketContext.quotes || {};

  const avgChange = Number(summary.avgChange) || 0;
  const gainers = Number(summary.gainers) || 0;
  const losers = Number(summary.losers) || 0;
  const loaded = Number(summary.loaded) || 0;

  const tone =
    avgChange >= 1 ? "Risk-on" : avgChange <= -1 ? "Risk-off" : "Neutral";

  const pePeers = ["BX", "KKR", "APO", "CG"];
  const peerQuotes = pePeers.map((symbol) => quotes[symbol]).filter(Boolean);

  const pePeerAvg =
    peerQuotes.length > 0
      ? peerQuotes.reduce((sum, quote) => sum + (Number(quote.change) || 0), 0) /
        peerQuotes.length
      : 0;

  const pePeerSignal =
    pePeerAvg >= 1
      ? "PE Peers strong"
      : pePeerAvg <= -1
      ? "PE Peers weak"
      : "PE Peers stable";

  return {
    loaded,
    gainers,
    losers,
    avgChange,
    tone,
    pePeerAvg,
    pePeerSignal,
  };
}

export default function Reporting({
  portfolio = [],
  fund = {},
  marketContext = {},
}) {
  const active = portfolio.filter((p) => p.status === "Active");
  const exits = portfolio.filter((p) => p.status === "Exit");
  const market = getMarketContext(marketContext);
  const quotes = marketContext.quotes || {};

  function companyValue(p) {
    const ebitda = Number(p.ebitda) || 0;
    const multiple = Number(p.currentMultiple) || Number(p.entryMultiple) || 0;
    return ebitda * multiple;
  }

  const portfolioValue = active.reduce((sum, p) => sum + companyValue(p), 0);
  const dryPowder = Number(fund.dryPowder) || 0;
  const dynamicAum = portfolioValue + dryPowder;

  const avgIrr =
    active.length > 0
      ? active.reduce((s, p) => s + (Number(p.irr) || 0), 0) / active.length
      : 0;

  const avgMoic =
    active.length > 0
      ? active.reduce((s, p) => s + (Number(p.moic) || 0), 0) / active.length
      : 0;

  const totalRevenue = active.reduce(
    (s, p) => s + (Number(p.revenue) || 0),
    0
  );

  const totalEbitda = active.reduce(
    (s, p) => s + (Number(p.ebitda) || 0),
    0
  );

  const topPerformer = [...active].sort(
    (a, b) => (Number(b.irr) || 0) - (Number(a.irr) || 0)
  )[0];

  const underperformer = [...active].sort(
    (a, b) => (Number(a.irr) || 0) - (Number(b.irr) || 0)
  )[0];

  const peerMetrics = active.map((company) => getPeerMetrics(company, quotes));

  const loadedPeerBaskets = peerMetrics.filter((peer) => peer.loaded > 0);

  const portfolioPeerAvg =
    loadedPeerBaskets.length > 0
      ? loadedPeerBaskets.reduce((sum, peer) => sum + peer.avgChange, 0) /
        loadedPeerBaskets.length
      : 0;

  const portfolioPeerSignal =
    portfolioPeerAvg >= 1
      ? "Positive"
      : portfolioPeerAvg <= -1
      ? "Negative"
      : loadedPeerBaskets.length > 0
      ? "Neutral"
      : "No Data";

  const marketComment =
    market.tone === "Risk-on"
      ? "Das Marktumfeld war zuletzt konstruktiv. Dies unterstützt grundsätzlich Exit-Optionalität, Bewertungsstabilität und Transaktionsbereitschaft."
      : market.tone === "Risk-off"
      ? "Das Marktumfeld war zuletzt defensiver. Der Fonds fokussiert daher weiterhin auf Bewertungsdisziplin, Downside Protection und operative Wertsteigerung."
      : "Das Marktumfeld war gemischt. Der Fonds priorisiert weiterhin company-spezifische Performance, Liquiditätsspielraum und selektive Kapitalallokation.";

  const peerComment =
    portfolioPeerSignal === "Positive"
      ? "Die Public-Comp-Baskets der aktiven Beteiligungen zeigen positive Dynamik und können als unterstützendes Markt-Signal für Bewertungsannahmen dienen."
      : portfolioPeerSignal === "Negative"
      ? "Die Public-Comp-Baskets der aktiven Beteiligungen stehen unter Druck. Bewertungsannahmen und Exit-Multiples sollten konservativ geprüft werden."
      : portfolioPeerSignal === "Neutral"
      ? "Die Public-Comp-Baskets der aktiven Beteiligungen sind weitgehend stabil."
      : "Für die Public-Comp-Baskets liegen noch keine ausreichenden Live-Marktdaten vor.";

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            LP <span>REPORTING</span>
          </div>

          <div className="page-sub">
            Quarterly Portfolio Report · Market Context · Peer Read-Through
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
          PRINT / PDF
        </button>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Gross IRR" value={`${avgIrr.toFixed(1)}%`} />
        <Metric label="Avg. MOIC" value={`${avgMoic.toFixed(2)}x`} />
        <Metric label="AUM" value={`€${dynamicAum.toFixed(1)}M`} />
        <Metric label="Portfolio Value" value={`€${portfolioValue.toFixed(1)}M`} />
        <Metric label="Dry Powder" value={`€${dryPowder.toFixed(1)}M`} />
        <Metric label="Active Companies" value={active.length} />
        <Metric label="Market Tone" value={market.tone} />
        <Metric label="Peer Signal" value={portfolioPeerSignal} />
        <Metric label="Revenue" value={`€${totalRevenue.toFixed(1)}m`} />
        <Metric label="EBITDA" value={`€${totalEbitda.toFixed(1)}m`} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Executive Summary</div>

        <div style={{ display: "grid", gap: 10, lineHeight: 1.6 }}>
          <div>
            Der Fonds hält aktuell <b>{active.length}</b> aktive Beteiligungen und
            hat <b>{exits.length}</b> realisierte Exits.
          </div>

          <div>
            Das aktive Portfolio erwirtschaftet aggregiert{" "}
            <b>€{totalRevenue.toFixed(1)}m Umsatz</b> und{" "}
            <b>€{totalEbitda.toFixed(1)}m EBITDA</b>.
          </div>

          <div>
            Der aktuelle Portfolio-Wert beträgt{" "}
            <b>€{portfolioValue.toFixed(1)}M</b>. Das gesamte verwaltete
            Vermögen liegt bei <b>€{dynamicAum.toFixed(1)}M</b>.
          </div>

          <div>
            Die durchschnittliche Performance liegt bei{" "}
            <b>{avgIrr.toFixed(1)}% IRR</b> und{" "}
            <b>{avgMoic.toFixed(2)}x MOIC</b>.
          </div>

          <div>{marketComment}</div>

          <div>{peerComment}</div>
        </div>
      </div>

      <div className="market-grid" style={{ marginBottom: 20 }}>
        <div className="market-card">
          <div className="card-title">Market Context</div>
          <div className="market-card-name">{market.tone}</div>
          <div className="market-card-price">
            {market.avgChange.toFixed(2)}%
          </div>
          <div className="muted">
            {market.gainers} gainers · {market.losers} losers · {market.loaded} loaded
          </div>
        </div>

        <div className="market-card">
          <div className="card-title">PE Peer Signal</div>
          <div className="market-card-name">{market.pePeerSignal}</div>
          <div className="market-card-price">
            {market.pePeerAvg.toFixed(2)}%
          </div>
          <div className="muted">BX · KKR · APO · CG</div>
        </div>

        <div className="market-card">
          <div className="card-title">Portfolio Peer Basket</div>
          <div className="market-card-name">{portfolioPeerSignal}</div>
          <div className="market-card-price">
            {portfolioPeerAvg.toFixed(2)}%
          </div>
          <div className="muted">
            {loadedPeerBaskets.length} aktive Peer Baskets geladen
          </div>
        </div>
      </div>

      <div className="market-grid" style={{ marginBottom: 20 }}>
        {topPerformer && (
          <div className="market-card">
            <div className="card-title">Top Performer</div>
            <div className="market-card-name">{topPerformer.name}</div>
            <div className="muted">{topPerformer.sector}</div>
            <div className="market-card-price" style={{ color: "var(--accent)" }}>
              {Number(topPerformer.irr || 0).toFixed(1)}% IRR
            </div>
            <div className="muted">
              {Number(topPerformer.moic || 0).toFixed(2)}x MOIC
            </div>
          </div>
        )}

        {underperformer && (
          <div className="market-card">
            <div className="card-title">Underperformer</div>
            <div className="market-card-name">{underperformer.name}</div>
            <div className="muted">{underperformer.sector}</div>
            <div className="market-card-price" style={{ color: "var(--orange)" }}>
              {Number(underperformer.irr || 0).toFixed(1)}% IRR
            </div>
            <div className="muted">
              {Number(underperformer.moic || 0).toFixed(2)}x MOIC
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Portfolio Performance</div>

        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Unternehmen</th>
                <th>Sektor</th>
                <th>Revenue</th>
                <th>EBITDA</th>
                <th>Value</th>
                <th>IRR</th>
                <th>MOIC</th>
                <th>Peer Signal</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {portfolio.map((p) => {
                const peer = getPeerMetrics(p, quotes);

                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sector}</td>
                    <td>€{Number(p.revenue || 0).toFixed(1)}m</td>
                    <td>€{Number(p.ebitda || 0).toFixed(1)}m</td>
                    <td>€{companyValue(p).toFixed(1)}m</td>
                    <td>{Number(p.irr || 0).toFixed(1)}%</td>
                    <td>{Number(p.moic || 0).toFixed(2)}x</td>
                    <td style={{ color: peer.color, fontWeight: 800 }}>
                      {peer.signal} · {peer.avgChange.toFixed(2)}%
                    </td>
                    <td>
                      <Pill type={p.status === "Exit" ? "gray" : "green"}>
                        {p.status}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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