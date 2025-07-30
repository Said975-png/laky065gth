import * as fs from "fs";
import * as path from "path";

// Пути к файлам данных
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings", "bookings.json");

// Убедимся, что директории существуют
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(path.dirname(BOOKINGS_FILE))) {
  fs.mkdirSync(path.dirname(BOOKINGS_FILE), { recursive: true });
}

// Интерфейсы
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface StoredOrder {
  id: string;
  items: any[];
  formData: {
    fullName: string;
    phone: string;
    description: string;
    referenceUrl?: string;
  };
  total: number;
  createdAt: string;
  status: string;
}

export interface StoredBooking {
  id: string;
  userId: string;
  serviceType: string;
  serviceDescription: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Утилиты для пользователей
export const loadUsers = (): StoredUser[] => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};

export const saveUsers = (users: StoredUser[]): void => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

export const addUser = (user: StoredUser): void => {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  console.log("👤 Новый пользователь сохранен:", user.email);
};

// Утилиты для заказов
export const loadOrders = (): StoredOrder[] => {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
};

export const saveOrders = (orders: StoredOrder[]): void => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Error saving orders:", error);
  }
};

export const addOrder = (order: StoredOrder): void => {
  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);
  console.log("🛒 Новый заказ сохранен:", order.id);
};

// Утилиты для броней (используем существующую логику)
export const loadBookings = (): StoredBooking[] => {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error loading bookings:", error);
    return [];
  }
};

export const saveBookings = (bookings: StoredBooking[]): void => {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error("Error saving bookings:", error);
  }
};

export const addBooking = (booking: StoredBooking): void => {
  const bookings = loadBookings();
  bookings.push(booking);
  saveBookings(bookings);
  console.log("📅 Новая бронь сохранена:", booking.id);
};

export const updateBooking = (bookingId: string, updates: Partial<StoredBooking>): boolean => {
  const bookings = loadBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  
  if (index === -1) {
    return false;
  }
  
  bookings[index] = { ...bookings[index], ...updates, updatedAt: new Date().toISOString() };
  saveBookings(bookings);
  console.log("📝 Бронь обновлена:", bookingId);
  return true;
};
