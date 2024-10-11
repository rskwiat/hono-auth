import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { createRouter } from "@/lib/create-app";
import createMessageObjectSchema from "@/middlewares/openapi/create-message-object-schema";
import jsonContent from "@/middlewares/openapi/json-content";

const router = createRouter()
  .openapi(
    createRoute({
      tags: ["Index"],
      method: "get",
      path: "/healthcheck",
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema("Users API"),
          "Health Check",
        ),
      },
    }),
    (c) => {
      return c.json({
        message: "App is running",
      }, HttpStatusCodes.OK);
    },

  );

export default router;
