import { RouteHandler } from "@hono/zod-openapi";
import {
  createCategoryRoute,
  deleteCategoryRoute,
  updateCategoryRoute,
} from "./admin-route";
import { utapi } from "@workspace/uploadthing";
import { prisma } from "@workspace/db";

export const createCategoryHandler: RouteHandler<
  typeof createCategoryRoute
> = async (c) => {
  const { name, slug, image } = await c.req.valid("form");
  const baseSlug = slug;

  const existingSlugs = await prisma.category.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
    select: {
      slug: true,
    },
  });
  let finalSlug = slug;
  if (existingSlugs.length > 0) {
    const counts = existingSlugs
      .map((item) => {
        const parts = item.slug.split("-");
        const lastPart = parseInt(parts[parts.length - 1] || "0");
        return isNaN(lastPart) ? 0 : lastPart;
      })
      .sort((a, b) => a - b);

    const lastNumber = counts[counts.length - 1] || 0;
    finalSlug = `${slug}-${lastNumber + 1}`;
  }

  let imageUrl: string | undefined;

  if (image) {
    const uploadedImages = await utapi.uploadFiles(image);
    imageUrl = uploadedImages.data?.ufsUrl;
  }

  await prisma.category.create({
    data: {
      name,
      slug: finalSlug,
      image: imageUrl,
    },
  });

  return c.json(
    { success: true, message: "Category created successfully" },
    201,
  );
};

export const updateCategoryHandler: RouteHandler<
  typeof updateCategoryRoute
> = async (c) => {
  const { id, name, slug, image, previousImage } = c.req.valid("form");

  const exiztingSlug = await prisma.category.findFirst({
    where: { slug, id: { not: id } },
  });

  if (exiztingSlug) {
    return c.json(
      { message: "This url is use in another category. Please choose new" },
      409,
    );
  }

  let imageUrl: string | undefined = previousImage;

  if (image) {
    // If there's a new image, upload it
    const uploadedImages = await utapi.uploadFiles(image);
    imageUrl = uploadedImages.data?.ufsUrl;
  } else if (!previousImage) {
    // If no new image and no previous image, set imageUrl to undefined
    imageUrl = undefined;
  }

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      image: imageUrl ?? null,
    },
  });

  return c.json({ message: "Category updated" }, 201);
};

export const deleteCategoryHandler: RouteHandler<
  typeof deleteCategoryRoute
> = async (c) => {
  const { slug } = c.req.valid("json");

  try {
    await prisma.category.delete({ where: { slug } });
    return c.json({ message: `Deleted ${slug} successfully` }, 200);
  } catch {
    return c.json({ success: false, message: "Category not found" }, 404);
  }
};
