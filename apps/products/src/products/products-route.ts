import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware, sellerMiddleware } from "../middleware";
import {
  addToCartSchema,
  deleteProductSchema,
  productSchemasForserver,
  updateProductSchemasForserver,
} from "@workspace/open-api/schemas/product.schemas";
import { DEFAULT_LIMIT, sortValues } from "@workspace/open-api/lib/constants";

const tags = ["Products"];

export const createProductRoute = createRoute({
  method: "post",
  path: "/create",
  tags,
  summary: "Create Product",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: productSchemasForserver,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Create product",
    },
    500: {
      description: "Internal server error",
    },
  },
});

export const getProductsRoute = createRoute({
  method: "get",
  path: "/all-products",
  tags,
  summary: "Get all products",
  description:
    "The seller can get their products by using their email, alongside all products.",
  request: {
    query: z.object({ userEmail: z.string().optional() }),
  },
  responses: {
    200: { description: "All products" },
    500: { description: "Internal server error" },
  },
});

export const getSingleProductRoute = createRoute({
  method: "get",
  path: "/single-product",
  tags,
  summary: "Get Single Product",
  request: {
    query: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: "Found" },
    404: { description: "Not Found" },
  },
});

/**
 * ============================================================
 * 📌 API: Update product
 * ============================================================
 */

export const updateProductRoute = createRoute({
  method: "patch",
  path: "/update",
  tags,
  summary: "Update a Product",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: updateProductSchemasForserver,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Images uploaded successfully",
    },
    404: {
      description: "Not Found",
    },
  },
});

/**
 * ============================================================
 * 📌 API: Delete product
 * ============================================================
 */

export const deleteProductRoute = createRoute({
  method: "delete",
  path: "/delete",
  tags,
  summary: "Delete a product",
  middleware: sellerMiddleware,
  request: {
    body: { content: { "application/json": { schema: deleteProductSchema } } },
  },
  responses: {
    201: { description: "Deleted" },
    404: { description: "Not found" },
  },
});

/**
 * ============================================================
 * 📌 API: Get all product
 * ============================================================
 */

export const getAllProductsRoute = createRoute({
  method: "get",
  path: "/all-product",
  tags: ["Products"],
  summary: "All products with infinity scroll",
  request: {
    query: z.object({
      sort: z.enum(sortValues).optional(),
      cats: z.string().optional(),
      maxPrice: z.coerce.number().optional(),
      minPrice: z.coerce.number().optional(),
      sellerEmail: z.string().optional(),
      search: z.string().optional(),
      cursor: z.string().nullish(),
      limit: z.coerce.number().min(1).max(50).default(DEFAULT_LIMIT),
    }),
  },
  responses: {
    200: {
      description: "All products",
    },
    404: {
      description: "Not found",
    },
  },
});

export const productPriceRoute = createRoute({
  method: "get",
  path: "/price-range",
  summary: "Min & Max price",
  tags,
  responses: {
    200: { description: "OK" },
    500: { description: "Internal server error" },
  },
});

export const addToCartRoute = createRoute({
  method: "patch",
  path: "create-add-to-cart",
  summary: "Add to Cart",
  tags,
  middleware: authMiddleware,
  request: {
    body: { content: { "application/json": { schema: addToCartSchema } } },
  },
  responses: {
    201: {
      description: "CREATED",
      content: { "application/json": { schema: addToCartSchema } },
    },
    401: { description: "Unauthorize User" },
    500: { description: "Internal server error" },
  },
});

export const allAddToCartRoute = createRoute({
  method: "get",
  path: "add-to-cart",
  tags,
  middleware: authMiddleware,
  summary: "Get all add to cart",
  responses: {
    200: { description: "OK" },
    500: { description: "Internal server error" },
  },
});

export const removeACartRoute = createRoute({
  method: "delete",
  path: "remove-a-cart",
  tags,
  middleware: authMiddleware,
  summary: "Remove a cart",
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ productId: z.string() }) },
      },
    },
  },
  responses: {
    201: {
      description: "Remove a cart",
    },
    401: { description: "Unauthorize User" },
    500: { description: "Internal server error" },
  },
});

export const removeAllCartRoute = createRoute({
  method: "delete",
  path: "remove-all-cart",
  tags,
  middleware: authMiddleware,
  summary: "Remove all cart",
  responses: {
    201: {
      description: "Remove all cart",
    },
    401: { description: "Unauthorize User" },
    500: { description: "Internal server error" },
  },
});
