const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Простой ping endpoint
app.get("/api/ping", (req, res) => {
  res.json({ message: "Hello from Express server v2!" });
});

// Groq chat endpoint
app.post("/api/groq-chat", async (req, res) => {
  try {
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
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let fallbackMessage = "";

      if (lastMessage.includes("привет") || lastMessage.includes("здравствуй")) {
        fallbackMessage = "👋 Привет! Я Пятница, ваш AI-помощник. Чем могу помочь?";
      } else if (lastMessage.includes("как дела") || lastMessage.includes("что делаешь")) {
        fallbackMessage = "🤖 Отлично! Готова помочь вам с любыми вопросами. О чем хотите поговорить?";
      } else if (lastMessage.includes("что умеешь") || lastMessage.includes("функции")) {
        fallbackMessage = "💡 Я могу помочь с:\n• Ответами на вопросы\n• Общением\n• Консультациями\n• И многим другим!";
      } else if (lastMessage.includes("п��ка") || lastMessage.includes("до свидания")) {
        fallbackMessage = "👋 До свидания! Было приятно пообщаться. Обращайтесь снова!";
      } else {
        fallbackMessage = "🤔 Интересный вопрос! К сожалению, сейчас у меня нет подключения к внешним AI сервисам, но я работаю над этим. Попробуйте позже!";
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

  } catch (error) {
    console.error("❌ Ошибка в groq-chat:", error);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
});

module.exports = app;
