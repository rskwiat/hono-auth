import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";

import type { AppBindings } from "@/lib/types";

import connectDB from "@/db/database";

import { OK } from "./constants/http-status-codes";
import { ACCEPTED } from "./constants/http-status-phrases";
import { authCookie } from "./middlewares/authCookie";
import notFound from "./middlewares/not-found";
import onError from "./middlewares/on-error";
import pinoLogger from "./middlewares/pino-logger";
import { auth, users } from "./routes";
// const PORT = process.env.PORT!;
const app = new OpenAPIHono<AppBindings>({
  strict: false,
});

// dotenv.config();

// connectDB();
app.use(pinoLogger());
// app.route("/users", users);
// app.use("/auth/*", authCookie);
// app.route("/auth", auth);
// app.get("/*", (c) => {
//   return c.notFound();
// });

app.get("/healthcheck", async (c) => {
  return c.json({ message: ACCEPTED }, OK);
});

app.get("/error", () => {
  throw new Error("not nice");
});

app.notFound(notFound);
app.onError(onError);

export default app;
