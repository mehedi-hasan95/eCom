import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  createCategoryRoute,
  createSubCategoryRoute,
  deleteCategoryRoute,
  deleteSubCategoryRoute,
  updateCategoryRoute,
  updateSubCategoryRoute,
} from "./admin-route";
import {
  createCategoryHandler,
  createSubCategoryHandler,
  deleteCategoryHandler,
  deleteSubCategoryHandler,
  updateCategoryHandler,
  updateSubCategoryHandler,
} from "./admin-handler";

const app = new OpenAPIHono({
  defaultHook: defaultHook,
});

app
  .openapi(createCategoryRoute, createCategoryHandler)
  .openapi(updateCategoryRoute, updateCategoryHandler)
  .openapi(deleteCategoryRoute, deleteCategoryHandler)
  .openapi(createSubCategoryRoute, createSubCategoryHandler)
  .openapi(deleteSubCategoryRoute, deleteSubCategoryHandler)
  .openapi(updateSubCategoryRoute, updateSubCategoryHandler);

export default app;
