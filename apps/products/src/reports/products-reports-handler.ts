import { RouteHandler } from "@hono/zod-openapi";
import {
  adminMonthlyReportRoute,
  createMonthlyReportRoute,
  getAdminRecentOrderRoute,
  getAdminReportRoute,
  getRecentOrderRoute,
  getReportRoute,
  getSingleOrderForadminRoute,
  getSingleOrderForSellerRoute,
  updateSingleOrderForSellerRoute,
} from "./products-reports-route";
import { prisma } from "@workspace/db";
import { DEFAULT_LIMIT } from "@workspace/open-api/lib/constants";

export const createMonthlyReportHandler: RouteHandler<
  typeof createMonthlyReportRoute
> = async (c) => {
  const userEmail = c.get("user")?.email;
  try {
    const result = await prisma.$queryRaw`
    SELECT 
        DATE_TRUNC('month', o."createdAt") AS month,
        SUM(oi."quantity")::int AS total_quantity,
        SUM(oi."quantity" * oi."price")::float AS total_sales
    FROM "OrderItems" oi
    JOIN "Order" o ON o."id" = oi."orderId"
    JOIN "Products" p ON p."id" = oi."productId"
    WHERE p."userEmail" = ${userEmail}
        AND o."isPaid" = true
        AND o."createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC;
    `;
    return c.json({ data: result });
  } catch (error) {
    return c.json({ message: "Something went wrong" });
  }
};

export const getReportHandler: RouteHandler<typeof getReportRoute> = async (
  c,
) => {
  const userEmail = c.get("user")?.email;
  try {
    const data = await prisma.$queryRaw`
    SELECT DATE(o."createdAt") AS date,
          SUM(oi."quantity")::int AS total_quantity,
          SUM(oi."quantity" * oi."price")::float AS total_sales
    FROM "OrderItems" oi
    JOIN "Order" o ON o."id" = oi."orderId"
    JOIN "Products" p ON p."id" = oi."productId"
    WHERE p."userEmail" = ${userEmail}
          AND o."isPaid" = true
    GROUP BY DATE(o."createdAt")
    ORDER BY DATE(o."createdAt") ASC;
  `;
    return c.json({ data });
  } catch (error) {
    return c.json({ message: "Something went wrong" });
  }
};

export const getRecentOrderHandler: RouteHandler<
  typeof getRecentOrderRoute
> = async (c) => {
  const email = c.get("user")?.email;
  const { limit = DEFAULT_LIMIT, page = 1 } = c.req.valid("query");
  const skip = (page - 1) * limit;
  const [orders, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      skip: skip,
      take: limit,

      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          where: { product: { userEmail: email } },
          include: { product: { select: { title: true, images: true } } },
        },
        user: { select: { name: true } },
      },
    }),
    prisma.order.count(),
  ]);

  return c.json({
    data: orders,
    meta: {
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
    },
  });
};

export const getSingleOrderForSellerHandler: RouteHandler<
  typeof getSingleOrderForSellerRoute
> = async (c) => {
  const { id } = c.req.valid("query");
  const email = c.get("user")?.email;
  try {
    const data = await prisma.orderItems.findUnique({
      where: { id, product: { userEmail: email } },
      include: {
        order: true,
        product: { select: { title: true, images: true } },
      },
    });
    return c.json({ data }, 200);
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500);
  }
};

export const updateSingleOrderForSellerHandler: RouteHandler<
  typeof updateSingleOrderForSellerRoute
> = async (c) => {
  try {
    const { id, status } = c.req.valid("json");
    const email = c.get("user")?.email;
    const data = await prisma.orderItems.update({
      where: { id, product: { userEmail: email } },
      data: { status },
    });
    return c.json({ data });
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500);
  }
};

export const adminMonthlyReportHandler: RouteHandler<
  typeof adminMonthlyReportRoute
> = async (c) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT 
        DATE_TRUNC('month', o."createdAt") AS month,
        SUM(oi."quantity")::int AS total_quantity,
        SUM(oi."quantity" * oi."price")::float AS total_sales
    FROM "OrderItems" oi
    JOIN "Order" o ON o."id" = oi."orderId"
    JOIN "Products" p ON p."id" = oi."productId"
    WHERE o."isPaid" = true
        AND o."createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC;
    `;
    return c.json({ data: result });
  } catch (error) {
    return c.json({ message: "Something went wrong" });
  }
};

export const getAdminReportHandler: RouteHandler<
  typeof getAdminReportRoute
> = async (c) => {
  try {
    const data = await prisma.$queryRaw`
    SELECT DATE(o."createdAt") AS date,
          SUM(oi."quantity")::int AS total_quantity,
          SUM(oi."quantity" * oi."price")::float AS total_sales
    FROM "OrderItems" oi
    JOIN "Order" o ON o."id" = oi."orderId"
    JOIN "Products" p ON p."id" = oi."productId"
    WHERE o."isPaid" = true
    GROUP BY DATE(o."createdAt")
    ORDER BY DATE(o."createdAt") ASC;
  `;
    return c.json({ data });
  } catch (error) {
    return c.json({ message: "Something went wrong" });
  }
};

export const getAdminRecentOrderHandler: RouteHandler<
  typeof getAdminRecentOrderRoute
> = async (c) => {
  const { limit = DEFAULT_LIMIT, page = 1 } = c.req.valid("query");
  const skip = (page - 1) * limit;
  const [orders, totalCount] = await prisma.$transaction([
    prisma.order.findMany({
      skip: skip,
      take: limit,

      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: { product: { select: { title: true, images: true } } },
        },
        user: { select: { name: true } },
      },
    }),
    prisma.order.count(),
  ]);

  return c.json({
    data: orders,
    meta: {
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
    },
  });
};

export const getSingleOrderForadminHandler: RouteHandler<
  typeof getSingleOrderForadminRoute
> = async (c) => {
  const { id } = c.req.valid("query");
  try {
    const data = await prisma.orderItems.findUnique({
      where: { id },
      include: {
        order: true,
        product: { select: { title: true, images: true } },
      },
    });
    return c.json({ data }, 200);
  } catch (error) {
    return c.json({ message: "Something went wrong" }, 500);
  }
};
