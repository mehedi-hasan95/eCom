import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  createCategoryRoute,
  deleteCategoryRoute,
  updateCategoryRoute,
} from "./admin-route";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  updateCategoryHandler,
} from "./admin-handler";

const app = new OpenAPIHono({
  defaultHook: defaultHook,
});

app
  .openapi(createCategoryRoute, createCategoryHandler)
  .openapi(updateCategoryRoute, updateCategoryHandler)
  .openapi(deleteCategoryRoute, deleteCategoryHandler);

export default app;
