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
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8493812803:AAHilr-GUFAwENIV8oca0z8eXcuvp6KN9L8';
  const chatId = process.env.TELEGRAM_CHAT_ID || '374517327';

  if (!botToken || !chatId) {
    const missing = [];
    if (!botToken) missing.push("TELEGRAM_BOT_TOKEN");
    if (!chatId) missing.push("TELEGRAM_CHAT_ID");
    
    console.error(`Missing Telegram configuration: ${missing.join(", ")}`);
    return res.status(500).json({ 
      error: "Telegram notifications not configured", 
      details: `В настройках Vercel отсутствуют переменные: ${missing.join(", ")}` 
    });
  }

  const message = `
<b>${subject || 'Новая заявка'}</b>
${text || 'Новые данные на сайте'}
`.trim();

  // Abort signal for the fetch call to Telegram
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds for Telegram to respond

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      res.json({ success: true });
    } else {
      const errorData = await response.json();
      console.error("Telegram API error:", errorData);
      res.status(500).json({ 
        error: "Failed to send Telegram message", 
        telegramError: errorData 
      });
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Server error:", error);
    res.status(500).json({ 
      error: error.name === 'AbortError' ? "Telegram API timeout" : "Internal server error",
      details: error.message 
    });
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
