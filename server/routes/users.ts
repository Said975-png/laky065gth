import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users", "users.json");

// Ensure users directory exists
const ensureUsersDirectory = () => {
  const usersDir = path.dirname(USERS_FILE);
  if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir, { recursive: true });
  }
};

// Load users from file
const loadUsers = () => {
  ensureUsersDirectory();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
  return [];
};

// Save users to file
const saveUsers = (users: any[]) => {
  ensureUsersDirectory();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

// Register new user
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Все поля обязательны для заполнения",
      });
    }

    const users = loadUsers();
    
    // Check if user already exists
    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Пользователь с таким email уже существует",
      });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, hash this password!
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    console.log("✅ New user registered:", { name, email, id: newUser.id });

    res.json({
      success: true,
      message: "Пользователь успешно зарегистрирован",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка сервера при регистрации",
    });
  }
};

// Get all users (for admin)
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = loadUsers();
    
    res.json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("❌ Error getting users:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка получения пользователей",
    });
  }
};
