import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Support for simple GET test
app.get("/api/send-lead", (req, res) => {
  res.json({ message: "API is alive. Use POST to send leads." });
});

// Telegram API endpoint
app.post("/api/send-lead", (req, res) => {
  const { subject, html, text } = req.body;
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8493812803:AAHilr-GUFAwENIV8oca0z8eXcuvp6KN9L8';
  const chatId = process.env.TELEGRAM_CHAT_ID || '374517327';

  if (!botToken || !chatId) {
    const missing = [];
    if (!botToken) missing.push("TELEGRAM_BOT_TOKEN");
    if (!chatId) missing.push("TELEGRAM_CHAT_ID");
    return res.status(500).json({ 
      error: "Telegram configuration missing", 
      details: missing.join(", ") 
    });
  }

  const message = `
${subject || 'Новая заявка'}
---
${text || 'Новые данные на сайте'}
`.trim();

  const postData = JSON.stringify({
    chat_id: chatId,
    text: message,
    // Removed HTML parse_mode to avoid parsing errors
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${botToken}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
    timeout: 7000,
  };

  const telegramReq = https.request(options, (telegramRes) => {
    let responseBody = '';
    telegramRes.on('data', (chunk) => { responseBody += chunk; });
    telegramRes.on('end', () => {
      if (telegramRes.statusCode && telegramRes.statusCode >= 200 && telegramRes.statusCode < 300) {
        res.json({ success: true, info: "Message sent" });
      } else {
        console.error("Telegram error:", telegramRes.statusCode, responseBody);
        res.status(500).json({ error: "Telegram API error", status: telegramRes.statusCode, details: responseBody });
      }
    });
  });

  telegramReq.on('error', (error) => {
    console.error("HTTPS request error:", error);
    res.status(500).json({ error: "Network error calling Telegram", details: error.message });
  });

  telegramReq.on('timeout', () => {
    telegramReq.destroy();
    res.status(504).json({ error: "Telegram API took too long to respond" });
  });

  telegramReq.write(postData);
  telegramReq.end();
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
