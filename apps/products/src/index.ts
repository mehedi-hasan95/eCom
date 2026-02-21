import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  defaultHook,
  openAPIConfiguration,
} from "@workspace/open-api/lib/open-api-configuration";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import products from "./products/products-index";
import admin from "./admin/admin-index";
import categories from "./categories/categories-index";
import wishlist from "./wishlist/wishlist-index";

const app = new OpenAPIHono({
  defaultHook,
}).basePath("/api/v1");
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// RPC
const routes = app
  .route("/products", products)
  .route("/admin", admin)
  .route("/categories", categories)
  .route("/wishlist", wishlist);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  console.error("Unhandled error:", err);

  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500,
  );
});
serve(
  {
    fetch: app.fetch,
    port: 6002,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(
      `You can get the documentation at http://localhost:${info.port}/api/v1/scalar`,
    );
  },
);
openAPIConfiguration(app);
export default app;
export type AppType = typeof routes;
