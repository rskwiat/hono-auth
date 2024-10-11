import { createRouter } from "@/lib/create-app";

import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const router = createRouter()
  .openapi(routes.users, handlers.users)
  .openapi(routes.getUser, handlers.getUser)
  .openapi(routes.createUser, handlers.createUser)
  .openapi(routes.deleteUser, handlers.deleteUser);

export default router;
