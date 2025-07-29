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
      if (!groqApiKey) {
        console.log("❌ GROQ_API_KEY не найден, используем fallback");

        // Fallback ответ
        const lastMessage =
          messages[messages.length - 1]?.content?.toLowerCase() || "";
        let fallbackMessage = "";

        if (
          lastMessage.includes("привет") ||
          lastMessage.includes("здравствуй")
        ) {
          fallbackMessage =
            "👋 Привет! Я Пятница, ваш AI-помощник. Чем могу помочь?";
        } else if (
          lastMessage.includes("как дела") ||
          lastMessage.includes("что делаешь")
        ) {
          fallbackMessage =
            "🤖 Отлично! Готова помочь вам с любыми вопросами. О чем хотите поговорить?";
        } else if (
          lastMessage.includes("что умеешь") ||
          lastMessage.includes("функции")
        ) {
          fallbackMessage =
            "💡 Я могу помочь с:\n• Ответами на вопросы\n• Общением\n• Консультациями\n• И многим другим!";
        } else if (
          lastMessage.includes("пока") ||
          lastMessage.includes("до свидания")
        ) {
          fallbackMessage =
            "👋 До свидания! Было приятно пообщаться. Обращайтесь снова!";
        } else {
          fallbackMessage =
            "🤔 Интересный вопрос! К сожалению, сейчас у меня нет подключения к внешним AI сервисам, но я работаю над этим. Попробуйте позже!";
        }

        console.log("💬 Отправляем fallback ответ:", fallbackMessage);
        return res.json({
          success: true,
          message: fallbackMessage,
        });
      }

      // Здесь был бы код для работы с GROQ API
      return res.json({
        success: true,
        message: "API ключ найден, но функция пока в разработке",
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
