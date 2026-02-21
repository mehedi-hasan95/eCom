import { RouteHandler } from "@hono/zod-openapi";
import {
  createProductRoute,
  deleteProductRoute,
  getProductsRoute,
  getSingleProductRoute,
  updateProductRoute,
} from "./products-route";
import { utapi } from "@workspace/uploadthing";
import { Prisma, prisma } from "@workspace/db";

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
  const data = await prisma.products.findUnique({
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
    },
  });

  return c.json({ product: data }, 200);
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
  console.log(id, sellerEmail);
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
