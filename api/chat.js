export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { message, portfolio = [], deals = [] } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message fehlt",
    });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
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
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    let text = "Keine Antwort erhalten.";

    if (data.output_text) {
      text = data.output_text;
    } else if (
      data.output &&
      data.output[0] &&
      data.output[0].content &&
      data.output[0].content[0]
    ) {
      text =
        data.output[0].content[0].text ||
        data.output[0].content[0].value ||
        JSON.stringify(data.output[0].content[0]);
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "OpenAI Anfrage fehlgeschlagen",
    });
  }
}