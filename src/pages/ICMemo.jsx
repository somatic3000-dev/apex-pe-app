// src/pages/ICMemo.jsx

import { useMemo, useState } from "react";

export default function ICMemo({ deals = [] }) {
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

  function evaluateDeal(deal) {
    const score = Number(deal?.score) || 0;
    const multiple = Number(deal?.multiple) || 0;
    const revenue = Number(deal?.revenue) || 0;
    const ebitda = Number(deal?.ebitda) || 0;

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

    const upside = [];

    if (margin >= 20) upside.push("Strong profitability");
    if (score >= 80) upside.push("High conviction score");
    if (deal?.priority === "High") upside.push("High strategic priority");
    if (["LOI", "Due Diligence", "Closed"].includes(deal?.status)) {
      upside.push("Advanced pipeline stage");
    }

    const thesis = generateThesis(deal, margin, score);
    const nextSteps = generateNextSteps(recommendation);

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
            Investment Committee · Thesis · Risk Review · Recommendation
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
                      . Die Empfehlung basiert auf Score, Profitabilität,
                      Pipeline-Stage und Bewertungsniveau.
                    </p>
                  </Section>
                </div>
              </div>

              <div className="market-grid" style={{ marginBottom: 20 }}>
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
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function generateThesis(deal, margin, score) {
  const name = deal?.name || "The target";
  const sector = deal?.sector || "its sector";

  if (score >= 80 && margin >= 20) {
    return `${name} represents a high-conviction investment opportunity in ${sector}, supported by strong profitability, attractive IC scoring and a mature pipeline position. The case should be advanced toward IC approval subject to final commercial, financial and legal due diligence.`;
  }

  if (score >= 65) {
    return `${name} shows a credible investment case in ${sector}, but requires additional validation before final approval. Key focus areas should include margin quality, valuation discipline, revenue durability and management execution capability.`;
  }

  return `${name} currently does not meet the required IC threshold. The opportunity should remain under review only if strategic relevance, valuation or operating performance improves materially.`;
}

function generateNextSteps(recommendation) {
  if (recommendation === "INVEST") {
    return [
      "Finalize IC memo and investment thesis",
      "Confirm valuation and debt capacity",
      "Complete confirmatory due diligence",
      "Prepare final investment committee approval",
    ];
  }

  if (recommendation === "FURTHER DD") {
    return [
      "Deep-dive commercial due diligence",
      "Validate EBITDA quality and margin sustainability",
      "Review valuation sensitivity",
      "Update deal score after diligence findings",
    ];
  }

  return [
    "Document rejection rationale",
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