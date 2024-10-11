import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings } from "@/lib/types";

import notFound from "@/middlewares/not-found";
import onError from "@/middlewares/on-error";
import defaultHook from "@/middlewares/openapi/default-hook";
import pinoLogger from "@/middlewares/pino-logger";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>({
    strict: false,
  });

  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
};
