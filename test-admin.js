// Test all admin endpoints
import handler from './api/index.js';

function createMockReq(method, url, body = {}, headers = {}) {
  return {
    method,
    url,
    body,
    headers
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
      console.log(`Response ${this.statusCode}:`, JSON.stringify(data, null, 2));
      return this;
    },
    
    send(data) {
      this.data = data;
      console.log(`Response ${this.statusCode}:`, data);
      return this;
    },
    
    end() {
      console.log(`Response ${this.statusCode} ended`);
    }
  };
  
  return res;
}

async function testAdmin() {
  console.log('🧪 Testing Admin Endpoints...\n');
  
  // 1. Test user registration
  console.log('1. Testing POST /api/users/register');
  const registerReq = createMockReq('POST', '/api/users/register', {
    name: 'Тест Пользова��ель',
    email: 'test@example.com',
    password: 'password123'
  });
  const registerRes = createMockRes();
  await handler(registerReq, registerRes);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 2. Test order creation
  console.log('2. Testing POST /api/orders');
  const orderReq = createMockReq('POST', '/api/orders', {
    items: [
      { id: 1, name: 'Лендинг', price: 50000 },
      { id: 2, name: 'Брендинг', price: 30000 }
    ],
    formData: {
      fullName: 'Иван Петров',
      phone: '+7 900 123 45 67',
      description: 'Нужен современный лендинг для IT компании',
      referenceUrl: 'https://example.com'
    },
    total: 80000
  });
  const orderRes = createMockRes();
  await handler(orderReq, orderRes);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 3. Test booking creation
  console.log('3. Testing POST /api/bookings');
  const bookingReq = createMockReq('POST', '/api/bookings', {
    serviceType: 'pro',
    serviceDescription: 'Разработка корпоративного сайта',
    clientName: 'Мария Сидорова',
    clientEmail: 'maria@company.com',
    clientPhone: '+7 911 234 56 78',
    preferredDate: '2024-02-25',
    preferredTime: '10:00',
    notes: '��ребуется интеграция с CRM системой'
  }, { 'user-id': 'user-123' });
  const bookingRes = createMockRes();
  await handler(bookingReq, bookingRes);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 4. Test getting all users (admin)
  console.log('4. Testing GET /api/users/all');
  const usersReq = createMockReq('GET', '/api/users/all');
  const usersRes = createMockRes();
  await handler(usersReq, usersRes);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 5. Test getting all orders (admin)
  console.log('5. Testing GET /api/orders/all');
  const ordersReq = createMockReq('GET', '/api/orders/all');
  const ordersRes = createMockRes();
  await handler(ordersReq, ordersRes);
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 6. Test getting all bookings (admin)
  console.log('6. Testing GET /api/bookings/all');
  const bookingsReq = createMockReq('GET', '/api/bookings/all');
  const bookingsRes = createMockRes();
  await handler(bookingsReq, bookingsRes);
  
  console.log('\n🎉 Admin API tests completed!');
}

testAdmin().catch(console.error);
