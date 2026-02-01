import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import { createProductRoute, uploadImageRoute } from "./products-route";
import { createProductHandler, uploadImageHandler } from "./products-handler";

const app = new OpenAPIHono({
  defaultHook: defaultHook,
});

app
  .openapi(createProductRoute, createProductHandler)
  .openapi(uploadImageRoute, uploadImageHandler);

export default app;
