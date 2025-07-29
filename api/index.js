import { createServer } from "../server/index.js";
import serverlessHttp from "serverless-http";

const app = createServer();

export default serverlessHttp(app);
