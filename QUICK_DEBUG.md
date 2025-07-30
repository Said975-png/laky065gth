# 🚀 Quick Deploy & Debug

## Быстрое решение проблемы на Vercel

### 1. Деплой с улучшенной диагностикой:
```bash
npx vercel --prod --force
```

### 2. Проверка после деплоя:
- Откройте `/debug` на вашем сайте
- Нажмите "Test Chat API" 
- Посмотрите на сообщение - теперь оно покажет точную ошибку

### 3. Возможные проблемы и решения:

**"DEBUG: GROQ API Error 400: unsupported property"**
✅ **ИСПРАВЛЕНО** - API теперь очищает сообщения от лишних полей

**"DEBUG: GROQ API Error 401"**
→ Неверный API ключ, проверьте в Vercel Dashboard

**"DEBUG: GROQ API Error 429"**
→ Превышен лимит запросов, подождите или обновите план

**"DEBUG: Exception при запросе к GROQ"**
→ Проблема с fetch, возможно версия Node.js

**"Key status: отсутствует"**
→ Переменная не установлена, добавьте в Vercel Dashboard

### 4. Проверка логов:
```bash
npx vercel logs your-deployment-url --follow
```

### 5. Быстрый фикс:
После любых изменений в Environment Variables в Vercel Dashboard:
```bash
npx vercel --prod --force
```

---

💡 **Tip**: Страница `/debug` покажет точную причину проблемы!
