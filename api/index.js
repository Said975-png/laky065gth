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

    // Environment debug endpoint
    if (url === "/api/debug" && method === "GET") {
      return res.json({
        env: process.env.NODE_ENV || "development",
        hasGroqKey: !!process.env.GROQ_API_KEY,
        groqKeyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
        groqKeyStart: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 8) + "..." : "none",
        allEnvKeys: Object.keys(process.env).filter(key => !key.includes('PATH')).sort()
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

      const groqApiKey = process.env.GROQ_API_KEY;

      // Debug logging for production
      console.log("Environment check:", {
        hasGroqKey: !!groqApiKey,
        keyLength: groqApiKey ? groqApiKey.length : 0,
        keyStart: groqApiKey ? groqApiKey.substring(0, 8) + "..." : "none",
        nodeEnv: process.env.NODE_ENV
      });

      // If GROQ API key is available, try to use the actual API
      if (groqApiKey && groqApiKey !== 'your_groq_api_key_here' && groqApiKey.trim() !== '') {
        try {
          // Clean messages to only include role and content
          const cleanedMessages = messages.slice(-5).map(msg => ({
            role: msg.role,
            content: msg.content
          }));

          console.log("🚀 Attempting GROQ API call...");
          console.log("📝 Cleaned messages:", JSON.stringify(cleanedMessages, null, 2));

          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama3-8b-8192",
              messages: [
                {
                  role: "system",
                  content: "Ты Пятница - AI-помощник от Stark Industries. Ты дружелюбная, профессиональная и экспертная в веб-разработке. Отвечай на русском языке, будь краткой но информативной."
                },
                ...cleanedMessages
              ],
              max_tokens: 1000,
              temperature: 0.7,
            }),
          });

          console.log("📡 GROQ API response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("✅ GROQ API success, parsing response...");
            const aiMessage = data.choices?.[0]?.message?.content;

            if (aiMessage) {
              console.log("🎉 Returning GROQ AI message");
              return res.json({
                success: true,
                message: aiMessage
              });
            } else {
              console.log("❌ No AI message in response:", JSON.stringify(data));
              return res.json({
                success: true,
                message: `DEBUG: GROQ ответил, но нет сообщения в choices[0]. Response: ${JSON.stringify(data)}`
              });
            }
          } else {
            const errorText = await response.text();
            console.log("❌ GROQ API response not ok:", response.status, response.statusText);
            console.log("❌ GROQ API error details:", errorText);

            return res.json({
              success: true,
              message: `DEBUG: GROQ API Error ${response.status}: ${errorText}`
            });
          }
        } catch (error) {
          console.log("💥 GROQ API Exception:", error.message, error.stack);

          return res.json({
            success: true,
            message: `DEBUG: Exception при запросе к GROQ: ${error.message}`
          });
        }
      }

      // Fallback responses if API is not available
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let response = "Привет! Я ваш AI-помощник. Как дела?";

      if (lastMessage.includes("привет")) {
        response = "👋 Привет! Как де��а? Чем могу помочь?";
      } else if (lastMessage.includes("как дела")) {
        response = "🤖 Отлично! Готов к работе. Что вас интересует?";
      } else if (lastMessage.includes("помощь")) {
        response = "💡 Конечно помогу! Задавайте любые вопросы.";
      } else if (lastMessage.includes("сайт") || lastMessage.includes("разработка")) {
        response = "🌐 Отлично! Я помогу с веб-разработкой. Расскажите подробнее о вашем прое��те.";
      }

      return res.json({
        success: true,
        message: response + ` (Demo режим - Key status: ${groqApiKey ? 'присутствует' : 'отсутствует'})`
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
