import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  getCategoriesHandler,
  getCategoryHandler,
  getSubCategoriesHandler,
  getSubCategoryHandler,
} from "./categories-handler";
import {
  getCategoriesRoute,
  getCategoryRoute,
  getSubCategoriesRoute,
  getSubCategoryRoute,
} from "./categories-route";

const app = new OpenAPIHono({
  defaultHook: defaultHook,
});

app
  .openapi(getCategoriesRoute, getCategoriesHandler)
  .openapi(getCategoryRoute, getCategoryHandler)
  .openapi(getSubCategoriesRoute, getSubCategoriesHandler)
  .openapi(getSubCategoryRoute, getSubCategoryHandler);

export default app;
