import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  addToCartRoute,
  allAddToCartRoute,
  createProductRoute,
  deleteProductRoute,
  getAllProductsRoute,
  getProductsRoute,
  getSingleProductRoute,
  productPriceRoute,
  removeACartRoute,
  removeAllCartRoute,
  updateProductRoute,
} from "./products-route";
import {
  addToCartHandler,
  allAddToCartHandler,
  createProductHandler,
  deleteProductHandler,
  getAllProductsHandler,
  getProductsHandler,
  getSingleProductHandler,
  productPriceHandler,
  removeACartHandler,
  removeAllCartHandler,
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
  .openapi(getAllProductsRoute, getAllProductsHandler)
  .openapi(productPriceRoute, productPriceHandler)
  .openapi(addToCartRoute, addToCartHandler)
  .openapi(allAddToCartRoute, allAddToCartHandler)
  .openapi(removeACartRoute, removeACartHandler)
  .openapi(removeAllCartRoute, removeAllCartHandler);

export default app;
