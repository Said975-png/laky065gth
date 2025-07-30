// Simple test script for API endpoints
// Run with: node test-api.js

import handler from "./api/index.js";

// Mock request and response objects
function createMockReq(method, url, body = {}) {
  return {
    method,
    url,
    body,
    headers: {},
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

async function testAPI() {
  console.log("🧪 Testing API endpoints...\n");

  // Test ping endpoint
  console.log("1. Testing /api/ping");
  const pingReq = createMockReq("GET", "/api/ping");
  const pingRes = createMockRes();
  await handler(pingReq, pingRes);

  console.log("\n" + "=".repeat(50) + "\n");

  // Test chat endpoint with realistic message format (with extra fields)
  console.log("2. Testing /api/groq-chat with realistic message format");
  const chatReq = createMockReq("POST", "/api/groq-chat", {
    messages: [
      {
        role: "user",
        content: "Привет!",
        timestamp: Date.now(),
        id: "msg_123",
      },
      {
        role: "assistant",
        content: "Привет! Как дела?",
        timestamp: Date.now() + 1000,
        id: "msg_124",
      },
      {
        role: "user",
        content: "Расскажи про веб-разработку",
        timestamp: Date.now() + 2000,
        id: "msg_125",
      },
    ],
  });
  const chatRes = createMockRes();
  await handler(chatReq, chatRes);

  console.log("\n🎉 API tests completed!");
}

testAPI().catch(console.error);
