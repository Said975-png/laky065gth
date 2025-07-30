// Simple data storage for serverless environment
// Uses in-memory storage that persists during function execution

let inMemoryStorage = {
  users: [],
  orders: [],
  bookings: [],
};

// Users
export function addUser(user) {
  inMemoryStorage.users.push(user);
  console.log("👤 Пользователь добавлен:", user.email);
  return user;
}

export function getUsers() {
  return inMemoryStorage.users;
}

export function findUserByEmail(email) {
  return inMemoryStorage.users.find((u) => u.email === email);
}

// Orders
export function addOrder(order) {
  inMemoryStorage.orders.push(order);
  console.log("🛒 Заказ добавлен:", order.id);
  return order;
}

export function getOrders() {
  return inMemoryStorage.orders;
}

// Bookings
export function addBooking(booking) {
  inMemoryStorage.bookings.push(booking);
  console.log("📅 Бронь добавлена:", booking.id);
  return booking;
}

export function getBookings() {
  return inMemoryStorage.bookings;
}

export function updateBooking(bookingId, updates) {
  const index = inMemoryStorage.bookings.findIndex((b) => b.id === bookingId);
  if (index !== -1) {
    inMemoryStorage.bookings[index] = {
      ...inMemoryStorage.bookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    console.log("📝 Бронь обновлена:", bookingId);
    return true;
  }
  return false;
}

// Debug function
export function getAllData() {
  return {
    users: inMemoryStorage.users.length,
    orders: inMemoryStorage.orders.length,
    bookings: inMemoryStorage.bookings.length,
    data: inMemoryStorage,
  };
}

// Initialize with some demo data
inMemoryStorage.users.push({
  id: "demo-user-1",
  name: "Демо Пользователь",
  email: "demo@example.com",
  password: "demo123",
  createdAt: "2024-01-15T10:00:00Z",
});

inMemoryStorage.orders.push({
  id: "ORDER-DEMO-001",
  items: [{ name: "Лендинг", price: 50000 }],
  formData: {
    fullName: "Демо Клиент",
    phone: "+7 900 123 45 67",
    description: "Тестовый заказ для демонстрации",
    referenceUrl: "",
  },
  total: 50000,
  status: "pending",
  createdAt: "2024-01-16T14:30:00Z",
});

inMemoryStorage.bookings.push({
  id: "BOOK-DEMO-001",
  userId: "demo-user",
  serviceType: "pro",
  serviceDescription: "Создание корпоративного сайта",
  clientName: "Иван Петров",
  clientEmail: "ivan@example.com",
  clientPhone: "+7 900 123 45 67",
  preferredDate: "2024-02-15",
  preferredTime: "14:00",
  notes: "Требуется интеграция с CRM",
  status: "pending",
  createdAt: "2024-01-20T10:30:00Z",
  updatedAt: "2024-01-20T10:30:00Z",
});
