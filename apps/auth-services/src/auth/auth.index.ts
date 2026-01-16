import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import { registrationRoute } from "./auth-routes";
import { registrationHandler } from "./auth-handler";

const app = new OpenAPIHono({
  defaultHook,
});

app.openapi(registrationRoute, registrationHandler);

export default app;
