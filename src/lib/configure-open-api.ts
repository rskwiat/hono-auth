import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

import PackageJSON from "../../package.json";

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc("doc", {
    openapi: "3.0.0",
    info: {
      version: PackageJSON.version,
      title: PackageJSON.name,
    },
  });

  app.get(
    "/reference",
    apiReference({
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },
    }),
  );
};
