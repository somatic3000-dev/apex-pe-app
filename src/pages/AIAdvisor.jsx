import { useState } from "react";

const QUICK_PROMPTS = [
  "Welche Beteiligung hat das höchste Upside?",
  "Welche Company sollte verkauft werden?",
  "Wo ist das größte Risiko im Portfolio?",
  "Welche Deal Opportunity ist am attraktivsten?",
  "Erstelle ein Investment Memo",
];

export default function AIAdvisor({
  portfolio = [],
  deals = [],
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "APEX PE KI-Berater bereit.",
    },
  ]);

  const [input, setInput] = useState("");

  function sendMessage(textOverride) {
    const text = textOverride || input;

    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      text,
    };

    let response =
      "Analyse abgeschlossen.";

    if (
      text.toLowerCase().includes("upside")
    ) {
      const best =
        portfolio.sort(
          (a, b) =>
            (b.irr || 0) -
            (a.irr || 0)
        )[0];

      response = best
        ? `${best.name} zeigt aktuell das höchste Upside mit ${best.irr}% IRR und ${best.moic}x MOIC.`
        : "Keine Daten verfügbar.";
    }

    if (
      text.toLowerCase().includes("risiko")
    ) {
      const risk =
        portfolio.sort(
          (a, b) =>
            (a.score || 0) -
            (b.score || 0)
        )[0];

      response = risk
        ? `${risk.name} weist aktuell das höchste Risiko auf.`
        : "Keine Risikodaten vorhanden.";
    }

    if (
      text.toLowerCase().includes("deal")
    ) {
      const topDeal =
        deals.sort(
          (a, b) =>
            (b.score || 0) -
            (a.score || 0)
        )[0];

      response = topDeal
        ? `${topDeal.name} ist aktuell der attraktivste Deal mit einem Score von ${topDeal.score}.`
        : "Keine Deal-Daten vorhanden.";
    }

    if (
      text.toLowerCase().includes("memo")
    ) {
      response =
        "Investment Memo:\n\n• Markt attraktiv\n• EBITDA Wachstum solide\n• Multiple Expansion möglich\n• Empfehlung: Further DD";
    }

    const assistantMessage = {
      role: "assistant",
      text: response,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            KI <span>BERATER</span>
          </div>

          <div className="page-sub">
            AI Investment Assistant
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div className="card-title">
          Quick Prompts
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              className="btn btn-ghost btn-sm"
              onClick={() =>
                sendMessage(p)
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div
        className="card"
        style={{
          minHeight: 420,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="card-title">
          AI Chat
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 20,
            overflow: "auto",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf:
                  msg.role === "user"
                    ? "flex-end"
                    : "flex-start",
                maxWidth: "80%",
                padding: 14,
                borderRadius: 12,
                background:
                  msg.role === "user"
                    ? "rgba(201,255,59,0.12)"
                    : "rgba(255,255,255,0.05)",
                border:
                  msg.role === "user"
                    ? "1px solid rgba(201,255,59,0.3)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.6,
                  marginBottom: 6,
                }}
              >
                {msg.role === "user"
                  ? "YOU"
                  : "APEX AI"}
              </div>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <input
            className="input"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Frage den KI Berater..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            className="btn btn-primary"
            onClick={() =>
              sendMessage()
            }
          >
            SENDEN
          </button>
        </div>
      </div>
    </div>
  );
}
