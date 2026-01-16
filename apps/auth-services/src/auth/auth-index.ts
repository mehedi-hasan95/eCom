import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  registrationOtpRoute,
  registrationRoute,
  verifyRegistrationRoute,
} from "./auth-routes";
import {
  registrationHandler,
  registrationOtpHandler,
  verifyRegistrationHandler,
} from "./auth-handler";

const app = new OpenAPIHono({
  defaultHook,
});

app
  .openapi(registrationRoute, registrationHandler)
  .openapi(registrationOtpRoute, registrationOtpHandler)
  .openapi(verifyRegistrationRoute, verifyRegistrationHandler);

export default app;
