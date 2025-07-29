# Netlify Deployment Guide

## Подготовка к деплою

Проект уже настроен для Netlify с помощью:

- `netlify.toml` - конфигурац��я сборки и редиректов
- `netlify/functions/api.ts` - serverless функция для API
- Переменные окружения в `.env` (не коммитятся в Git)

## Шаги для деплоя:

### 1. Подключение к GitHub

1. Пушим код в GitHub репозиторий
2. Заходим на [netlify.com](https://netlify.com)
3. "New site from Git" → выбираем GitHub репозиторий

### 2. Настройка сборки

Netlify автоматически определит настройки из `netlify.toml`:

- **Build command**: `npm run build:client`
- **Publish directory**: `dist/spa`
- **Functions directory**: `netlify/functions`

### 3. Переменные окружения

В настройках сайта Netlify добавить:

```
GROQ_API_KEY = your_groq_api_key_here
JWT_SECRET = your_jwt_secret_here
NODE_ENV = production
```

### 4. Проверка работы

После деплоя проверить:

- Главная страница загружается
- API эндпоинты работают: `https://your-site.netlify.app/api/ping`
- Chat функционал работает (Groq API)

## Структура API на Netlify

Все `/api/*` запросы автоматически перенаправляются к serverless функции:

- `/api/ping` → проверка работы
- `/api/groq-chat` → чат с AI
- `/api/contracts` → работа с договорами
- `/api/bookings` → система бронирования
- `/api/orders` → обработка заказов

## Файлы важные для деплоя

- `netlify.toml` - основная конфигурация
- `netlify/functions/api.ts` - входная точка API
- `server/routes/*` - логика API роутов
- `data/` - данные (включены в сборку функций)

## Безопасность

- `.env` файл в `.gitignore` - секреты не попадают в Git
- API защищены CORS политиками
- JWT токены для аутентификации
- Заголовки безопасности настроены в `netlify.toml`
