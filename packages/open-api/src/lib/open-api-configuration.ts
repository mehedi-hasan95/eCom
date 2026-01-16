import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { ZodError } from "zod";
import { Context } from "hono";

export const openAPIConfiguration = (app: OpenAPIHono) => {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My API",
    },
  });
  app.get(
    "/scalar",
    Scalar({
      url: "/api/v1/doc",
      pageTitle: "Ecom API",
      darkMode: true,
      defaultHttpClient: { clientKey: "fetch", targetKey: "js" },
    })
  );
};

// Zod error beautify
const formatZodErrors = (result: any) => {
  if (result.success === false && result.error instanceof ZodError) {
    return result.error.issues.map((issue: any) => ({
      path: issue.path.join("."), // e.g., "body.email" or "params.id"
      message: issue.message, // e.g., "Invalid email address"
      code: issue.code, // e.g., "invalid_string"
    }));
  }
  return [];
};

export const defaultHook = (result: any, c: Context) => {
  if (!result.success) {
    return c.json(
      {
        ok: false,
        errors: formatZodErrors(result),
        source: "custom_error_handler",
      },
      422
    );
  }
};
