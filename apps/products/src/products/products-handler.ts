import { RouteHandler } from "@hono/zod-openapi";
import { createProductRoute, uploadImageRoute } from "./products-route";
import { utapi } from "@workspace/uploadthing";

export const createProductHandler: RouteHandler<
  typeof createProductRoute
> = async (c) => {
  return c.json({ message: "OK" });
};

export const uploadImageHandler: RouteHandler<typeof uploadImageRoute> = async (
  c,
) => {
  const { images, title } = await c.req.valid("form");
  const uploadedImages = await utapi.uploadFiles(images);
  const imageUrls = uploadedImages.map((img) => ({
    url: img.data?.ufsUrl,
    key: img.data?.key,
  }));

  return c.json({ message: "OK" });
};
