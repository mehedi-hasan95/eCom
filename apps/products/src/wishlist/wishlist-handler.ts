import { RouteHandler } from "@hono/zod-openapi";
import {
  createWishlistRoute,
  getWishlistRoute,
  removeWishlistRoute,
} from "./wishlist-route";
import { prisma } from "@workspace/db";

export const createWishlistHandler: RouteHandler<
  typeof createWishlistRoute
> = async (c) => {
  const { id } = c.req.valid("json");
  const user = c.get("user");
  try {
    const data = await prisma.wishList.create({
      data: { productId: id, userEmail: user?.email as string },
    });
  } catch (error) {
    return c.json({ message: "Product not found" }, 404);
  }
  return c.json({ message: "Added to wishlist" }, 201);
};

export const getWishlistHandler: RouteHandler<typeof getWishlistRoute> = async (
  c,
) => {
  const user = c.get("user");
  const wishlist = await prisma.wishList.findMany({
    where: { userEmail: user?.email },
    include: {
      products: {
        omit: { updatedAt: true, createdAt: true },
        include: { user: { select: { name: true, id: true, image: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return c.json({ wishlist }, 200);
};

export const removeWishlistHandler: RouteHandler<
  typeof removeWishlistRoute
> = async (c) => {
  const { id } = c.req.valid("json");
  const user = c.get("user");
  try {
    await prisma.wishList.delete({
      where: {
        productId_userEmail: {
          productId: id,
          userEmail: user?.email as string,
        },
      },
    });
  } catch (error) {
    return c.json({ message: "This item isn't in wishlist" }, 404);
  }
  return c.json({ message: "OK" }, 201);
};
