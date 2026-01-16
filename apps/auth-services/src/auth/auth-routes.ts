import { createRoute } from "@hono/zod-openapi";
import { registrationSchema } from "@workspace/open-api/schemas/auth.schemas";

const tags = ["Authentication"];
export const registrationRoute = createRoute({
  method: "post",
  path: "/registration",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: registrationSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: registrationSchema,
        },
      },
      description: "Register your account",
    },
    500: {
      description: "Something went wrong",
    },
  },
});
