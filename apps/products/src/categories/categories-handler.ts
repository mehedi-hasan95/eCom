import { RouteHandler } from "@hono/zod-openapi";
import { getCategoriesRoute, getCategoryRoute } from "./categories-route";
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
  const { category } = c.req.valid("param");
  const inCategory = await prisma.category.findUnique({
    where: { slug: category },
  });

  return c.json({ success: true, category: inCategory }, 200);
};
