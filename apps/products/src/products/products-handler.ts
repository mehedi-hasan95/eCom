import { RouteHandler } from "@hono/zod-openapi";
import {
  addToCartRoute,
  allAddToCartRoute,
  createProductRoute,
  deleteProductRoute,
  getAllProductsRoute,
  getProductsRoute,
  getSingleProductRoute,
  productPriceRoute,
  removeACartRoute,
  removeAllCartRoute,
  updateProductRoute,
} from "./products-route";
import { utapi } from "@workspace/uploadthing";
import { Prisma, prisma } from "@workspace/db";
import { sortValueType } from "@workspace/open-api/lib/constants";
// import { producer } from "../utils/kafka";

export const createProductHandler: RouteHandler<
  typeof createProductRoute
> = async (c) => {
  const user = c.get("user");
  const data = await c.req.valid("form");
  const uploadedImages = await utapi.uploadFiles(data?.images!);

  const imageLinks = uploadedImages.map((item) => item.data?.ufsUrl);
  await prisma.products.create({
    data: {
      ...data,
      images: imageLinks as string[],
      userEmail: user?.email!,
      productAnalyses: { create: {} },
      boostings: { create: {} },
    },
  });

  return c.json({ message: "Product created successfully" }, 201);
};

export const getProductsHandler: RouteHandler<typeof getProductsRoute> = async (
  c,
) => {
  const { userEmail } = c.req.valid("query");
  const products = await prisma.products.findMany({
    where: { userEmail },
    include: { user: { select: { id: true, image: true, name: true } } },
  });

  return c.json({ products }, 200);
};

export const getSingleProductHandler: RouteHandler<
  typeof getSingleProductRoute
> = async (c) => {
  const { id } = c.req.valid("query");

  const [product, ratingStats] = await Promise.all([
    await prisma.products.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            image: true,
            id: true,
            stripeCustomerId: true,
          },
        },
        productAnalyses: { select: { productSale: true } },
      },
    }),
    prisma.ratings.aggregate({
      where: { productId: id },
      _avg: { ratings: true },
      _count: { _all: true },
    }),
  ]);
  /**
   * ============================================================
   * 📌 Used Kafka
   * ============================================================
   */
  // producer.send("product.activity", {
  //   value: JSON.stringify({ id, action: "view-product" }),
  // });
  return c.json({ product, rating: ratingStats }, 200);
};

/**
 * ============================================================
 * 📌 API: Update product
 * ============================================================
 */

export const updateProductHandler: RouteHandler<
  typeof updateProductRoute
