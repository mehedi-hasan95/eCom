import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  createProductRoute,
  deleteProductRoute,
  getAllProductsRoute,
  getProductsRoute,
  getSingleProductRoute,
  updateProductRoute,
} from "./products-route";
import {
  createProductHandler,
  deleteProductHandler,
  getAllProductsHandler,
  getProductsHandler,
  getSingleProductHandler,
  updateProductHandler,
} from "./products-handler";

const app = new OpenAPIHono({
  defaultHook: defaultHook,
});

app
  .openapi(createProductRoute, createProductHandler)
  .openapi(getProductsRoute, getProductsHandler)
  .openapi(getSingleProductRoute, getSingleProductHandler)
  .openapi(updateProductRoute, updateProductHandler)
  .openapi(deleteProductRoute, deleteProductHandler)
  .openapi(getAllProductsRoute, getAllProductsHandler);

export default app;
