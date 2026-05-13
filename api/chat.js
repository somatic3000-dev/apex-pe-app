export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message, portfolio = [], deals = [] } = req.body;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content:
                "Du bist ein Elite Private Equity Investment Partner. Analysiere Deals, Risiken, Renditen, MOIC, IRR, Value Creation und Exit Strategien. Antworte professionell und präzise auf Deutsch.",
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
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    const text =
      data?.choices?.[0]?.message?.content ||
      "Keine Antwort erhalten.";

    return res.status(200).json({
      text,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "OpenAI Anfrage fehlgeschlagen",
    });
  }
}