> = async (c) => {
  const data = c.req.valid("form");
  const user = c.get("user");
  if (user?.email !== data.sellerEmail) {
    return c.json({ message: "Unauthorize user" }, 403);
  }
  let imageUrl: string[] | undefined;
  if (data.images !== undefined) {
    const uploadedImages = await utapi.uploadFiles(data.images);

    imageUrl = uploadedImages
      .map((item) => item.data?.ufsUrl)
      .filter((url): url is string => Boolean(url));
  }
  const allImage = [...(imageUrl ?? []), ...(data.previousImage ?? [])];
  try {
    await prisma.products.update({
      where: { id: data.id },
      data: {
        basePrice: data.basePrice,
        cashOnDelevary: data.cashOnDelevary,
        categorySlug: data.categorySlug,
        color: data.color,
        cupon: data.cupon,
        description: data.description,
        salePrice: data.salePrice,
        shortDescription: data.shortDescription,
        sizes: data.sizes,
        specification: data.specification,
        status: data.status,
        stock: data.stock,
        subCategorySlug: data.subCategorySlug,
        tags: data.tags,
        title: data.title,
        type: data.type,
        weight: data.weight,
        images: allImage,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json({ message: "Product ID not found" }, 404);
    } else {
      return c.json({ message: "Something went wrong" }, 500);
    }
  }

  return c.json({ message: "Product update successfully" }, 201);
};

export const deleteProductHandler: RouteHandler<
  typeof deleteProductRoute
> = async (c) => {
  const { id, sellerEmail } = c.req.valid("json");
  const user = c.get("user");
  if (sellerEmail !== user?.email) {
    return c.json({ message: "Unauthorize user" }, 403);
  }
  try {
    await prisma.products.delete({
      where: { id, userEmail: sellerEmail },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return c.json({ message: "Product ID not found" }, 404);
    } else {
      return c.json({ message: "Something went wrong" }, 500);
    }
  }
  return c.json({ message: "Product delete successfully" }, 201);
};

export const getAllProductsHandler: RouteHandler<
  typeof getAllProductsRoute
> = async (c) => {
  const { cats, maxPrice, minPrice, sort, sellerEmail, search, limit, cursor } =
    c.req.valid("query");

  const categories = cats ? cats.split(",").filter(Boolean) : [];

  const sortMap: Record<
    sortValueType,
    Prisma.ProductsOrderByWithRelationInput
  > = {
    ascByPrice: { salePrice: "asc" },
    dscByPrice: { salePrice: "desc" },
    ascByName: { title: "asc" },
    dscByName: { title: "desc" },
    new: { createdAt: "desc" },
    old: { createdAt: "asc" },
    popular: { productAnalyses: { productViews: "desc" } },
    trending: { boostings: { spendingAvg: "desc" } },
  };
  const products = await prisma.products.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          image: true,
          name: true,
          stripeCustomerId: true,
        },
      },
    },
    where: {
      status: "active",

      userEmail: sellerEmail,
      salePrice: { gte: minPrice ?? undefined, lte: maxPrice ?? undefined },
      title: { contains: search, mode: "insensitive" },

      OR: search
        ? [
            {
              title: { contains: search, mode: "insensitive" },
              shortDescription: { contains: search, mode: "insensitive" },
            },
          ]
        : undefined,
      category: categories.length ? { slug: { in: categories } } : undefined,
    },
    orderBy: [sortMap[sort as sortValueType]],
  });

  const hasMore = products.length > limit;
  const items = hasMore ? products.slice(0, -1) : products;
  const nextCursor = hasMore ? items[items.length - 1]?.id : null;

  return c.json({
    products: items,
    nextCursor,
  });
};

export const productPriceHandler: RouteHandler<
  typeof productPriceRoute
> = async (c) => {
  const price = await prisma.products.aggregate({
    _min: { salePrice: true },
    _max: { salePrice: true },
  });
  return c.json({
    minPrice: price._min.salePrice ?? 0,
    maxPrice: price._max.salePrice ?? 100,
  });
};

export const addToCartHandler: RouteHandler<typeof addToCartRoute> = async (
  c,
) => {
  const { productId, quantity, color, size } = c.req.valid("json");
  const user = c.get("user");
  if (!user?.email) {
    return c.json({ message: "Please login first" }, 401);
  }
  try {
    const product = await prisma.addToCart.upsert({
      where: { userEmail_productId: { productId, userEmail: user?.email } },
      update: { color, size, quantity },
      create: { color, productId, quantity, size, userEmail: user.email },
    });
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
  return c.json({ message: "Success" }, 201);
};

export const allAddToCartHandler: RouteHandler<
  typeof allAddToCartRoute
> = async (c) => {
  const user = c.get("user");
  const cart = await prisma.addToCart.findMany({
    where: { userEmail: user?.email },
    orderBy: { updatedAt: "desc" },
    include: {
      product: { select: { title: true, images: true, salePrice: true } },
    },
  });
  /**
   * ============================================================
   * 📌 Used kafka
   * ============================================================
   */
  // producer.send("product.activity", {
  //   value: JSON.stringify({ id, action: "cart" }),
  // });
  return c.json({ cart });
};

export const removeACartHandler: RouteHandler<typeof removeACartRoute> = async (
  c,
) => {
  const { productId } = c.req.valid("json");
  const user = c.get("user");
  try {
    await prisma.addToCart.delete({
      where: {
        userEmail_productId: { userEmail: user?.email as string, productId },
      },
    });
  } catch (error) {
    return c.json({ message: "ProductId not found" });
  }
  return c.json({ message: "Cart delete successfully" }, 201);
};

export const removeAllCartHandler: RouteHandler<
  typeof removeAllCartRoute
> = async (c) => {
  const user = c.get("user");
  try {
    await prisma.addToCart.deleteMany({
      where: {
        userEmail: user?.email,
      },
    });
  } catch (error) {
    return c.json({ message: "Product not found" });
  }
  return c.json({ message: "Cart remove successfully" }, 201);
};
