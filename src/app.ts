import connectDB from "@/db/database";
import index from "@/routes/index.routes";
import users from "@/routes/users/users.index";

import { OK } from "./constants/http-status-codes";
import { ACCEPTED } from "./constants/http-status-phrases";
import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import { authCookie } from "./middlewares/authCookie";

connectDB();

const app = createApp();

const routes = [
  index,
  users,
];

configureOpenApi(app);
routes.forEach((route) => {
  app.route("/", route);
});

// connectDB();
// app.route("/users", users);
// app.use("/auth/*", authCookie);
// app.route("/auth", auth);
// app.get("/*", (c) => {
//   return c.notFound();
// });

app.get("/healthcheck", async (c) => {
  return c.json({ message: ACCEPTED }, OK);
});

export default app;
