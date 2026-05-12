export default async function handler(req, res) {
  const apiKey = process.env.FINNHUB_API_KEY;

  const symbols = [
    "MSFT",
    "NVDA",
    "AMZN",
    "GOOGL",
    "META"
  ];

  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
        );

        const data = await response.json();

        return {
          symbol,
          price: data.c,
          change: data.dp
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      error: "Finnhub API Fehler"
    });
  }
}
