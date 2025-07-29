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
          "💰 Стоимость зависит от сложности проекта:\n\n📱 Лендинг: от 50,000₽\n🌐 Корпоративный сайт: от 150,000₽\n🛒 Интернет-магазин: от 300,000₽\n⚡ Индивидуальные реше��ия: по запросу\n\nДля точной оценки нужно обсудить ваши требования!";
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
        // Более интеллектуальная обработка других вопросов
        if (lastMessage.includes("кто") || lastMessage.includes("что такое") || lastMessage.includes("как работает")) {
          intelligentResponse = "🤖 Отличный вопрос! Я стараюсь анализировать контекст и предоставлять максимально полезную информацию. Могу помочь с техническими вопросами, консультациями по разработке, или просто поболтать. Что именно вас интересует?";
        } else if (lastMessage.includes("помощь") || lastMessage.includes("помоги") || lastMessage.includes("help")) {
          intelligentResponse = "💡 Конечно, помогу! Я могу:\n\n🔹 Консультировать по веб-разработке\n🔹 Обсуждать технические решения\n🔹 Рассказать о наших услугах\n🔹 Ответить на общие вопросы\n🔹 Просто поболтать\n\nОпишите подробнее, с чем нужна помощь!";
        } else if (lastMessage.includes("почему") || lastMessage.includes("зачем") || lastMessage.includes("why")) {
          intelligentResponse = "🧠 Хороший вопрос! Анализируя ваш запрос, постараюсь дать развернутый ответ. Если это касается наших технологий или услуг - с радостью расскажу подробности. Уточните, пожалуйста, что именно вас интересует?";
        } else if (lastMessage.includes("когда") || lastMessage.includes("where") || lastMessage.includes("где")) {
          intelligentResponse = "📍 Уточните, пожалуйста, о чем именно вы спрашиваете? Если это о наших услугах, сроках или местоположении - с удовольствием отвечу детально!";
        } else if (lastMessage.includes("можно") || lastMessage.includes("могу") || lastMessage.includes("можете")) {
          intelligentResponse = "✅ Да, конечно! В большинстве случаев мы можем найти решение. Расскажите подробнее о ваших потребностях, и я предложу оптимальный вариант!";
        } else if (lastMessage.includes("спасибо") || lastMessage.includes("благодарю") || lastMessage.includes("thanks")) {
          intelligentResponse = "😊 Пожалуйста! Всегда рада помочь. Если возникнут еще вопросы - обращайтесь в любое время!";
        } else if (lastMessage.includes("проблема") || lastMessage.includes("ошибка") || lastMessage.includes("не работает")) {
          intelligentResponse = "🔧 Понимаю, что проблемы могут расстраивать. Давайте разберемся! Опишите подробнее что происходит, и я постараюсь помочь найти ре��ение или направить к нужному специалисту.";
        } else if (lastMessage.includes("интересн") || lastMessage.includes("круто") || lastMessage.includes("amazing")) {
          intelligentResponse = "🌟 Спасибо! Мне тоже нравится то, что мы делаем. Технологии развиваются невероятно быстро, и мы стараемся быть в авангарде инноваций. Что именно показалось интересным?";
        } else if (lastMessage.includes("работа") || lastMessage.includes("job") || lastMessage.includes("карьера")) {
          intelligentResponse = "💼 Вопросы карьеры всегда актуальны! Если интересует работа в сфере IT или у нас в команде - расскажите о ваших навыках и интересах. Всегда ищем талантливых людей!";
        } else if (lastMessage.includes("обучение") || lastMessage.includes("изучать") || lastMessage.includes("learn")) {
          intelligentResponse = "📚 Отличное стремление к знаниям! В IT-сфере обучение никогда не заканчивается. Могу порекомендовать ресурсы или рассказать о трендах в веб-разработке. Что хотите изучать?";
        } else {
          // Действительно универсальный ответ для любых других вопросов
          const responses = [
            "🤔 Интересный вопрос! Хотя я специализируюсь на технических консультациях, постараюсь помочь. Расскажите подробнее о том, что вас интересует?",
            "💭 Понимаю вашу мысль! Даже если это не совсем моя специализация, попробую дать полезный совет или направить в нужное русло.",
            "🎯 Хороший вопрос! Я в первую очередь AI-помощник по веб-разработке, но открыта к любым обсуждениям. Что именно хотите узнать?",
            "🌟 Благодарю за вопрос! Хотя мои основные знания в области технологий, всегда рада пообщаться на разные темы. Уточните, пожалуйста, детали!",
            "🚀 Интересная тема! Даже если это выходит за рамки моей основной специализации, попробую быть полезной. Расскажите больше!"
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          intelligentResponse = randomResponse;
        }
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
                      "Ты Пятница - AI-помощник от Stark Industries. Ты дружелюбная, профессиональная и экспертная в веб-разработке. Отвечай на русском язы��е, будь краткой но информативной.",
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
