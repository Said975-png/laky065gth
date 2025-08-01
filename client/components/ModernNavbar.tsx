import React, { useState, useEffect, useCallback, Fragment, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Brain,
  Home,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModernNavbarProps {
  onAddBasicPlan: () => void;
  onAddProPlan: () => void;
  onAddMaxPlan: () => void;
}

export default function ModernNavbar({
  onAddBasicPlan,
  onAddProPlan,
  onAddMaxPlan,
}: ModernNavbarProps) {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { getTotalItems, items, removeItem, getTotalPrice, clearCart } =
    useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Данные для поиска
  const searchData = [
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
      url: "/",
    },
    {
      id: "jarvis-interface",
      title: "Интерфейс ДЖАРВИС",
      description: "AI-помощник с голосовым управлением",
      type: "component",
      url: "/",
    },
    {
      id: "plans-basic",
      title: "Базовый план",
      description: "Начальный тарифный план с основными функциями",
      type: "plan",
      url: "/",
    },
    {
      id: "plans-pro",
      title: "PRO план",
      description: "Профессиональный план с расширенными возможностями",
      type: "plan",
      url: "/",
    },
    {
      id: "plans-max",
      title: "MAX план",
      description: "Максимальный план с полным набором функций",
      type: "plan",
      url: "/",
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
      url: "/",
    },
    {
      id: "ai-features",
      title: "AI возможности",
      description: "Искусственный интеллект и автоматизация",
      type: "feature",
      url: "/",
    },
    {
      id: "blockchain",
      title: "Blockchain интеграция",
      description: "Технологии блокчейн и криптографии",
      type: "feature",
      url: "/",
    },
    {
      id: "stark-tech",
      title: "Stark Industries Technology",
      description: "Продвинутые технологии Stark Industries",
      type: "feature",
      url: "/",
    },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    window.location.reload();
  }, [logout]);

  const handleProceedToOrder = useCallback(() => {
    navigate("/order");
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  }, []);

  // Поиск по данным
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchResults(filtered.slice(0, 6));
    setSelectedIndex(0);
  }, [searchQuery]);

  // Обработка результата поиска
  const handleSelectResult = useCallback((result: any) => {
    // Сначала закрываем поиск
    setIsSearchOpen(false);
    setSearchQuery("");

    if (result.url) {
      // Навигация на страницу
      navigate(result.url);

      // Дополнительные действия после навигации для специфических страниц
      setTimeout(() => {
        switch (result.id) {
          case "plans-basic":
          case "plans-pro":
          case "plans-max":
            document
              .querySelector('[data-section="plans"]')
              ?.scrollIntoView({ behavior: "smooth" });
            break;
          case "voice-commands":
            document.querySelector('[data-testid="voice-control"]')?.click();
            break;
          case "cart":
            document.querySelector('[data-testid="cart-button"]')?.click();
            break;
        }
      }, 100);
    } else {
      // Скролл к соответствующей секции или выполнение специального действия
      switch (result.id) {
        case "voice-commands":
          document.querySelector('[data-testid="voice-control"]')?.click();
          break;
        case "plans-basic":
        case "plans-pro":
        case "plans-max":
          document
            .querySelector('[data-section="plans"]')
            ?.scrollIntoView({ behavior: "smooth" });
          break;
        case "cart":
          document.querySelector('[data-testid="cart-button"]')?.click();
          break;
        default:
          window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [navigate]);

  // Обработка клавиш для поиска
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            handleSelectResult(searchResults[selectedIndex]);
          }
          break;
        case "Escape":
          setIsSearchOpen(false);
          setSearchQuery("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex, handleSelectResult]);

  // Фокус на input при открытии поиска
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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

  return (
    <Fragment>
      {/* Main Navigation */}
      <nav
        className={cn(
          "fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ease-in-out",
          "top-2 sm:top-4 rounded-full px-2 sm:px-3 lg:px-6 py-2 sm:py-3 w-auto max-w-[calc(100vw-0.5rem)] sm:max-w-[calc(100vw-2rem)] lg:max-w-4xl h-12 sm:h-14",
          // Transform navbar when search is open
          isSearchOpen
            ? "rounded-xl max-w-2xl bg-black/95 backdrop-blur-xl border-2 border-cyan-400/50 shadow-2xl shadow-cyan-400/20"
            : isScrolled
            ? "bg-white/10 backdrop-blur-md border border-white/20"
            : "bg-transparent border border-white/10",
          "shadow-lg",
        )}
      >
        {isSearchOpen ? (
          /* Search Mode */
          <div className="flex items-center w-full h-full space-x-2 px-4">
            <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по сайту..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
            />
            <Button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          /* Normal Mode */
          <div className="flex items-center justify-center w-full h-full">
            {/* Even spacing for all buttons */}
            <div className="flex items-center space-x-0.5 sm:space-x-2 lg:space-x-4 overflow-hidden">
            {/* Home Button */}
            <Button
              variant="ghost"
              onClick={scrollToTop}
              className={cn(
                "px-1 sm:px-2 lg:px-4 py-2 h-8 sm:h-10",
                "transition-all duration-200",
                "text-white hover:text-white",
              )}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Home className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline font-medium text-sm">
                  Home
                </span>
              </div>
            </Button>

            {/* Cart */}
            <CartDropdown
              items={items}
              getTotalItems={getTotalItems}
              getTotalPrice={getTotalPrice}
              removeItem={removeItem}
              clearCart={clearCart}
              handleProceedToOrder={handleProceedToOrder}
            />

            {/* Search Button */}
            <Button
              variant="ghost"
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "px-2 py-2 h-8 sm:h-10",
                "transition-all duration-200",
                "text-white hover:text-white hover:bg-cyan-400/20",
              )}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Search className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline font-medium text-sm">
                  Search
                </span>
              </div>
            </Button>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className={cn(
                "px-2 py-2 h-8 sm:h-10",
                "transition-all duration-200",
                "text-white hover:text-white",
              )}
            >
              <div className="flex items-center space-x-1">
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="hidden lg:inline font-medium text-sm">
                  {theme === "dark" ? "Светлая" : "Темная"}
                </span>
              </div>
            </Button>

            {/* User Menu or Auth Buttons */}
            {isAuthenticated && currentUser ? (
              <UserMenu
                user={currentUser}
                onLogout={handleLogout}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            ) : (
              <AuthButtons theme={theme} />
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden px-3 py-2 h-10",
                "transition-all duration-200",
                "text-white hover:text-white",
              )}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Search Results Dropdown */}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="fixed left-1/2 transform -translate-x-1/2 z-40 top-16 sm:top-20 w-full max-w-2xl mx-2 sm:mx-4">
          <div className="mt-2 bg-black/95 border border-cyan-400/30 rounded-lg backdrop-blur-sm overflow-hidden">
            {searchResults.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleSelectResult(result)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-cyan-400/10 last:border-b-0 transition-colors duration-200",
                  index === selectedIndex
                    ? "bg-cyan-400/20"
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
                        "text-xs font-mono px-2 py-1 rounded",
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
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onAddBasicPlan={onAddBasicPlan}
        onAddProPlan={onAddProPlan}
        onAddMaxPlan={onAddMaxPlan}
      />
    </Fragment>
  );
}

// Cart Dropdown Component
function CartDropdown({
  items,
  getTotalItems,
  getTotalPrice,
  removeItem,
  clearCart,
  handleProceedToOrder,
}: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative px-4 py-2 h-10",
            "transition-all duration-200",
            "text-white hover:text-white",
          )}
        >
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium text-sm">Cart</span>
            {getTotalItems() > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-80 mt-2 p-0 border-0 overflow-hidden",
          "bg-black/95 backdrop-blur-xl",
          "rounded-xl shadow-2xl border border-white/20",
        )}
      >
        <div className="p-4 border-b border-white/20">
          <h3 className="font-bold text-lg text-white">Shopping Cart</h3>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingCart className="w-12 h-12 text-cyan-400/50 mx-auto mb-3" />
              <p className="text-white/60">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{item.name}</h4>
                    <p className="text-sm text-white/60 mt-1">
                      {item.description.substring(0, 60)}...
                    </p>
                    <p className="text-lg font-bold text-cyan-400 mt-2">
                      {item.price.toLocaleString()} сум
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="ml-3 w-8 h-8 p-0 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-white/20 bg-black/80">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-white">TOTAL:</span>
              <span className="text-xl font-bold text-white">
                {getTotalPrice().toLocaleString()} сум
              </span>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={clearCart}
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400"
              >
                Clear All
              </Button>
              <Button
                onClick={handleProceedToOrder}
                variant="secondary"
                className="flex-1 font-semibold !bg-white !text-black hover:!bg-white/90 hover:!text-black transition-all duration-200"
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// User Menu Component
function UserMenu({ user, onLogout, theme, toggleTheme }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center space-x-2 px-4 py-2 h-10",
            "transition-all duration-200",
            "text-white hover:text-white",
          )}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden sm:block text-sm font-medium max-w-20 truncate">
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-64 backdrop-blur-xl rounded-xl mt-2",
          theme === "dark"
            ? "bg-black/95 border-white/20 text-white"
            : "bg-white/95 border-black/20 text-black",
        )}
      >
        <div
          className={cn(
            "px-4 py-3",
            theme === "dark"
              ? "border-b border-white/20"
              : "border-b border-black/20",
          )}
        >
          <div
            className={cn(
              "font-semibold",
              theme === "dark" ? "text-white" : "text-black",
            )}
          >
            {user.name}
          </div>
          <div
            className={cn(
              "text-sm",
              theme === "dark" ? "text-white/60" : "text-black/60",
            )}
          >
            {user.email}
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuItem
            onClick={() => (window.location.href = "/profile")}
            className={cn(
              "cursor-pointer rounded-lg",
              theme === "dark"
                ? "text-white hover:bg-white/10"
                : "text-black hover:bg-black/10",
            )}
          >
            <User className="mr-3 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => (window.location.href = "/profile")}
            className={cn(
              "cursor-pointer rounded-lg",
              theme === "dark"
                ? "text-white hover:bg-white/10"
                : "text-black hover:bg-black/10",
            )}
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => (window.location.href = "/chat")}
            className={cn(
              "cursor-pointer rounded-lg",
              theme === "dark"
                ? "text-white hover:bg-white/10"
                : "text-black hover:bg-black/10",
            )}
          >
            <Brain className="mr-3 h-4 w-4" />
            Чат с Пятницей 🤖
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={toggleTheme}
            className={cn(
              "cursor-pointer rounded-lg",
              theme === "dark"
                ? "text-white hover:bg-white/10"
                : "text-black hover:bg-black/10",
            )}
          >
            {theme === "dark" ? (
              <Sun className="mr-3 h-4 w-4" />
            ) : (
              <Moon className="mr-3 h-4 w-4" />
            )}
            {theme === "dark" ? "Светлая тема" : "Темная тема"}
          </DropdownMenuItem>
        </div>

        <div
          className={cn(
            "p-2 border-t",
            theme === "dark" ? "border-white/20" : "border-black/20",
          )}
        >
          <DropdownMenuItem
            onClick={onLogout}
            className="text-red-400 hover:bg-red-500/10 cursor-pointer rounded-lg"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Auth Buttons Component
