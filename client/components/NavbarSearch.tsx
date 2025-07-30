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

  // Данные для поиска
  const searchData: SearchResult[] = [
    {
      id: "home",
      title: "Главная страница",
      description: "Домашняя страница с информацией о ДЖАРВИС AI",
      type: "page",
      url: "/",
    },
    {
      id: "voice-commands",
      title: "Голосовые команды",
      description: "Управление сайтом с помощью голоса",
      type: "feature",
    },
    {
      id: "jarvis-interface",
      title: "Интерфейс ДЖАРВИС",
      description: "AI-помощник с голосовым управлением",
      type: "component",
    },
    {
      id: "plans-basic",
      title: "Базовый план",
      description: "Начальный тарифный план с основными функциями",
      type: "plan",
    },
    {
      id: "plans-pro",
      title: "PRO план",
      description: "Профессиональный план с расширенными возможностями",
      type: "plan",
    },
    {
      id: "plans-max",
      title: "MAX план",
      description: "Максимальный план с полным набором функций",
      type: "plan",
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
      id: "cart",
      title: "Корзина",
      description: "Выбранные тарифные планы",
      type: "feature",
    },
    {
      id: "ai-features",
      title: "AI возможности",
      description: "Искусственный интеллект и автоматизация",
      type: "feature",
    },
    {
      id: "blockchain",
      title: "Blockchain интеграция",
      description: "Технологии блок��ейн и криптографии",
      type: "feature",
    },
    {
      id: "stark-tech",
      title: "Stark Industries Technology",
      description: "Продвинутые технологии Stark Industries",
      type: "feature",
    },
  ];

  const handleSelectResult = useCallback((result: SearchResult) => {
    if (result.url) {
      window.location.href = result.url;
    } else if (result.action) {
      result.action();
    } else {
      // Скролл к соответствующей секции или выполнение специального действия
      switch (result.id) {
        case "voice-commands":
          // Активировать голосового помощника
          (
            document.querySelector(
              '[data-testid="voice-control"]',
            ) as HTMLElement
          )?.click();
          break;
        case "plans-basic":
        case "plans-pro":
        case "plans-max":
          // Скролл к секции с планами
          document
            .querySelector('[data-section="plans"]')
            ?.scrollIntoView({ behavior: "smooth" });
          break;
        case "cart":
          // Открыть корзину
          (
            document.querySelector('[data-testid="cart-button"]') as HTMLElement
          )?.click();
          break;
        default:
          // Скролл наверх для остальных случаев
          window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    setIsOpen(false);
    setQuery("");
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

  // Закры��ие при клике вне области
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
