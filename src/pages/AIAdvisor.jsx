import { useState } from "react";

const QUICK_PROMPTS = [
  "Welche Beteiligung hat das höchste Upside?",
  "Welche Company sollte verkauft werden?",
  "Wo ist das größte Risiko im Portfolio?",
  "Welche Deal Opportunity ist am attraktivsten?",
  "Erstelle ein Investment Memo",
];

export default function AIAdvisor({ portfolio = [], deals = [] }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "APEX PE KI-Berater bereit.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(textOverride) {
    const text = textOverride || input;

    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          portfolio,
          deals,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text || data.error || "Keine Antwort erhalten.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Fehler beim Abrufen der KI-Antwort.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            KI <span>BERATER</span>
          </div>

          <div className="page-sub">
            OpenAI PE Investment Assistant
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Quick Prompts</div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              className="btn btn-ghost btn-sm"
              onClick={() => sendMessage(p)}
              disabled={loading}
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
          AI Chat {loading ? "· denkt..." : ""}
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
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
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
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>
                {msg.role === "user" ? "YOU" : "APEX AI"}
              </div>

              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Frage den KI Berater..."
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button
            className="btn btn-primary"
            onClick={() => sendMessage()}
            disabled={loading}
          >
            {loading ? "..." : "SENDEN"}
          </button>
        </div>
      </div>
    </div>
  );
}