function AuthButtons({ theme }: { theme: string }) {
  return (
    <div className="hidden sm:flex items-center space-x-3">
      <Button
        variant="ghost"
        className={cn(
          "px-4 py-2 font-medium text-sm h-10",
          "transition-all duration-200",
          theme === "dark"
            ? "text-white hover:text-white"
            : "text-black hover:text-black",
        )}
        asChild
      >
        <Link to="/login">Login</Link>
      </Button>
      <Button
        variant="secondary"
        className={cn(
          "px-4 py-2 font-medium text-sm h-10",
          "transition-all duration-200",
          theme === "dark"
            ? "!bg-white !text-black hover:!bg-white/90 hover:!text-black"
            : "!bg-black !text-white hover:!bg-black/90 hover:!text-white",
        )}
        asChild
      >
        <Link to="/signup">Sign Up</Link>
      </Button>
      <Button
        variant="ghost"
        className={cn(
          "px-4 py-2 font-medium text-sm h-10",
          "transition-all duration-200",
          theme === "dark"
            ? "text-white hover:text-white"
            : "text-black hover:text-black",
        )}
        asChild
      >
        <Link to="/chat">Пятница 🤖</Link>
      </Button>
    </div>
  );
}

// Mobile Menu Component
function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  currentUser,
  onLogout,
  onAddBasicPlan,
  onAddProPlan,
  onAddMaxPlan,
}: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute top-20 left-4 right-4 bg-black/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 shadow-2xl shadow-cyan-400/20">
        {/* Navigation Links */}
        <div className="space-y-3">
          {isAuthenticated && currentUser ? (
            <>
              <div className="p-3 bg-purple-500/10 border border-purple-400/20 rounded-xl">
                <div className="font-semibold text-white">
                  {currentUser.name}
                </div>
                <div className="text-sm text-white/60">{currentUser.email}</div>
              </div>

              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-cyan-400/10 transition-colors"
              >
                <User className="w-5 h-5 text-cyan-400" />
                <span className="text-white">Profile</span>
              </Link>

              <Link
                to="/chat"
                onClick={onClose}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-400/10 transition-colors"
              >
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-white">Чат с Пятницей 🤖</span>
              </Link>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={onClose}
                className="block p-3 text-center rounded-xl border border-cyan-400/30 hover:bg-cyan-400/10 text-cyan-300 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="block p-3 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium transition-transform hover:scale-105"
              >
                Sign Up
              </Link>
              <Link
                to="/chat"
                onClick={onClose}
                className="block p-3 text-center rounded-xl border border-purple-400/30 hover:bg-purple-400/10 text-purple-300 transition-colors"
              >
                Пятница
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
