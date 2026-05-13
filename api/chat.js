export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, portfolio = [], deals = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message fehlt" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        input: [
          {
            role: "system",
            content:
              "Du bist ein erfahrener Private-Equity-Partner. Analysiere Portfolio, Deals, Risiken, Value Creation, LBO-Logik und Exit-Optionen. Antworte präzise, zahlenorientiert und auf Deutsch.",
          },
          {
            role: "user",
            content: `
PORTFOLIO:
${JSON.stringify(portfolio, null, 2)}

DEALS:
${JSON.stringify(deals, null, 2)}

FRAGE:
${message}
            `,
          },
        ],
      }),
    });

    const data = await response.json();

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "Keine Antwort erhalten.";

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({
      error: "OpenAI Anfrage fehlgeschlagen",
    });
  }
}
