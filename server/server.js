import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ AI Server Error:", errorText);
      return res.status(500).json({ reply: "⚠️ Failed to connect to AI server." });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("❌ AI Server Error:", error.message);
    res.status(500).json({ reply: "⚠️ Failed to connect to AI server." });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
