import type { Context } from "hono";

// authenticated routes
import { OK } from "@/constants/http-status-codes";

export async function checkAuth(c: Context) {
  return await c.json({ success: "you are authorized" }, OK);
}
