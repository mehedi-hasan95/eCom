import { createRoute, z } from "@hono/zod-openapi";
import { adminMiddleware, sellerMiddleware } from "../middleware";
import { OrderStatus } from "@workspace/db";

const tags = ["Product Reports"];
export const createMonthlyReportRoute = createRoute({
  method: "get",
  path: "/get-monthly-report",
  tags,
  summary: "Get Monthly report",
  middleware: sellerMiddleware,
  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const getReportRoute = createRoute({
  method: "get",
  path: "/get-report",
  tags,
  summary: "Get Everyday's report",
  middleware: sellerMiddleware,
  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const getRecentOrderRoute = createRoute({
  method: "get",
  path: "/get-resent-order",
  tags,
  summary: "Get resent order",
  middleware: sellerMiddleware,
  request: {
    query: z.object({
      limit: z.coerce.number().optional(),
      page: z.coerce.number(),
    }),
  },
  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const getSingleOrderForSellerRoute = createRoute({
  method: "get",
  path: "/get-seller-single-order",
  tags,
  summary: "Get Seller single order",
  middleware: sellerMiddleware,
  request: {
    query: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const updateSingleOrderForSellerRoute = createRoute({
  method: "post",
  path: "/update-seller-single-order",
  tags,
  summary: "Update Seller single order",
  middleware: sellerMiddleware,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ id: z.string(), status: z.enum(OrderStatus) }),
        },
      },
    },
  },
  responses: {
    201: { description: "Created" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const adminMonthlyReportRoute = createRoute({
  method: "get",
  path: "/get-admin-monthly-report",
  tags,
  summary: "Get Admin's Monthly report",
  middleware: adminMiddleware,
  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const getAdminReportRoute = createRoute({
  method: "get",
  path: "/get-admin-report",
  tags,
  summary: "Get Everyday's report for admin",
  middleware: adminMiddleware,
  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const getAdminRecentOrderRoute = createRoute({
  method: "get",
  path: "/get-admin-resent-order",
  tags,
  summary: "Get resent order view for admin",
  middleware: adminMiddleware,
  request: {
    query: z.object({
      limit: z.coerce.number().optional(),
      page: z.coerce.number(),
    }),
  },
  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});

export const getSingleOrderForadminRoute = createRoute({
  method: "get",
  path: "/get-admin-single-order",
  tags,
  summary: "Get single order for admin view",
  middleware: adminMiddleware,
  request: {
    query: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: "OK" },
    401: { description: "Unauthorize" },
    500: { description: "Internal server error" },
  },
});
