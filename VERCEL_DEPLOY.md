# 🚀 Руководство по развертыванию на Vercel

## 📋 Что нужно для деплоя

✅ **Все готово!** Проект полностью настроен для Vercel:

- `vercel.json` - конфигурация Vercel
- `api/index.ts` - Serverless функции API
- `.vercelignore` - игнорируемые файлы
- `@vercel/node` - runtime установлен

## 🚀 Команда для деплоя

```bash
npx vercel --prod
```

## 🔧 Что происходит при деплое

1. **Frontend**: React SPA собирается в `dist/spa/`
2. **API**: Все `/api/*` запросы идут к `api/index.ts`
3. **Routing**: SPA роутинг работает через fallback к `index.html`

## 🌍 Переменные окружения

После первого деплоя добавьте в Vercel Dashboard:

```bash
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET=your-secret-key-for-jwt-tokens
NODE_ENV=production

# Опционально для email:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📊 API Endpoints

После деплоя будут доступны:

- `GET /api/ping` - Проверка работы
- `POST /api/groq-chat` - Чат с ИИ
- `POST /api/orders` - Заказы
- `POST /api/upload` - Загрузка файлов
- `POST /api/contracts` - Контракты
- `POST /api/bookings` - Бронирования

## 🎯 SPA Routes

- `/` - Главная
- `/chat` - Чат с Пятницей  
- `/admin` - Администрирование
- `/login` - Вход
- `/profile` - Профиль

## ✅ Проверка после деплоя

1. Откройте `https://your-project.vercel.app`
2. Проверьте `/api/ping`
3. Тестируйте чат на `/chat`
4. Проверьте SPA роутинг

---

**Готово!** Команда `npx vercel --prod` развернет полнофункциональное приложение.
