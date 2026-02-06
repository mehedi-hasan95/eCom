import { RouteHandler } from "@hono/zod-openapi";
import {
  getCategoriesRoute,
  getCategoryRoute,
  getSubCategoriesRoute,
  getSubCategoryRoute,
} from "./categories-route";
import { prisma } from "@workspace/db";

export const getCategoriesHandler: RouteHandler<
  typeof getCategoriesRoute
> = async (c) => {
  const categories = await prisma.category.findMany();
  return c.json({ categories }, 200);
};

export const getCategoryHandler: RouteHandler<typeof getCategoryRoute> = async (
  c,
) => {
  const { category } = c.req.valid("query");
  const inCategory = await prisma.category.findUnique({
    where: { slug: category },
  });

  return c.json({ success: true, category: inCategory }, 200);
};

// Sub Categoryies

export const getSubCategoriesHandler: RouteHandler<
  typeof getSubCategoriesRoute
> = async (c) => {
  const subCategories = await prisma.subCategories.findMany();
  return c.json({ subCategories }, 200);
};

export const getSubCategoryHandler: RouteHandler<
  typeof getSubCategoryRoute
> = async (c) => {
  const { slug } = c.req.valid("query");
  const subCategory = await prisma.subCategories.findUnique({
    where: { slug },
  });
  return c.json({ subCategory }, 200);
};
