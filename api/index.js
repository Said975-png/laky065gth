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

    // Contracts endpoints
    if (url === "/api/contracts" && method === "POST") {
      console.log("📝 [CONTRACT] Создание контракта - запрос получен");
      console.log("📝 [CONTRACT] Body:", req.body);

      const {
        projectType,
        projectDescription,
        clientName,
        clientEmail,
        estimatedPrice,
      } = req.body;

      // Generate contract ID
      const contractId = `JAR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Get current user from request
      const userId = req.headers["user-id"] || "anonymous";

      // Create contract data
      const contractData = {
        id: contractId,
        userId,
        clientName,
        clientEmail,
        projectType,
        projectDescription,
        price: estimatedPrice,
        createdAt: new Date().toISOString(),
        status: "draft",
        fileName: `contract-${contractId}.html`,
      };

      console.log("✅ [CONTRACT] Контракт создан:", contractId);

      return res.json({
        success: true,
        message: "Договор успешно создан",
        contractId,
        contractUrl: `/api/contracts/${contractId}`,
      });
    }

    if (url === "/api/contracts" && method === "GET") {
      console.log("📋 [CONTRACT] Получение контрактов пользователя");
      const userId = req.headers["user-id"];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Пользователь не авторизован",
        });
      }

      // Возвращаем пустой массив для демо (в реальности здесь была бы база данных)
      return res.json({
        success: true,
        contracts: [],
      });
    }

    // Contract by ID endpoint
    if (url.startsWith("/api/contracts/") && method === "GET") {
      const contractId = url.split("/api/contracts/")[1];
      console.log("📄 [CONTRACT] Получение контракта:", contractId);

      // Generate contract HTML
      const currentDate = new Date().toLocaleDateString("ru-RU");

      const contractHTML = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Договор ${contractId}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .contract-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .contract-number {
              font-size: 16px;
              color: #666;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #2563eb;
            }
            .contract-details {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            .detail-row {
              display: flex;
              margin-bottom: 10px;
            }
            .detail-label {
              font-weight: bold;
              width: 200px;
              flex-shrink: 0;
            }
            .detail-value {
              flex: 1;
            }
            .footer {
              margin-top: 40px;
              border-top: 2px solid #333;
              padding-top: 20px;
              text-align: center;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
            }
            .signature-block {
              text-align: center;
              width: 300px;
            }
            .signature-line {
              border-bottom: 1px solid #333;
              height: 50px;
              margin-bottom: 10px;
            }
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="contract-title">ДОГОВОР НА РАЗРАБОТКУ</div>
            <div class="contract-number">№ ${contractId}</div>
            <div>от ${currentDate}</div>
          </div>

          <div class="section">
            <div class="section-title">1. СТОРОНЫ ДОГОВОРА</div>
            <p><strong>Исполнитель:</strong> JARVIS INTERCOMA</p>
            <p><strong>Заказчик:</strong> [Имя клиента]</p>
            <p><strong>Email:</strong> [Email клиента]</p>
          </div>

          <div class="section">
            <div class="section-title">2. ПРЕДМЕТ ДОГОВОРА</div>
            <div class="contract-details">
              <div class="detail-row">
                <div class="detail-label">Тип проекта:</div>
                <div class="detail-value">[Тип проекта]</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Описание:</div>
                <div class="detail-value">[Описание проекта]</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Стоимость:</div>
                <div class="detail-value">[Стоимость] рублей</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">3. УСЛОВИЯ ВЫПОЛНЕНИЯ</div>
            <p>3.1. Исполнитель обязуется выполнить работы согласно техническому заданию.</p>
            <p>3.2. Срок выполнения работ: 15-20 рабочих дней с момента подписания договора.</p>
            <p>3.3. Заказчик обязуется предоставить вс�� необходимую информацию для выполнения работ.</p>
          </div>

          <div class="section">
            <div class="section-title">4. ПОРЯДОК ОПЛАТЫ</div>
            <p>4.1. Общая стоимость работ составляет [Стоимость] рублей.</p>
            <p>4.2. Оплата производится в следующем порядке:</p>
            <ul>
              <li>50% предоплата при подписании договора</li>
              <li>50% после завершения работ и передачи результата</li>
            </ul>
          </div>

          <div class="section">
            <div class="section-title">5. ОТВЕТСТВЕННОСТЬ СТОРОН</div>
            <p>5.1. За невыполнение или ненадлежащее выполнение обязательств стороны несут ответственность в соответствии с действующим законодательством.</p>
            <p>5.2. Исполнитель гарантирует качество выполненных работ в течение 6 месяцев.</p>
          </div>

          <div class="signature-section">
            <div class="signature-block">
              <div><strong>ИСПОЛНИТЕЛЬ</strong></div>
              <div class="signature-line"></div>
              <div>JARVIS INTERCOMA</div>
              <div>Создатель: Хусаинов Саид</div>
            </div>
            <div class="signature-block">
              <div><strong>ЗАКАЗЧИК</strong></div>
              <div class="signature-line"></div>
              <div>[Имя клиента]</div>
            </div>
          </div>

          <div class="footer">
            <p><em>Договор сгенерирован автоматически системой Jarvis AI</em></p>
            <p><em>Дата создания: ${currentDate}</em></p>
          </div>
        </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(contractHTML);
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
          "🌐 Отличный вопрос о веб-разработке! Мы в Stark Industries создаем современные сайты с:\n\n✨ Адаптивным дизайном\n⚡ Высокой производительностью\n🎨 Ун��кальными решениями\n🔒 Надежной безопасностью\n\nРасскажите подробнее о вашем проекте!";
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
        if (
          lastMessage.includes("кто") ||
          lastMessage.includes("что такое") ||
          lastMessage.includes("как работает")
        ) {
          intelligentResponse =
            "🤖 Отличный вопрос! Я стараюсь анализировать контекст и предоставлять максимально полезную информацию. Могу помочь с техническими вопросами, консультациями по разработке, или просто поболтать. Что именно вас интересует?";
        } else if (
          lastMessage.includes("помощь") ||
          lastMessage.includes("помоги") ||
          lastMessage.includes("help")
        ) {
          intelligentResponse =
            "💡 Конечно, помогу! Я могу:\n\n🔹 Консультировать по веб-разработке\n🔹 Обсуждать технические решения\n🔹 Рассказать о наших услугах\n🔹 Отве��ить на общие вопросы\n🔹 Просто поболтать\n\nОпишите подробнее, с чем нужна помощь!";
        } else if (
          lastMessage.includes("почему") ||
          lastMessage.includes("зачем") ||
          lastMessage.includes("why")
        ) {
          intelligentResponse =
            "🧠 Хороший вопрос! Анализируя ваш запрос, постараюсь дать развернутый ответ. Если это касается наших технологий или услуг - с радостью расскажу подробности. Уточните, пожалуйста, что именно вас интересует?";
        } else if (
          lastMessage.includes("когда") ||
          lastMessage.includes("where") ||
          lastMessage.includes("где")
        ) {
          intelligentResponse =
            "📍 Уточните, пожалуйста, о чем именно вы спрашиваете? Если это о наших услугах, сроках или местоположении - с удовольствием отвечу детально!";
        } else if (
          lastMessage.includes("можно") ||
          lastMessage.includes("могу") ||
          lastMessage.includes("можете")
        ) {
          intelligentResponse =
            "✅ Да, конечно! В большинстве случаев мы можем найти решение. Расскажите подробнее о ваших потребностях, и я предложу оптимальный вариант!";
        } else if (
          lastMessage.includes("спасибо") ||
          lastMessage.includes("благодарю") ||
          lastMessage.includes("thanks")
        ) {
          intelligentResponse =
            "😊 Пожалуйста! Всегда рада помочь. Если возникнут еще вопросы - обращайтесь в любое время!";
        } else if (
          lastMessage.includes("проблема") ||
          lastMessage.includes("ошибка") ||
          lastMessage.includes("не работает")
        ) {
          intelligentResponse =
            "🔧 Понимаю, что проблемы могут расстраивать. Давайте разберемся! Опишите подробнее что происходит, и я постараюсь помочь найти ре��ение или направить к нужному специалисту.";
        } else if (
          lastMessage.includes("интересн") ||
          lastMessage.includes("круто") ||
          lastMessage.includes("amazing")
        ) {
          intelligentResponse =
            "🌟 Спасибо! Мне тоже нравится то, что мы делаем. Технологии развиваются невероятно быстро, и мы стараемся быть в авангарде инноваций. Что именно показалось интересным?";
        } else if (
          lastMessage.includes("работа") ||
          lastMessage.includes("job") ||
          lastMessage.includes("карьера")
        ) {
          intelligentResponse =
            "💼 Вопросы карьеры всегда актуальны! Если интересует работа в сфере IT или у нас в команде - расскажите о ваших навыках и интересах. Всегда ищем талантливых людей!";
        } else if (
          lastMessage.includes("обучение") ||
          lastMessage.includes("изучать") ||
          lastMessage.includes("learn")
        ) {
          intelligentResponse =
            "📚 Отличное стремление к знаниям! В IT-сфере обучение никогда не заканчивается. Могу порекомендовать ресурсы или рассказать о трендах в веб-разработке. Что хотите изучать?";
        } else {
          // Действительно универсальный ответ для любых других вопросов
          const responses = [
            "🤔 Интересный вопрос! Хотя я специализируюсь на технических консультациях, постараюсь помочь. Расскажите подробнее о том, что вас интересует?",
            "💭 Понимаю вашу мысль! Даже если это не совсем моя специализация, попробую дать полезный совет или направить в нужное русло.",
            "🎯 Хороший вопрос! Я в первую очередь AI-помощник по веб-разработке, но открыта к любым обсуждениям. Что именно хотите узнать?",
            "🌟 Благодарю за вопрос! Хотя мои основные знания в области технологий, всегда рада пообщаться на разные темы. Уточните, пожалуйста, детали!",
            "🚀 Интересная тема! Даже если это выходит за рамки моей основной специализации, попробую быть полезной. Расскажите больше!",
          ];
          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];
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
    console.log(`❌ [API] Неизвестный маршрут: ${method} ${url}`);
    return res.status(404).json({
      success: false,
      error: "Endpoint не найден",
      path: url,
      method: method,
    });
  } catch (error) {
    console.error("❌ Ошибка в API:", error);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
}
