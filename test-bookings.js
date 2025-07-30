// Test bookings API endpoint
import handler from "./api/index.js";

function createMockReq(method, url, body = {}, headers = {}) {
  return {
    method,
    url,
    body,
    headers,
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,

    setHeader(key, value) {
      this.headers[key] = value;
    },

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.data = data;
      console.log(
        `Response ${this.statusCode}:`,
        JSON.stringify(data, null, 2),
      );
      return this;
    },

    send(data) {
      this.data = data;
      console.log(`Response ${this.statusCode}:`, data);
      return this;
    },

    end() {
      console.log(`Response ${this.statusCode} ended`);
    },
  };

  return res;
}

async function testBookings() {
  console.log("🧪 Testing Bookings API...\n");

  // Test get all bookings (for admin)
  console.log("1. Testing GET /api/bookings/all");
  const getAllReq = createMockReq(
    "GET",
    "/api/bookings/all",
    {},
    { "user-id": "admin" },
  );
  const getAllRes = createMockRes();
  await handler(getAllReq, getAllRes);

  console.log("\n" + "=".repeat(50) + "\n");

  // Test create booking
  console.log("2. Testing POST /api/bookings");
  const createReq = createMockReq(
    "POST",
    "/api/bookings",
    {
      serviceType: "pro",
      serviceDescription: "Корпоративный сайт с интеграцией",
      clientName: "Тест Тестов",
      clientEmail: "test@example.com",
      clientPhone: "+7 900 123 45 67",
      preferredDate: "2024-02-20",
      preferredTime: "15:00",
      notes: "Важно сделать адаптивным",
    },
    { "user-id": "test-user" },
  );
  const createRes = createMockRes();
  await handler(createReq, createRes);

  console.log("\n" + "=".repeat(50) + "\n");

  // Test get user bookings
  console.log("3. Testing GET /api/bookings");
  const getUserReq = createMockReq(
    "GET",
    "/api/bookings",
    {},
    { "user-id": "test-user" },
  );
  const getUserRes = createMockRes();
  await handler(getUserReq, getUserRes);

  console.log("\n🎉 Bookings API tests completed!");
}

testBookings().catch(console.error);
