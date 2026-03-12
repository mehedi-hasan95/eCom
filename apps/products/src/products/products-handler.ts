import { RouteHandler } from "@hono/zod-openapi";
import {
  createProductRoute,
  deleteProductRoute,
  getAllProductsRoute,
  getProductsRoute,
  getSingleProductRoute,
  updateProductRoute,
} from "./products-route";
import { utapi } from "@workspace/uploadthing";
import { Prisma, prisma } from "@workspace/db";
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
  const { cats, maxPrice, minPrice, sort, sellerEmail, search } =
    c.req.valid("query");
  const getCats = cats ? cats.split(",").filter(Boolean) : [];

  let orderClause = Prisma.sql`ORDER BY boost_score DESC, p."createdAt" DESC`;

  if (sort === "new") {
    orderClause = Prisma.sql`ORDER BY p."createdAt" ASC`;
  } else if (sort === "old") {
    orderClause = Prisma.sql`ORDER BY p."createdAt" DESC`;
  } else if (sort === "ascByName") {
    orderClause = Prisma.sql`ORDER BY p."title" ASC`;
  } else if (sort === "dscByName") {
    orderClause = Prisma.sql`ORDER BY p."title" DESC`;
  } else if (sort === "ascByPrice") {
    orderClause = Prisma.sql`ORDER BY p."salePrice" ASC`;
  } else if (sort === "dscByPrice") {
    orderClause = Prisma.sql`ORDER BY p."salePrice" DESC`;
  } else if (sort === "trending") {
    orderClause = Prisma.sql`ORDER BY boost_score DESC, p."createdAt" DESC`;
  } else if (sort === "popular") {
    orderClause = Prisma.sql`ORDER BY pa."productSale" DESC`;
  }

  // ✅ seller filter
  const sellerFilter = sellerEmail
    ? Prisma.sql`AND p."userEmail" = ${sellerEmail}`
    : Prisma.empty;
  // ✅ Category filter
  const catsFilter =
    getCats.length > 0
      ? Prisma.sql`AND p."categorySlug" IN (${Prisma.join(getCats)})`
      : Prisma.empty;

  //  ✅ Search filter
  const searchFilter = search
    ? Prisma.sql`AND p."title" ILIKE ${"%" + search + "%"} OR p."shortDescription" ILIKE ${"%" + search + "%"}`
    : Prisma.empty;

  const [products, priceRange] = await Promise.all([
    prisma.$queryRaw`
    SELECT 
      p.*,
      json_build_object( 'email', u."email", 'image', u."image", 'name', u."name", 'stripeCustomerId', u."stripeCustomerId", 'id', u."id" ) AS "seller",

      CASE 
        WHEN b."endAt" > NOW()
        THEN b."coinSpent" / EXTRACT(EPOCH FROM (b."endAt" - NOW()))
        ELSE 0
      END AS boost_score
      
    FROM "Products" p

    LEFT JOIN "user" u ON u."email" = p."userEmail"
    LEFT JOIN "Boosting" b ON b."productId" = p."id"
    LEFT JOIN "ProductAnalysis" pa ON pa."productId" = p."id"
    WHERE 
      
      p."status" = 'active'
      AND p."salePrice" >= ${minPrice ?? 0}
      AND p."salePrice" <= ${maxPrice ?? 9999999999}
      ${searchFilter}
      ${sellerFilter}
      ${catsFilter}
      ${orderClause}
  `,

    prisma.products.aggregate({
      where: { status: { equals: "active" } },
      _min: { salePrice: true },
      _max: { salePrice: true },
    }),
  ]);

  return c.json({
    products,
    lowPrice: priceRange._min.salePrice,
    highPrice: priceRange._max.salePrice,
  });
};
