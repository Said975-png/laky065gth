// Import all route handlers directly for serverless compatibility
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, user-id"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Parse request URL and method
  const { url, method } = req;

  try {
    // Health check endpoint
    if (url === "/api/ping" && method === "GET") {
      return res.json({
        message: "Hello from Vercel serverless function!",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || "development"
      });
    }

    // Demo endpoint
    if (url === "/api/demo" && method === "GET") {
      return res.json({ message: "Demo endpoint working on Vercel!" });
    }

    // Chat endpoint
    if (url === "/api/groq-chat" && method === "POST") {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
          success: false,
          error: "Invalid messages format"
        });
      }

      // Simple AI response for demo
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let response = "Привет! Я ваш AI-помощник. Как дела?";

      if (lastMessage.includes("привет")) {
        response = "👋 Привет! Как дела? Чем могу помочь?";
      } else if (lastMessage.includes("как дела")) {
        response = "🤖 Отлично! Готов к работе. Что вас интересует?";
      } else if (lastMessage.includes("помощь")) {
        response = "💡 Конечно помогу! Задавайте любые вопросы.";
      }

      return res.json({
        success: true,
        message: response
      });
    }

    // Contracts endpoint
    if (url === "/api/contracts" && method === "POST") {
      const { projectType, projectDescription, clientName, clientEmail, estimatedPrice } = req.body;

      const contractId = `JAR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      return res.json({
        success: true,
        message: "Договор успешно создан",
        contractId,
        contractUrl: `/api/contracts/${contractId}`
      });
    }

    if (url === "/api/contracts" && method === "GET") {
      const userId = req.headers["user-id"];
      return res.json({
        success: true,
        contracts: []
      });
    }

    // Contract by ID
    if (url.startsWith("/api/contracts/") && method === "GET") {
      const contractId = url.split("/api/contracts/")[1];
      const currentDate = new Date().toLocaleDateString("ru-RU");

      const contractHTML = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <title>Договор ${contractId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .contract-title { font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="contract-title">ДОГОВОР НА РАЗРАБОТКУ</div>
            <div>№ ${contractId}</div>
            <div>от ${currentDate}</div>
          </div>
          <p>Договор успешно создан в системе Vercel!</p>
        </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(contractHTML);
    }

    // Orders endpoint
    if (url === "/api/orders" && method === "POST") {
      console.log("📧 Получен заказ:", req.body);
      return res.json({
        success: true,
        message: "Заказ успешно отправлен!"
      });
    }

    // Bookings endpoints
    if (url === "/api/bookings" && method === "POST") {
      return res.json({
        success: true,
        message: "Бронирование создано",
        bookingId: `BOOK-${Date.now()}`
      });
    }

    if (url === "/api/bookings" && method === "GET") {
      return res.json({
        success: true,
        bookings: []
      });
    }

    // 404 for unknown routes
    return res.status(404).json({
      success: false,
      error: "Endpoint not found",
      path: url,
      method: method
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
