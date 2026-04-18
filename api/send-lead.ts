import https from "https";

export default async function handler(req: any, res: any) {
  // Vercel Serverless Functions automatically handle routing
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, text, name } = req.body;

  // TEST MODE
  if (name && name.toUpperCase() === "TEST") {
    return res.status(200).json({ success: true, info: "Vercel API is alive and responding!" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ 
      error: "Конфигурация не найдена", 
      details: "Проверьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в панели Vercel (Settings -> Environment Variables)" 
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
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000,
    };

    const telegramReq = https.request(options, (telegramRes) => {
      let responseBody = '';
      telegramRes.on('data', (chunk) => { responseBody += chunk; });
      telegramRes.on('end', () => {
        if (telegramRes.statusCode && telegramRes.statusCode >= 200 && telegramRes.statusCode < 300) {
          res.status(200).json({ success: true });
        } else {
          console.error("Telegram error:", telegramRes.statusCode, responseBody);
          res.status(500).json({ error: "Telegram API Error", status: telegramRes.statusCode, details: responseBody });
        }
        resolve(true);
      });
    });

    telegramReq.on('error', (error) => {
      console.error("HTTPS request error:", error);
      res.status(500).json({ error: "Network error", details: error.message });
      resolve(true);
    });

    telegramReq.write(postData);
    telegramReq.end();
  });
}
