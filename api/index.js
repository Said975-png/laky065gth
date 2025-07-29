export default async function handler(req, res) {
  // Настройка CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Маршрутизация
  const { url, method } = req;

  try {
    // Ping endpoint
    if (url === "/api/ping" && method === "GET") {
      return res.json({ message: "Hello from Vercel serverless function!" });
    }

    // Groq chat endpoint
    if (url === "/api/groq-chat" && method === "POST") {
      console.log("📧 Получен запрос к groq-chat");
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.log("❌ Некорректные сообщения:", messages);
        return res.status(400).json({
          success: false,
          error: "Необходимо предоставить сообщения для чата",
        });
      }

      const groqApiKey = process.env.GROQ_API_KEY;

      // Интеллектуальные fallback ответы
      const lastMessage =
        messages[messages.length - 1]?.content?.toLowerCase() || "";
      let intelligentResponse = "";

      // Расширенная логика ответов
      if (
        lastMessage.includes("привет") ||
        lastMessage.includes("здравствуй") ||
        lastMessage.includes("hello")
      ) {
        intelligentResponse =
          "👋 Привет! Я Пятница, ваш персональный AI-помощник от Stark Industries. Готова помочь вам с любыми вопросами!";
      } else if (
        lastMessage.includes("как дела") ||
        lastMessage.includes("что делаешь")
      ) {
        intelligentResponse =
          "🤖 Отлично! Анализирую данные и готова к работе. Чем могу быть полезна?";
      } else if (
        lastMessage.includes("что умеешь") ||
        lastMessage.includes("функции") ||
        lastMessage.includes("возможности")
      ) {
        intelligentResponse =
          "💡 Мои возможности:\n\n🔹 Консультации по веб-разработке\n🔹 Помощь с техническими вопросами\n🔹 Анализ и рекомендации\n🔹 Поддержка по продуктам\n🔹 Общение и ответы на вопросы\n\nЗадавайте любые вопросы!";
      } else if (
        lastMessage.includes("пока") ||
        lastMessage.includes("до свидания") ||
        lastMessage.includes("bye")
      ) {
        intelligentResponse =
          "👋 До свидания! Было приятно пообщаться. Обращайтесь снова, когда понадобится помощь!";
      } else if (
        lastMessage.includes("сайт") ||
        lastMessage.includes("веб") ||
        lastMessage.includes("разработка")
      ) {
        intelligentResponse =
          "🌐 Отличный вопрос о веб-разработке! Мы в Stark Industries создаем современные сайты с:\n\n✨ Адаптивным дизайном\n⚡ Высокой производительностью\n🎨 Уникальными решениями\n🔒 Надежной безопасностью\n\nРасскажите подробнее о вашем проекте!";
      } else if (
        lastMessage.includes("цена") ||
        lastMessage.includes("стоимость") ||
        lastMessage.includes("сколько")
      ) {
        intelligentResponse =
          "💰 Стоимость зависит от сложности проекта:\n\n📱 Лендинг: от 50,000₽\n🌐 Корпоративный сайт: от 150,000₽\n🛒 Интернет-магазин: от 300,000₽\n⚡ Индивидуальные решения: по запросу\n\nДля точной оценки нужно обсудить ваши требования!";
      } else if (
        lastMessage.includes("время") ||
        lastMessage.includes("сроки") ||
        lastMessage.includes("когда")
      ) {
        intelligentResponse =
          "⏰ Типичные сроки разработки:\n\n📱 Лендинг: 1-2 недели\n🌐 Корпоративный сайт: 3-6 недель\n🛒 Интернет-магазин: 6-12 недель\n\nТочные сроки зависят от сложности и требований проекта.";
      } else if (
        lastMessage.includes("технологи") ||
        lastMessage.includes("стек") ||
        lastMessage.includes("инструменты")
      ) {
        intelligentResponse =
          "🔧 Мы используем современный технологический стек:\n\n⚛️ React, TypeScript, Next.js\n🎨 TailwindCSS, Framer Motion\n⚡ Node.js, Express\n📊 PostgreSQL, MongoDB\n☁️ Vercel, AWS, Docker\n\nВыбираем оптимальные технологии под каждый проект!";
      } else if (
        lastMessage.includes("контакт") ||
        lastMessage.includes("связ") ||
        lastMessage.includes("телефон")
      ) {
        intelligentResponse =
          "📞 Свяжитесь с нами:\n\n📧 Email: contact@stark-ai.com\n📱 Telegram: @stark_support\n🌐 Форма на сайте: /order\n\nМы ответим в течение часа!";
      } else if (
        lastMessage.includes("jarvis") ||
        lastMessage.includes("джарвис")
      ) {
        intelligentResponse =
          "🤖 Да, я Jarvis - ваш AI-помощник! Названа в честь легендарного ИИ Тони Старка. Готова помочь с любыми техническими вопросами и задачами!";
      } else {
        // Общий интеллектуальный ответ
        intelligentResponse = `🤔 Интересный вопрос! ${groqApiKey ? "Анализирую с помощью передовых AI-алгоритмов..." : "Пока работаю в базовом режиме, но"} стараюсь дать максимально полезный ответ.\n\nМожете спросить меня о:\n• Веб-разработке и дизайне\n• Ценах и сроках\n• Технологиях и решениях\n• Любых других вопросах!\n\nЧто именно вас интересует?`;
      }

      if (groqApiKey) {
        try {
          // Попытка обращения к GROQ API
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                  {
                    role: "system",
                    content:
                      "Ты Пятница - AI-помощник от Stark Industries. Ты дружелюбная, профессиональная и экспертная в веб-разработке. Отвечай на русском языке, будь краткой но информативной.",
                  },
                  ...messages.slice(-5), // Последние 5 сообщений для контекста
                ],
                max_tokens: 1000,
                temperature: 0.7,
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            const aiMessage = data.choices?.[0]?.message?.content;

            if (aiMessage) {
              console.log("🤖 Получен ответ от GROQ API");
              return res.json({
                success: true,
                message: aiMessage,
              });
            }
          }

          console.log("⚠️ GROQ API недоступен, используем fallback");
        } catch (error) {
          console.log("❌ Ошибка GROQ API:", error.message);
        }
      } else {
        console.log("💭 Используем интеллектуальные fallback ответы");
      }

      // Возвращаем интеллектуальный fallback ответ
      return res.json({
        success: true,
        message: intelligentResponse,
      });
    }

    // 404 для несуществующих маршрутов
    return res.status(404).json({
      success: false,
      error: "Endpoint не найден",
    });
  } catch (error) {
    console.error("❌ Ошибка в API:", error);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
}
