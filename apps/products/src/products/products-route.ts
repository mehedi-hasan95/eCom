import { createRoute, z } from "@hono/zod-openapi";
import { authMiddleware } from "../middleware";

const tags = ["Products"];
export const createProductRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  middleware: authMiddleware,
  responses: {
    201: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const uploadImageRoute = createRoute({
  method: "post",
  path: "/upload",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            title: z.string().min(1),
            images: z.array(
              z.any().openapi({
                type: "string",
                format: "binary",
              }),
            ),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
      description: "Product created successfully",
    },
    500: { description: "Not ok" },
  },
});
