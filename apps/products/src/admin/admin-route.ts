import { createRoute, z } from "@hono/zod-openapi";
import { slugRegex } from "@workspace/open-api/schemas/regx";
import { adminMiddleware } from "../middleware";
import { subCategorySchema } from "@workspace/open-api/schemas/admin.schamas";

const tags = ["Admin"];
export const createCategoryRoute = createRoute({
  method: "post",
  path: "/create-category",
  tags,
  summary: "Create Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            name: z.string().min(1).max(50),
            slug: z
              .string()
              .min(1)
              .max(80)
              .regex(slugRegex, "Invalid slug format"),
            image: z
              .any()
              .openapi({
                type: "string",
                format: "binary",
              })
              .optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const updateCategoryRoute = createRoute({
  method: "post",
  path: "/update-category",
  tags,
  summary: "Update Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z
            .object({
              id: z.string(),
              name: z.string().min(1).max(50),
              slug: z
                .string()
                .min(1)
                .max(80)
                .regex(slugRegex, "Invalid slug format"),
              image: z
                .any()
                .openapi({
                  type: "string",
                  format: "binary",
                })
                .optional(),
              previousImage: z.string().optional(),
            })
            .refine((data) => !(data.image && data.previousImage), {
              message: "Remove the previous image before uploading a new one",
              path: ["image"],
            }),
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const deleteCategoryRoute = createRoute({
  method: "delete",
  path: `/delete-category/category`,
  tags,
  summary: "Delete Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ slug: z.string() }) },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const createSubCategoryRoute = createRoute({
  method: "post",
  path: `/category/create-subcategory`,
  tags,
  summary: "Create Sub Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": { schema: subCategorySchema },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const deleteSubCategoryRoute = createRoute({
  method: "delete",
  path: `/category/delete-subcategory`,
  tags,
  summary: "Delete Sub Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": { schema: z.object({ slug: z.string() }) },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const updateSubCategoryRoute = createRoute({
  method: "patch",
  path: `/category/update-subcategory`,
  tags,
  summary: "Update Sub Category",
  middleware: adminMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.string(),
            name: z.string().min(1).max(50),
            slug: z
              .string()
              .min(1)
              .max(80)
              .regex(slugRegex, "Invalid slug format"),
            categorySlug: z
              .string()
              .min(1)
              .max(80)
              .regex(slugRegex, "Invalid slug format"),
          }),
        },
      },
    },
  },
  responses: {
    201: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});
