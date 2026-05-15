// src/pages/ICMemo.jsx

import { useMemo, useState } from "react";

const sectorPeerDefaults = {
  Software: ["MSFT", "CRM", "NOW", "SAP"],
  Healthcare: ["UNH", "ISRG", "SYK"],
  Energy: ["ENPH", "FSLR", "NEE"],
  Industrials: ["HON", "ETN", "PH"],
};

export default function ICMemo({ deals = [], marketContext = {} }) {
  const rankedDeals = useMemo(
    () =>
      [...deals].sort(
        (a, b) => (Number(b.score) || 0) - (Number(a.score) || 0)
      ),
    [deals]
  );

  const [selectedId, setSelectedId] = useState(rankedDeals[0]?.id || null);

  const selectedDeal =
    rankedDeals.find((deal) => deal.id === selectedId) || rankedDeals[0];

  const market = evaluateMarket(marketContext);

  function evaluateDeal(deal) {
    const score = Number(deal?.score) || 0;
    const multiple = Number(deal?.multiple) || 0;
    const revenue = Number(deal?.revenue) || 0;
    const ebitda = Number(deal?.ebitda) || 0;

    const peer = evaluateDealPeers(deal, marketContext);

    const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;
    const ev = ebitda * multiple;

    const expectedIrr = score >= 80 ? 28 : score >= 65 ? 20 : 12;

    const recommendation =
      score >= 80 ? "INVEST" : score >= 65 ? "FURTHER DD" : "REJECT";

    const risks = [];

    if (margin < 15) risks.push("Low EBITDA margin");
    if (multiple > 12) risks.push("High entry multiple");
    if (score < 60) risks.push("Weak IC score");
    if (!deal?.sector) risks.push("Sector not defined");
    if (market.tone === "Risk-off") risks.push("Risk-off market environment");
    if (market.peerSignal === "PE Peers weak") risks.push("Weak public PE sentiment");
    if (peer.signal === "Negative") risks.push("Negative sector peer basket");

    const upside = [];

    if (margin >= 20) upside.push("Strong profitability");
    if (score >= 80) upside.push("High conviction score");
    if (deal?.priority === "High") upside.push("High strategic priority");
    if (["LOI", "Due Diligence", "Closed"].includes(deal?.status)) {
      upside.push("Advanced pipeline stage");
    }
    if (market.tone === "Risk-on") upside.push("Supportive public market backdrop");
    if (market.peerSignal === "PE Peers strong") upside.push("Positive PE peer sentiment");
    if (peer.signal === "Positive") upside.push("Positive sector peer basket");

    const thesis = generateThesis(deal, margin, score, market, peer);
    const nextSteps = generateNextSteps(recommendation, market, peer);

    return {
      score,
      multiple,
      revenue,
      ebitda,
      margin,
      ev,
      expectedIrr,
      recommendation,
      risks,
      upside,
      thesis,
      nextSteps,
      peer,
    };
  }

  const memo = selectedDeal ? evaluateDeal(selectedDeal) : null;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            IC <span>MEMO</span>
          </div>

          <div className="page-sub">
            Investment Committee · Thesis · Market Context · Public Peers
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
          PRINT / PDF
        </button>
      </div>

      {rankedDeals.length === 0 && (
        <div className="card">
          <div className="card-title">Keine Deals vorhanden</div>
          <p className="muted">
            Erstelle zuerst Deals in der Deal Pipeline, um IC Memos zu
            generieren.
          </p>
        </div>
      )}

      {rankedDeals.length > 0 && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Deal auswählen</div>

            <select
              className="input"
              value={selectedDeal?.id || ""}
              onChange={(event) => setSelectedId(Number(event.target.value))}
            >
              {rankedDeals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.name} · Score {Number(deal.score || 0).toFixed(0)} ·{" "}
                  {deal.status}
                </option>
              ))}
            </select>
          </div>

          {selectedDeal && memo && (
            <>
              <div className="dashboard-grid" style={{ marginBottom: 20 }}>
                <Metric label="Revenue" value={`€${memo.revenue.toFixed(1)}m`} />
                <Metric label="EBITDA" value={`€${memo.ebitda.toFixed(1)}m`} />
                <Metric label="EBITDA Margin" value={`${memo.margin.toFixed(1)}%`} />
                <Metric label="Entry EV" value={`€${memo.ev.toFixed(1)}m`} />
                <Metric label="IC Score" value={`${memo.score.toFixed(0)}/100`} />
                <Metric label="Expected IRR" value={`${memo.expectedIrr}%`} />
                <Metric label="Market" value={market.tone} />
                <Metric label="Peer Basket" value={memo.peer.signal} />
              </div>

              <div className="card" style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div className="card-title">Investment Committee Memo</div>

                    <h2 style={{ margin: "0 0 6px" }}>{selectedDeal.name}</h2>

                    <div className="muted">
                      {selectedDeal.sector || "No sector"} · {selectedDeal.status} ·{" "}
                      {selectedDeal.priority} Priority
                    </div>
                  </div>

                  <RecommendationBadge recommendation={memo.recommendation} />
                </div>

                <div className="market-grid" style={{ marginTop: 20 }}>
                  <Section title="Investment Thesis">
                    <p className="muted" style={{ lineHeight: 1.7 }}>
                      {memo.thesis}
                    </p>
                  </Section>

                  <Section title="Recommendation">
                    <p className="muted" style={{ lineHeight: 1.7 }}>
                      Das System empfiehlt aktuell{" "}
                      <strong style={{ color: recommendationColor(memo.recommendation) }}>
                        {memo.recommendation}
                      </strong>
                      . Die Empfehlung berücksichtigt Score, Profitabilität,
                      Pipeline-Stage, Bewertungsniveau, Marktumfeld und Public
                      Peer Basket.
                    </p>
                  </Section>
                </div>
              </div>

              <div className="market-grid" style={{ marginBottom: 20 }}>
                <Section title="Market Environment">
                  <div style={{ display: "grid", gap: 10 }}>
                    <MemoRow label="Market Tone" value={market.tone} />
                    <MemoRow
                      label="Watchlist Avg."
                      value={`${market.avgChange.toFixed(2)}%`}
                    />
                    <MemoRow label="Gainers" value={market.gainers} />
                    <MemoRow label="Losers" value={market.losers} />
                    <MemoRow label="PE Peer Signal" value={market.peerSignal} />
                    <MemoRow
                      label="PE Peer Avg."
                      value={`${market.peerAvgChange.toFixed(2)}%`}
                    />
                  </div>

                  <p className="muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
                    {market.readThrough}
                  </p>
                </Section>

                <Section title="Public Peer Basket">
                  <div style={{ display: "grid", gap: 10 }}>
                    <MemoRow
                      label="Peers"
                      value={
                        memo.peer.peers.length > 0
                          ? memo.peer.peers.join(", ")
                          : "No peers available"
                      }
                    />
                    <MemoRow
                      label="Loaded"
                      value={`${memo.peer.loaded} / ${memo.peer.peers.length}`}
                    />
                    <MemoRow
                      label="Avg. Performance"
                      value={`${memo.peer.avgChange.toFixed(2)}%`}
                    />
                    <MemoRow label="Signal" value={memo.peer.signal} />
                  </div>

                  <p className="muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
                    {memo.peer.readThrough}
                  </p>
                </Section>

                <Section title="Upside">
                  {memo.upside.length > 0 ? (
                    <List items={memo.upside} color="var(--accent)" prefix="+" />
                  ) : (
                    <p className="muted">No major upside identified.</p>
                  )}
                </Section>

                <Section title="Risks">
                  {memo.risks.length > 0 ? (
                    <List items={memo.risks} color="var(--red)" prefix="⚠" />
                  ) : (
                    <p className="muted">No major risks identified.</p>
                  )}
                </Section>

                <Section title="Next Steps">
                  <List items={memo.nextSteps} color="var(--blue)" prefix="→" />
                </Section>
              </div>

              <div className="card">
                <div className="card-title">Deal Benchmark</div>

                <div style={{ display: "grid", gap: 12 }}>
                  <MemoRow label="Revenue" value={`€${memo.revenue.toFixed(1)}m`} />
                  <MemoRow label="EBITDA" value={`€${memo.ebitda.toFixed(1)}m`} />
                  <MemoRow label="EBITDA Margin" value={`${memo.margin.toFixed(1)}%`} />
                  <MemoRow label="Entry Multiple" value={`${memo.multiple.toFixed(1)}x`} />
                  <MemoRow label="Enterprise Value" value={`€${memo.ev.toFixed(1)}m`} />
                  <MemoRow label="Pipeline Stage" value={selectedDeal.status} />
                  <MemoRow label="Priority" value={selectedDeal.priority} />
                  <MemoRow label="IC Score" value={`${memo.score.toFixed(0)}/100`} />
                  <MemoRow
                    label="Market-Adjusted View"
                    value={
                      memo.peer.signal === "Positive"
                        ? "Potential multiple support"
                        : memo.peer.signal === "Negative"
                        ? "Multiple pressure risk"
                        : "Base-case valuation"
                    }
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function evaluateDealPeers(deal, marketContext = {}) {
  const quotes = marketContext.quotes || {};
  const sectorPeers = sectorPeerDefaults[deal?.sector] || [];
  const explicitPeers = parsePeerTickers(deal?.peerTickers);
  const peers = explicitPeers.length > 0 ? explicitPeers : sectorPeers;

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

  const readThrough =
    signal === "Positive"
      ? "The public peer basket is supportive. IC may consider stronger exit optionality and a more constructive valuation environment, subject to company-specific diligence."
      : signal === "Negative"
      ? "The public peer basket is under pressure. IC should be cautious on entry valuation, exit multiple and sensitivity assumptions."
      : signal === "Neutral"
      ? "The public peer basket is broadly stable. IC should rely primarily on company-specific quality, growth and margin evidence."
      : "No public peer data has been loaded yet. Open Marktdaten and refresh the watchlist to activate public-comp read-through.";

  return {
    peers,
    loaded: peerQuotes.length,
    avgChange,
    signal,
    readThrough,
  };
}

function parsePeerTickers(value) {
  if (Array.isArray(value)) {
    return value.map((ticker) => String(ticker).trim().toUpperCase()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((ticker) => ticker.trim().toUpperCase())
    .filter(Boolean);
}

function evaluateMarket(marketContext = {}) {
  const summary = marketContext.summary || {};
  const quotes = marketContext.quotes || {};

  const avgChange = Number(summary.avgChange) || 0;
  const gainers = Number(summary.gainers) || 0;
  const losers = Number(summary.losers) || 0;

  const tone =
    avgChange >= 1 ? "Risk-on" : avgChange <= -1 ? "Risk-off" : "Neutral";

  const pePeers = ["BX", "KKR", "APO", "CG"];
  const peerQuotes = pePeers.map((symbol) => quotes[symbol]).filter(Boolean);

  const peerAvgChange =
    peerQuotes.length > 0
      ? peerQuotes.reduce((sum, quote) => sum + (Number(quote.change) || 0), 0) /
        peerQuotes.length
      : 0;

  const peerSignal =
    peerAvgChange >= 1
      ? "PE Peers strong"
      : peerAvgChange <= -1
      ? "PE Peers weak"
      : "PE Peers stable";

  const readThrough =
    tone === "Risk-on"
      ? "Public markets are supportive. This can improve exit timing, confidence in growth assumptions and appetite for higher-quality assets."
      : tone === "Risk-off"
      ? "Market conditions are pressured. IC should apply stronger valuation discipline, downside protection and more conservative exit assumptions."
      : "Market conditions are mixed. IC should focus on company-specific performance, diligence quality and valuation sensitivity.";

  return {
    avgChange,
    gainers,
    losers,
    tone,
    peerAvgChange,
    peerSignal,
    readThrough,
  };
}

function generateThesis(deal, margin, score, market, peer) {
  const name = deal?.name || "The target";
  const sector = deal?.sector || "its sector";

  const marketSentence =
    market.tone === "Risk-on"
      ? "The current market backdrop is supportive for risk assets and may improve exit optionality."
      : market.tone === "Risk-off"
      ? "The current market backdrop is more cautious, requiring stronger downside protection and valuation discipline."
      : "The current market backdrop is mixed, so the investment case should rely primarily on company-specific fundamentals.";

  const peerSentence =
    peer.signal === "Positive"
      ? "Public comps are currently supportive and may provide valuation tailwind."
      : peer.signal === "Negative"
      ? "Public comps are currently under pressure, creating potential multiple compression risk."
      : peer.signal === "Neutral"
      ? "Public comps are broadly stable."
      : "Public comp data is not yet loaded.";

  if (score >= 80 && margin >= 20) {
    return `${name} represents a high-conviction investment opportunity in ${sector}, supported by strong profitability, attractive IC scoring and a mature pipeline position. ${marketSentence} ${peerSentence}`;
  }

  if (score >= 65) {
    return `${name} shows a credible investment case in ${sector}, but requires additional validation before final approval. Key focus areas should include margin quality, valuation discipline, revenue durability and management execution capability. ${marketSentence} ${peerSentence}`;
  }

  return `${name} currently does not meet the required IC threshold. The opportunity should remain under review only if strategic relevance, valuation or operating performance improves materially. ${marketSentence} ${peerSentence}`;
}

function generateNextSteps(recommendation, market, peer) {
  const marketStep =
    market.tone === "Risk-off"
      ? "Run downside case with lower exit multiple and delayed exit timing"
      : market.tone === "Risk-on"
      ? "Review upside case and exit readiness assumptions"
      : "Validate base case sensitivity against current market conditions";

  const peerStep =
    peer.signal === "Negative"
      ? "Update public comp sensitivity for lower exit multiple"
      : peer.signal === "Positive"
      ? "Review public comp upside case and exit window"
      : "Refresh public comp basket before final IC";

  if (recommendation === "INVEST") {
    return [
      "Finalize IC memo and investment thesis",
      "Confirm valuation and debt capacity",
      marketStep,
      peerStep,
      "Complete confirmatory due diligence",
      "Prepare final investment committee approval",
    ];
  }

  if (recommendation === "FURTHER DD") {
    return [
      "Deep-dive commercial due diligence",
      "Validate EBITDA quality and margin sustainability",
      "Review valuation sensitivity",
      marketStep,
      peerStep,
      "Update deal score after diligence findings",
    ];
  }

  return [
    "Document rejection rationale",
    marketStep,
    peerStep,
    "Monitor for valuation reset or improved KPIs",
    "Keep relationship warm only if strategically relevant",
  ];
}

function recommendationColor(recommendation) {
  if (recommendation === "INVEST") return "var(--accent)";
  if (recommendation === "FURTHER DD") return "var(--orange)";
  return "var(--red)";
}

function RecommendationBadge({ recommendation }) {
  return (
    <div
      style={{
        color: recommendationColor(recommendation),
        border: `1px solid ${recommendationColor(recommendation)}`,
        borderRadius: 999,
        padding: "8px 14px",
        fontWeight: 900,
        letterSpacing: "0.08em",
        fontSize: 12,
      }}
    >
      {recommendation}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      {children}
    </div>
  );
}

function List({ items, color, prefix }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((item) => (
        <div key={item} style={{ color, fontWeight: 700 }}>
          {prefix} {item}
        </div>
      ))}
    </div>
  );
}

function MemoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: "1px solid var(--border)",
        paddingBottom: 10,
      }}
    >
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