export default function ICMemo({
  deals = [],
}) {
  const rankedDeals = [...deals].sort(
    (a, b) =>
      (Number(b.score) || 0) -
      (Number(a.score) || 0)
  );

  function evaluateDeal(deal) {
    const score =
      Number(deal.score) || 0;

    const multiple =
      Number(deal.multiple) || 0;

    const revenue =
      Number(deal.revenue) || 0;

    const ebitda =
      Number(deal.ebitda) || 0;

    const margin =
      revenue > 0
        ? (ebitda / revenue) * 100
        : 0;

    const expectedIrr =
      score >= 80
        ? 28
        : score >= 65
        ? 20
        : 12;

    const recommendation =
      score >= 80
        ? "INVEST"
        : score >= 65
        ? "FURTHER DD"
        : "REJECT";

    const risks = [];

    if (margin < 15) {
      risks.push(
        "Low EBITDA Margin"
      );
    }

    if (multiple > 12) {
      risks.push(
        "High Entry Multiple"
      );
    }

    if (score < 60) {
      risks.push(
        "Weak IC Score"
      );
    }

    const upside = [];

    if (margin >= 20) {
      upside.push(
        "Strong Profitability"
      );
    }

    if (score >= 80) {
      upside.push(
        "High Conviction"
      );
    }

    if (
      deal.priority === "High"
    ) {
      upside.push(
        "High Strategic Priority"
      );
    }

    return {
      margin,
      expectedIrr,
      recommendation,
      risks,
      upside,
    };
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            IC <span>MEMO</span>
          </div>

          <div className="page-sub">
            Investment Committee
            Decision Engine
          </div>
        </div>
      </div>

      <div
        className="market-grid"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit,minmax(380px,1fr))",
        }}
      >
        {rankedDeals.map((deal) => {
          const m =
            evaluateDeal(deal);

          return (
            <div
              className="card"
              key={deal.id}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom: 16,
                }}
              >
                <div>
                  <div className="market-card-name">
                    {deal.name}
                  </div>

                  <div className="muted">
                    {deal.sector}
                  </div>
                </div>

                <div
                  style={{
                    color:
                      m.recommendation ===
                      "INVEST"
                        ? "var(--accent)"
                        : m.recommendation ===
                          "FURTHER DD"
                        ? "var(--orange)"
                        : "var(--red)",
                    fontWeight: 700,
                  }}
                >
                  {
                    m.recommendation
                  }
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                <div>
                  Revenue: €
                  {Number(
                    deal.revenue || 0
                  ).toFixed(1)}
                  m
                </div>

                <div>
                  EBITDA: €
                  {Number(
                    deal.ebitda || 0
                  ).toFixed(1)}
                  m
                </div>

                <div>
                  EBITDA Margin:{" "}
                  {m.margin.toFixed(1)}
                  %
                </div>

                <div>
                  Entry Multiple:{" "}
                  {Number(
                    deal.multiple || 0
                  ).toFixed(1)}
                  x
                </div>

                <div>
                  Expected IRR:{" "}
                  {
                    m.expectedIrr
                  }
                  %
                </div>

                <div>
                  IC Score:{" "}
                  {
                    deal.score
                  }
                  /100
                </div>

                <div>
                  Status:{" "}
                  {
                    deal.status
                  }
                </div>
              </div>

              <div
                style={{
                  marginBottom: 14,
                }}
              >
                <div
                  className="card-title"
                  style={{
                    marginBottom: 8,
                  }}
                >
                  Upside
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 6,
                  }}
                >
                  {m.upside.length >
                  0 ? (
                    m.upside.map(
                      (u) => (
                        <div
                          key={u}
                          style={{
                            color:
                              "var(--accent)",
                          }}
                        >
                          + {u}
                        </div>
                      )
                    )
                  ) : (
                    <div className="muted">
                      No major upside
                      identified.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div
                  className="card-title"
                  style={{
                    marginBottom: 8,
                  }}
                >
                  Risks
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 6,
                  }}
                >
                  {m.risks.length >
                  0 ? (
                    m.risks.map(
                      (r) => (
                        <div
                          key={r}
                          style={{
                            color:
                              "var(--red)",
                          }}
                        >
                          ⚠ {r}
                        </div>
                      )
                    )
                  ) : (
                    <div className="muted">
                      No major risks
                      identified.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}