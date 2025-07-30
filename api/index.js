import { createServer } from "../server/index.js";

// Create Express app from existing server configuration
const app = createServer();

// Export for Vercel
export default app;
