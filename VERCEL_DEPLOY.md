# Vercel Deployment Guide

## 🚀 Подготовка к деплою на Vercel

Проект полностью настроен для деплоя на Vercel с помощью:

- `vercel.json` - конфигурация сборки и маршрутизации
- `api/index.js` - serverless функция для всех API эндпоинтов
- `.vercelignore` - исключение ненужных файлов

## 📋 Шаги для деплоя:

### Вариант 1: Через Vercel CLI (рекомендуется)

1. Установите Vercel CLI:

```bash
npm i -g vercel
```

2. Протестируйте API локально:

```bash
npm run test:api
```

3. Скопируйте ваши API ключи в `.env`:

```bash
# Отредактируйте .env фай�� и добавьте реальные значения:
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
JWT_SECRET=your_random_jwt_secret_here
```

4. Деплой на продакшн:

```bash
npx vercel --prod
```

5. Vercel автоматически спросит про переменные окружения - выберите копировать из .env

### ⚠️ Важно: После добавления переменных в Vercel Dashboard

Если вы добавляли переменные через Vercel Dashboard после первого деплоя, **обязательно перезадеплойте**:

```bash
npx vercel --prod --force
```

Или создайте новый деплой через Git push.

### Вариант 2: Через GitHub

1. Пушим код в GitHub репозиторий
2. Заходим на [vercel.com](https://vercel.com)
3. "New Project" → выбираем GitHub репозиторий

### 2. Настройка сборки

Vercel автоматически определит настройки из `vercel.json`:

- **Build Command**: `npm run build:client`
- **Output Directory**: `dist/spa`
- **Functions**: `api/*.js`

### 3. Переменные окружения

В настройках проекта Vercel добавить:

```
GROQ_API_KEY = your_groq_api_key_here
JWT_SECRET = your_jwt_secret_here
NODE_ENV = production
```

### 4. Проверка работы

После деплоя проверить:

- Главная страница: `https://your-project.vercel.app/`
- API проверка: `https://your-project.vercel.app/api/ping`
- Chat функционал: `https://your-project.vercel.app/api/groq-chat`

## 🔧 Структура API на Vercel

Все `/api/*` запросы обрабатываются serverless функцией в `api/index.js`:

- `/api/ping` → проверка работы
- `/api/groq-chat` → чат с AI
- `/api/contracts` → работа с договорами
- `/api/bookings` → система бронирования
- `/api/orders` → обработка заказов

## 📁 Важные файлы для Vercel

- `vercel.json` - основная конфигурация
- `api/index.js` - единая точка входа для API
- `.vercelignore` - исключения из деплоя
- `package.json` - зависимости и скрипты

## ⚡ Преимущества Vercel

- **Автоматический деплой** из GitHub
- **Serverless функции** для API
- **Edge Network** для быстрой загрузки
- **Автоматические SSL** сертификаты
- **Preview деплои** для каждого PR

## 🛠️ Локальная разработка

Для локальной разработки используйте:

```bash
npm run dev  # Запуск Vite dev server
```

Vercel CLI для тестирования serverless функций:

```bash
npm i -g vercel
vercel dev  # Локальная симуляция Vercel окружения
```

## 🔒 Безопасность

- Переменные окружения защищены в Vercel
- CORS настроен для API эндпоинтов
- Автоматические HTTPS соединения
- Serverless изоляция функций

## 🚀 Автоматический деплой

После настройки каждый push в main ветку автоматически деплоится на Vercel.
Pull requests создают preview деплои для тестирования.
