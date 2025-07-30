import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page" | "feature" | "plan" | "component";
  url?: string;
  action?: () => void;
  keywords?: string[]; // Дополнительные ключевые слова для поиска
}

interface NavbarSearchProps {
  className?: string;
}

export function NavbarSearch({ className }: NavbarSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Данные для поиска - все страницы и функции сайта
  const searchData: SearchResult[] = [
    // Основные страницы
    {
      id: "home",
      title: "Главн��я страница",
      description: "Домашняя страница с ДЖАРВИС AI и всеми функциями",
      type: "page",
      url: "/",
      keywords: ["главная", "домой", "home", "index", "начало"],
    },
    {
      id: "login",
      title: "Вход в систему",
      description: "Авторизация пользователя",
      type: "page",
      url: "/login",
    },
    {
      id: "signup",
      title: "Регистрация",
      description: "Создание нового аккаунта",
      type: "page",
      url: "/signup",
    },
    {
      id: "profile",
      title: "Профиль пользователя",
      description: "Настройки и информация о пользователе",
      type: "page",
      url: "/profile",
    },
    {
      id: "order",
      title: "Форма заказа",
      description: "Оформление заказа услуг",
      type: "page",
      url: "/order",
    },
    {
      id: "chat",
      title: "Чат с Пятницей",
      description: "AI чат-ассистент Пятница",
      type: "page",
      url: "/chat",
      keywords: ["пятниц��", "friday", "чат", "chat", "ai", "ассистент", "помощник", "бот"],
    },
    {
      id: "admin",
      title: "Панель администратора",
      description: "Административная панель управления",
      type: "page",
      url: "/admin",
    },
    {
      id: "debug",
      title: "Отладка",
      description: "Страница отладки системы",
      type: "page",
      url: "/debug",
    },

    // Секции главной страницы
    {
      id: "hero-section",
      title: "Hero секция",
      description: "Главная секция с ДЖАРВИС и 3D моделью",
      type: "component",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      id: "advantages",
      title: "Преимущества",
      description: "Секция с преимуществами ДЖАРВИС AI",
      type: "component",
      action: () => document.querySelector('[data-section="advantages"]')?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "pricing",
      title: "Тарифы и цены",
      description: "Секция с тарифными планами",
      type: "component",
      action: () => document.querySelector('[data-section="pricing"]')?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "jarvis-demo",
      title: "Демо ДЖАРВИС",
      description: "Демонстрация возможностей AI-ассистента",
      type: "component",
      action: () => {
        const demoElement = document.querySelector('#jarvis-demo, [data-section="demo"]');
        if (demoElement) {
          demoElement.scrollIntoView({ behavior: "smooth" });
        } else {
          // Если элемент не найден, скроллим вниз
          window.scrollTo({ top: document.body.scrollHeight * 0.6, behavior: "smooth" });
        }
      },
    },

    // Тарифные планы
    {
      id: "plan-beginner",
      title: "Beginner Plan",
      description: "Базовый тарифный план - 199 сум",
      type: "plan",
      action: () => document.querySelector('[data-section="pricing"]')?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "plan-intermediate",
      title: "Intermediate Plan",
      description: "Средний тарифный план - 349 сум",
      type: "plan",
      action: () => document.querySelector('[data-section="pricing"]')?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "plan-advanced",
      title: "Advanced Plan",
      description: "Продвинутый тарифный план - 495 сум",
      type: "plan",
      action: () => document.querySelector('[data-section="pricing"]')?.scrollIntoView({ behavior: "smooth" }),
    },

    // Функции и возможности
    {
      id: "voice-control",
      title: "Голосовое управление",
      description: "Управление сайтом с помощью голосовых команд",
      type: "feature",
      action: () => {
        const voiceButton = document.querySelector('[data-testid="voice-control"]') as HTMLElement;
        if (voiceButton) {
          voiceButton.click();
        }
      },
    },
    {
      id: "jarvis-commands",
      title: "Команды ДЖАРВИС",
      description: "Панель команд AI-ассистента",
      type: "feature",
      action: () => {
        const commandsButton = document.querySelector('button:has([data-icon="bot"])') as HTMLElement;
        if (commandsButton) {
          commandsButton.click();
        }
      },
    },
    {
      id: "cart",
      title: "Кор��ина покупок",
      description: "Управление выбранными тарифными планами",
      type: "feature",
      action: () => {
        const cartButton = document.querySelector('[data-testid="cart-button"]') as HTMLElement;
        if (cartButton) {
          cartButton.click();
        }
      },
    },
    {
      id: "theme-toggle",
      title: "Смена темы",
      description: "Переключение между светлой и темной темой",
      type: "feature",
      action: () => {
        const themeButton = document.querySelector('button:has([data-lucide="sun"]), button:has([data-lucide="moon"])') as HTMLElement;
        if (themeButton) {
          themeButton.click();
        }
      },
    },
    {
      id: "3d-model",
      title: "3D модель",
      description: "Интерактивная 3D модель ДЖАРВИС",
      type: "component",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      id: "stark-hud",
      title: "Stark HUD",
      description: "Интерфейс в стиле Stark Industries",
      type: "component",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      id: "stark-mode",
      title: "Stark Mode",
      description: "Специальный режим Stark Industries",
      type: "feature",
      action: () => {
        const starkButton = document.querySelector('[data-testid="stark-mode"]') as HTMLElement;
        if (starkButton) {
          starkButton.click();
        }
      },
    },

    // AI и технологии
    {
      id: "ai-assistant",
      title: "AI Ассистент",
      description: "Искусственный интеллект помощник",
      type: "feature",
      url: "/chat",
    },
    {
      id: "neural-network",
      title: "Нейронные сети",
      description: "Технологии машинного обучения",
      type: "feature",
      action: () => document.querySelector('[data-section="advantages"]')?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "blockchain",
      title: "Blockchain",
      description: "Технологии блокчейн и криптографии",
      type: "feature",
      action: () => document.querySelector('[data-section="advantages"]')?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      id: "face-recognition",
      title: "Распознавание лиц",
      description: "Биометрическая идентификация",
      type: "feature",
      action: () => document.querySelector('[data-section="advantages"]')?.scrollIntoView({ behavior: "smooth" }),
    },

    // Сервисы и формы
    {
      id: "service-order",
      title: "Заказ услуг",
      description: "Форма заказа индивидуальных услуг",
      type: "feature",
      action: () => {
        const orderButton = document.querySelector('button:contains("Заказать услугу")') as HTMLElement;
        if (orderButton) {
          orderButton.click();
        } else {
          window.location.href = "/order";
        }
      },
    },
    {
      id: "booking-form",
      title: "Форма бронирования",
      description: "Бронирование встреч и консультаций",
      type: "feature",
      url: "/order",
    },
    {
      id: "auth-modal",
      title: "Модальное окно авторизации",
      description: "Быстрая авторизация без перехода на страницу",
      type: "feature",
      action: () => {
        const authButton = document.querySelector('button:contains("Login"), button:contains("Sign Up")') as HTMLElement;
        if (authButton) {
          authButton.click();
        }
      },
    },

    // Дополнительные компоненты
    {
      id: "typewriter-effect",
      title: "Эффект печатной машинки",
      description: "Анимация набора текста",
      type: "component",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      id: "stark-effects",
      title: "Stark эффекты",
      description: "Визуальные эффекты в стиле Iron Man",
      type: "component",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      id: "glitch-text",
      title: "Glitch текст",
      description: "Эффект глитча для текста",
      type: "component",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      id: "arc-reactor",
      title: "Arc Reactor",
      description: "Анимированный реактор дугового типа",
      type: "component",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },

    // Статистика и показатели
    {
      id: "stats",
      title: "Статистика",
      description: "Показатели эффективности: 99.9% точность, 24/7 доступность",
      type: "component",
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
    },
    {
      id: "accuracy",
      title: "Точность ответов",
      description: "99.9% точность ответов AI-ассистента",
      type: "feature",
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
    },
    {
      id: "availability",
      title: "Доступность 24/7",
      description: "Круглосуточная работа системы",
      type: "feature",
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
    },
    {
      id: "response-time",
      title: "Время отклика",
      description: "Менее 1 секунды время отклика",
      type: "feature",
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
    },
  ];

  const handleSelectResult = useCallback((result: SearchResult) => {
    // Закрываем поиск
    setIsOpen(false);
    setQuery("");

    // Выполняем действие
    if (result.url) {
      // Переход на страницу
      window.location.href = result.url;
    } else if (result.action) {
      // Выполнение пользовательского действия
      try {
        result.action();
      } catch (error) {
        console.warn("Не удалось выполнить действие для:", result.title, error);
        // Fallback - скролл к началу страницы
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Fallback действия для старых результатов
      switch (result.id) {
        case "voice-commands":
        case "voice-control":
          const voiceButton = document.querySelector('[data-testid="voice-control"]') as HTMLElement;
          if (voiceButton) {
            voiceButton.click();
          }
          break;
        case "plans-basic":
        case "plans-pro":
        case "plans-max":
        case "plan-beginner":
        case "plan-intermediate":
        case "plan-advanced":
          document.querySelector('[data-section="pricing"]')?.scrollIntoView({ behavior: "smooth" });
          break;
        case "cart":
          const cartButton = document.querySelector('[data-testid="cart-button"]') as HTMLElement;
          if (cartButton) {
            cartButton.click();
          }
          break;
        case "advantages":
          document.querySelector('[data-section="advantages"]')?.scrollIntoView({ behavior: "smooth" });
          break;
        case "pricing":
          document.querySelector('[data-section="pricing"]')?.scrollIntoView({ behavior: "smooth" });
          break;
        default:
          // Скролл наверх для неопознанных случаев
          window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, []);

  // Поиск по данным
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()),
    );

    setResults(filtered.slice(0, 6)); // Ограничиваем до 6 результатов
    setSelectedIndex(0);
  }, [query]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setQuery("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelectResult]);

  // Фокус на input при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "text-cyan-400";
      case "feature":
        return "text-blue-400";
      case "plan":
        return "text-orange-400";
      case "component":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "page":
        return "Страница";
      case "feature":
        return "Функция";
      case "plan":
        return "Тариф";
      case "component":
        return "Компонент";
      default:
        return type;
    }
  };

  // Закрытие при клике вне области
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-search-container]')) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} data-search-container>
      {/* Кнопка поиска */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        className={cn(
          "px-3 py-2 h-8 sm:h-10",
          "transition-all duration-200",
          "text-white hover:text-white",
          "hover:bg-white/10",
        )}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Search className="w-3 sm:w-4 h-3 sm:h-4" />
          <span className="hidden sm:inline font-medium text-sm">
            Поиск
          </span>
        </div>
      </Button>

      {/* Модальное окно поиска */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-16 sm:pt-20 bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className="relative w-full max-w-2xl mx-2 sm:mx-4" data-search-container>
            {/* Поисковая строка */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по сайту..."
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-base sm:text-lg bg-black/95 border-2 border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none backdrop-blur-sm min-h-[48px] transition-all duration-200"
              />
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Результаты поиска */}
            {results.length > 0 && (
              <div className="mt-2 bg-black/95 border border-cyan-400/30 rounded-xl backdrop-blur-sm overflow-hidden shadow-2xl">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-cyan-400/10 last:border-b-0 transition-all duration-200",
                      index === selectedIndex
                        ? "bg-cyan-400/20 transform scale-[1.02]"
                        : "hover:bg-cyan-400/10",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-400">
                          {result.description}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span
                          className={cn(
                            "text-xs font-mono px-2 py-1 rounded-md bg-black/40",
                            getTypeColor(result.type),
                          )}
                        >
                          {getTypeLabel(result.type)}
                        </span>
                        {result.url && (
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Пустой результат */}
            {query.trim() && results.length === 0 && (
              <div className="mt-2 bg-black/95 border border-cyan-400/30 rounded-xl backdrop-blur-sm p-6 text-center">
                <div className="text-gray-400 mb-2">
                  <Search className="w-8 h-8 mx-auto opacity-50" />
                </div>
                <p className="text-white/60">Ничего не найдено</p>
                <p className="text-sm text-gray-500">
                  Попробуйте изменить поисковый запрос
                </p>
              </div>
            )}

            {/* Подсказки */}
            <div className="mt-4 text-sm text-gray-400 text-center space-x-4">
              <span>↑↓ навигация</span>
              <span>Enter выбор</span>
              <span>Esc закрыть</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
