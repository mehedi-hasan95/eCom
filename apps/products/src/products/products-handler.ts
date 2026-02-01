import { RouteHandler } from "@hono/zod-openapi";
import { createProductRoute, uploadImageRoute } from "./products-route";
import { utapi } from "@workspace/uploadthing";

export const createProductHandler: RouteHandler<
  typeof createProductRoute
> = async (c) => {
  //   const session = await auth.api.getSession({ headers: c.req.raw.headers });
  //   console.log(session);
  //   if (!session?.user) {
  //     return c.json({ message: "Not" });
  //   }
  return c.json({ message: "OK" });
};

export const uploadImageHandler: RouteHandler<typeof uploadImageRoute> = async (
  c,
) => {
  const formData = await c.req.formData();

  const title = formData.get("title");
  const images = formData.getAll("images") as File[];

  const uploadedImages = await utapi.uploadFiles(images);

  const imageUrls = uploadedImages.map((img) => ({
    url: img.data?.ufsUrl,
    key: img.data?.key,
  }));

  console.log(imageUrls);

  console.log("title:", title);
  console.log("images:", images);
  return c.json({ message: "OK" });
};
