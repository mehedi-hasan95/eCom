import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  forgetPasswordEmailRoute,
  forgetPasswordVerifyRoute,
  getUserDetailsRoute,
  loginRoute,
  logoutRoute,
  registrationOtpRoute,
  registrationRoute,
  resetPasswordRoute,
  sessionRoute,
  verifyRegistrationRoute,
} from "./auth-routes";
import {
  forgetPasswordEmailHandler,
  forgetPasswordVerifyHandler,
  getUserDetailsHandler,
  loginHandler,
  logoutHandler,
  registrationHandler,
  registrationOtpHandler,
  resetPasswordHandler,
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
  .openapi(sessionRoute, sessionHandler)
  .openapi(forgetPasswordEmailRoute, forgetPasswordEmailHandler)
  .openapi(forgetPasswordVerifyRoute, forgetPasswordVerifyHandler)
  .openapi(resetPasswordRoute, resetPasswordHandler)
  .openapi(getUserDetailsRoute, getUserDetailsHandler);

export default app;
