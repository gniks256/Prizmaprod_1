import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Telegram API endpoint
app.post("/api/send-lead", async (req, res) => {
  const { subject, html, text } = req.body;
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Missing Telegram configuration");
    return res.status(500).json({ error: "Telegram notifications not configured" });
  }

  // Convert HTML-ish lead data to Telegram Markdown or plain text
  // For simplicity, we'll use the 'text' property if provided, or a simplified version of subject
  const message = `
<b>${subject || 'Новая заявка'}</b>
${text || 'Новые данные на сайте'}
`.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (response.ok) {
      res.json({ success: true });
    } else {
      const errorData = await response.json();
      console.error("Telegram API error:", errorData);
      res.status(500).json({ error: "Failed to send Telegram message" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen if not running as a Vercel serverless function
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
