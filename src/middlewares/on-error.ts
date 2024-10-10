import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR, OK } from "@/constants/http-status-codes";
import env from "@/env";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== OK
    ? (currentStatus as StatusCode)
    : INTERNAL_SERVER_ERROR;

  const ev = c.env?.NODE_ENV || env.NODE_ENV;
  return c.json(
    {
      message: err.message,

      stack: ev === "production"
        ? undefined
        : err.stack,
    },
    statusCode,
  );
};

export default onError;
