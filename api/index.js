const { createServer } = require('../dist/server/production.mjs');
const serverless = require('serverless-http');

const app = createServer();

module.exports = serverless(app);
