import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware";

const tags = ["Wishlist"];
export const createWishlistRoute = createRoute({
  method: "post",
  path: "/create",
  tags,
  summary: "Add to Wishlist",
  middleware: authMiddleware,
  request: {
    body: {
      content: { "application/json": { schema: z.object({ id: z.string() }) } },
    },
  },
  responses: {
    201: { description: "Add to wishlist" },
    404: { description: "Product not found" },
  },
});

export const getWishlistRoute = createRoute({
  method: "get",
  path: "/get",
  tags,
  summary: "Get Wishlist",
  middleware: authMiddleware,

  responses: {
    200: { description: "Get all wishlist" },
  },
});

export const removeWishlistRoute = createRoute({
  method: "delete",
  path: "/delete",
  tags,
  summary: "Delete Wishlist",
  middleware: authMiddleware,
  request: {
    body: {
      content: { "application/json": { schema: z.object({ id: z.string() }) } },
    },
  },
  responses: {
    201: { description: "Get all wishlist" },
    404: { description: "Not found in wishlist" },
  },
});
