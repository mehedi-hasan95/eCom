import { createRoute, z } from "@hono/zod-openapi";
import { sellerMiddleware } from "../middleware";
import {
  deleteProductSchema,
  productSchemasForserver,
  updateProductSchemasForserver,
} from "@workspace/open-api/schemas/product.schemas";
import { sortValues } from "@workspace/open-api/lib/constants";

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
  tags,
  request: {
    query: z.object({
      sort: z.enum(sortValues).optional(),
      cats: z.string().optional(),
      maxPrice: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: {
      description: "All products",
    },
    404: { description: "Not found" },
  },
});
