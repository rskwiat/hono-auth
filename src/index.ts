import { serve } from "@hono/node-server";
// import dotenv from "dotenv";

import env from "@/env";

import app from "./app";

console.log(`Server is running on port ${env.PORT}`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});
