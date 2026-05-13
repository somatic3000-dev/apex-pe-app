export default async function handler(req, res) {
  try {
    const { message } = req.body;

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
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("OPENAI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    return res.status(200).json({
      text: JSON.stringify(data, null, 2),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      text: "SERVER ERROR",
    });
  }
}
