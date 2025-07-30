// Import all route handlers directly for serverless compatibility
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, user-id",
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
        env: process.env.NODE_ENV || "development",
      });
    }

    // Environment debug endpoint
    if (url === "/api/debug" && method === "GET") {
      return res.json({
        env: process.env.NODE_ENV || "development",
        hasGroqKey: !!process.env.GROQ_API_KEY,
        groqKeyLength: process.env.GROQ_API_KEY
          ? process.env.GROQ_API_KEY.length
          : 0,
        groqKeyStart: process.env.GROQ_API_KEY
          ? process.env.GROQ_API_KEY.substring(0, 8) + "..."
          : "none",
        allEnvKeys: Object.keys(process.env)
          .filter((key) => !key.includes("PATH"))
          .sort(),
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
          error: "Invalid messages format",
        });
      }

      const groqApiKey = process.env.GROQ_API_KEY;

      // Debug logging for production
      console.log("Environment check:", {
        hasGroqKey: !!groqApiKey,
        keyLength: groqApiKey ? groqApiKey.length : 0,
        keyStart: groqApiKey ? groqApiKey.substring(0, 8) + "..." : "none",
        nodeEnv: process.env.NODE_ENV,
      });

      // If GROQ API key is available, try to use the actual API
      if (
        groqApiKey &&
        groqApiKey !== "your_groq_api_key_here" &&
        groqApiKey.trim() !== ""
      ) {
        try {
          // Clean messages to only include role and content
          const cleanedMessages = messages.slice(-5).map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

          console.log("🚀 Attempting GROQ API call...");
          console.log(
            "📝 Cleaned messages:",
            JSON.stringify(cleanedMessages, null, 2),
          );

          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                  {
                    role: "system",
                    content:
                      "Ты Пятница - русскоязычный AI-помощник от Stark Industries. ВАЖНО: ВСЕ твои ответы должны быть ТОЛ��КО на русском языке, без исключений. Ты дружелюбная, профессиональная и экспертная в веб-разработке. Проверяй грамматику и орфографию перед ответом. Будь краткой, но информативной. Используй правильные падежи и согласования в русском языке.",
                  },
                  ...cleanedMessages,
                ],
                max_tokens: 1000,
                temperature: 0.7,
              }),
            },
          );

          console.log("📡 GROQ API response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("✅ GROQ API success, parsing response...");
            const aiMessage = data.choices?.[0]?.message?.content;

            if (aiMessage) {
              console.log("🎉 Returning GROQ AI message");
              return res.json({
                success: true,
                message: aiMessage,
              });
            } else {
              console.log(
                "❌ No AI message in response:",
                JSON.stringify(data),
              );
              return res.json({
                success: true,
                message: `DEBUG: GROQ ответил, но нет сообщения в choices[0]. Response: ${JSON.stringify(data)}`,
              });
            }
          } else {
            const errorText = await response.text();
            console.log(
              "❌ GROQ API response not ok:",
              response.status,
              response.statusText,
            );
            console.log("❌ GROQ API error details:", errorText);

            return res.json({
              success: true,
              message: `DEBUG: GROQ API Error ${response.status}: ${errorText}`,
            });
          }
        } catch (error) {
          console.log("💥 GROQ API Exception:", error.message, error.stack);

          return res.json({
            success: true,
            message: `DEBUG: Exception при запросе к GROQ: ${error.message}`,
          });
        }
      }

      // Fallback responses if API is not available
      const lastMessage =
        messages[messages.length - 1]?.content?.toLowerCase() || "";
      let response = "Привет! Я ваш AI-помощник. Как дела?";

      if (lastMessage.includes("привет")) {
        response = "👋 Привет! Как де��а? Чем могу помочь?";
      } else if (lastMessage.includes("как дела")) {
        response = "🤖 Отлично! Готов к работе. Что вас интересует?";
      } else if (lastMessage.includes("помощь")) {
        response = "💡 Конечно помогу! Задавайте любые вопросы.";
      } else if (
        lastMessage.includes("сайт") ||
        lastMessage.includes("разработка")
      ) {
        response =
          "🌐 Отлично! Я помогу с веб-разработкой. Расскажите подробнее о вашем прое��те.";
      }

      return res.json({
        success: true,
        message:
          response +
          ` (Demo режим - Key status: ${groqApiKey ? "присутствует" : "отсутствует"})`,
      });
    }

    // Contracts endpoint
    if (url === "/api/contracts" && method === "POST") {
      const {
        projectType,
        projectDescription,
        clientName,
        clientEmail,
        estimatedPrice,
      } = req.body;

      const contractId = `JAR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      return res.json({
        success: true,
        message: "Договор успешно создан",
        contractId,
        contractUrl: `/api/contracts/${contractId}`,
      });
    }

    if (url === "/api/contracts" && method === "GET") {
      const userId = req.headers["user-id"];
      return res.json({
        success: true,
        contracts: [],
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

    // Orders endpoints
    if (url === "/api/orders" && method === "POST") {
      const { items, formData, total } = req.body;

      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const order = {
        id: orderId,
        items: items || [],
        formData: {
          fullName: formData?.fullName || "",
          phone: formData?.phone || "",
          description: formData?.description || "",
          referenceUrl: formData?.referenceUrl || ""
        },
        total: total || 0,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      // Сохраняем заказ в файл
      try {
        const fs = require('fs');
        const path = require('path');

        const dataDir = path.join(process.cwd(), "data");
        const ordersFile = path.join(dataDir, "orders.json");

        // Создаем директорию если её нет
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        // Загружаем существующие заказы
        let orders = [];
        if (fs.existsSync(ordersFile)) {
          const data = fs.readFileSync(ordersFile, "utf-8");
          orders = JSON.parse(data);
        }

        // Добавляем новый заказ
        orders.push(order);
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

        console.log("🛒 Новый заказ сохранен в файл:", orderId);
      } catch (error) {
        console.error("Ошибка сохранения заказа:", error);
      }

      return res.json({
        success: true,
        message: "Заказ успешно отправлен!",
        orderId: orderId
      });
    }

    // Get all orders (for admin)
    if (url === "/api/orders/all" && method === "GET") {
      try {
        const fs = require('fs');
        const path = require('path');
        const ordersFile = path.join(process.cwd(), "data", "orders.json");

        let orders = [];
        if (fs.existsSync(ordersFile)) {
          const data = fs.readFileSync(ordersFile, "utf-8");
          orders = JSON.parse(data);
        }

        // Сортируем по дате создания (новые сначала)
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log(`📋 Загружено ${orders.length} заказов для админа`);

        return res.json({
          success: true,
          orders: orders,
        });
      } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
        return res.json({
          success: false,
          error: "Ошибка загрузки заказов",
          orders: [],
        });
      }
    }

    // Bookings endpoints
    if (url === "/api/bookings" && method === "POST") {
      const {
        serviceType,
        serviceDescription,
        clientName,
        clientEmail,
        clientPhone,
        preferredDate,
        preferredTime,
        notes
      } = req.body;

      const bookingId = `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const userId = req.headers["user-id"] || "anonymous";

      // Сохраняем бронь в файл
      const booking = {
        id: bookingId,
        userId,
        serviceType,
        serviceDescription,
        clientName,
        clientEmail,
        clientPhone,
        preferredDate,
        preferredTime,
        notes: notes || "",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Сохраняем в файловую систему
      try {
        const fs = require('fs');
        const path = require('path');

        const dataDir = path.join(process.cwd(), "data", "bookings");
        const bookingsFile = path.join(dataDir, "bookings.json");

        // Соз��аем директорию если её нет
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        // Загружаем существующие брони
        let bookings = [];
        if (fs.existsSync(bookingsFile)) {
          const data = fs.readFileSync(bookingsFile, "utf-8");
          bookings = JSON.parse(data);
        }

        // Добавляем новую бронь
        bookings.push(booking);
        fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

        console.log("📅 Новая бронь сохранена в файл:", bookingId);
      } catch (error) {
        console.error("Ошибка сохранения брони:", error);
      }

      return res.json({
        success: true,
        message: "Бронирование успешно создано",
        bookingId,
        booking
      });
    }

    if (url === "/api/bookings" && method === "GET") {
      const userId = req.headers["user-id"];

      try {
        const fs = require('fs');
        const path = require('path');
        const bookingsFile = path.join(process.cwd(), "data", "bookings", "bookings.json");

        let bookings = [];
        if (fs.existsSync(bookingsFile)) {
          const data = fs.readFileSync(bookingsFile, "utf-8");
          bookings = JSON.parse(data);
        }

        // Фильтруем по пользователю
        const userBookings = bookings.filter(booking => booking.userId === userId);

        return res.json({
          success: true,
          bookings: userBookings,
        });
      } catch (error) {
        console.error("Ошибка загрузки броней пользователя:", error);
        return res.json({
          success: true,
          bookings: [],
        });
      }
    }

    if (url === "/api/bookings/all" && method === "GET") {
      try {
        const fs = require('fs');
        const path = require('path');
        const bookingsFile = path.join(process.cwd(), "data", "bookings", "bookings.json");

        let bookings = [];
        if (fs.existsSync(bookingsFile)) {
          const data = fs.readFileSync(bookingsFile, "utf-8");
          bookings = JSON.parse(data);
        }

        // Сортируем по дате создания (новые сначала)
        bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log(`📋 Загружено ${bookings.length} броней для админа`);

        return res.json({
          success: true,
          bookings: bookings,
        });
      } catch (error) {
        console.error("Ошибка загрузки всех броней:", error);
        return res.json({
          success: false,
          error: "Ошибка загрузки броней",
          bookings: [],
        });
      }
    }

    // Update booking status
    if (url.startsWith("/api/bookings/") && method === "PUT") {
      const bookingId = url.split("/api/bookings/")[1];
      const { status } = req.body;

      try {
        const fs = require('fs');
        const path = require('path');
        const bookingsFile = path.join(process.cwd(), "data", "bookings", "bookings.json");

        let bookings = [];
        if (fs.existsSync(bookingsFile)) {
          const data = fs.readFileSync(bookingsFile, "utf-8");
          bookings = JSON.parse(data);
        }

        // Находим и обновляем бронь
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex !== -1) {
          bookings[bookingIndex].status = status;
          bookings[bookingIndex].updatedAt = new Date().toISOString();

          fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

          console.log(`📝 Статус брони ${bookingId} обновлен на ${status}`);

          return res.json({
            success: true,
            message: "Статус брони обновлен"
          });
        } else {
          return res.json({
            success: false,
            error: "Бронь не найдена"
          });
        }
      } catch (error) {
        console.error("Ошибка обновления статуса брони:", error);
        return res.json({
          success: false,
          error: "Ошибка обновления статуса"
        });
      }
    }

    // 404 for unknown routes
    return res.status(404).json({
      success: false,
      error: "Endpoint not found",
      path: url,
      method: method,
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
