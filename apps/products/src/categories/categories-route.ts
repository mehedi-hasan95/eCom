import { createRoute, z } from "@hono/zod-openapi";

const tags = ["Categories"];
export const getCategoriesRoute = createRoute({
  method: "get",
  path: "/",
  summary: "Get Categories",
  tags,
  responses: {
    200: { description: "OK" },
    500: { description: "Internal server error" },
  },
});

export const getCategoryRoute = createRoute({
  method: "get",
  path: "/category",
  tags,
  summary: "Get a category",
  request: {
    query: z.object({
      category: z.string(),
    }),
  },
  responses: {
    200: { description: "OK" },
    404: { description: "NOT FOUND" },
    500: { description: "NOT" },
  },
});

// sub category
export const getSubCategoriesRoute = createRoute({
  method: "get",
  path: "/categories/sub-categories",
  summary: "Get Sub Categories",
  tags,
  responses: {
    200: { description: "OK" },
    500: { description: "Internal server error" },
  },
});

export const getSubCategoryRoute = createRoute({
  method: "get",
  path: "/categories/sub-category",
  summary: "Get a Sub Category",
  tags,
  request: {
    query: z.object({ slug: z.string() }),
  },
  responses: {
    200: { description: "OK" },
    500: { description: "Internal server error" },
  },
});
