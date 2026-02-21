import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
import {
  createWishlistRoute,
  getWishlistRoute,
  removeWishlistRoute,
} from "./wishlist-route";
import {
  createWishlistHandler,
  getWishlistHandler,
  removeWishlistHandler,
} from "./wishlist-handler";

const app = new OpenAPIHono({
  defaultHook: defaultHook,
});

app
  .openapi(createWishlistRoute, createWishlistHandler)
  .openapi(getWishlistRoute, getWishlistHandler)
  .openapi(removeWishlistRoute, removeWishlistHandler);

export default app;
