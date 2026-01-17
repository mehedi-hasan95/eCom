import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  loginRoute,
  logoutRoute,
  registrationOtpRoute,
  registrationRoute,
  sessionRoute,
  verifyRegistrationRoute,
} from "./auth-routes";
import {
  loginHandler,
  logoutHandler,
  registrationHandler,
  registrationOtpHandler,
  sessionHandler,
  verifyRegistrationHandler,
} from "./auth-handler";

const app = new OpenAPIHono({
  defaultHook,
});

app
  .openapi(registrationRoute, registrationHandler)
  .openapi(registrationOtpRoute, registrationOtpHandler)
  .openapi(verifyRegistrationRoute, verifyRegistrationHandler)
  .openapi(loginRoute, loginHandler)
  .openapi(logoutRoute, logoutHandler)
  .openapi(sessionRoute, sessionHandler);

export default app;
