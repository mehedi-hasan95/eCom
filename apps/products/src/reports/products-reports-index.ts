import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "@workspace/open-api/lib/open-api-configuration";
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
import {
  adminMonthlyReportHandler,
  createMonthlyReportHandler,
  getAdminRecentOrderHandler,
  getAdminReportHandler,
  getRecentOrderHandler,
  getReportHandler,
  getSingleOrderForadminHandler,
  getSingleOrderForSellerHandler,
  updateSingleOrderForSellerHandler,
} from "./products-reports-handler";

const app = new OpenAPIHono({
  defaultHook: defaultHook,
});

app
  .openapi(createMonthlyReportRoute, createMonthlyReportHandler)
  .openapi(getReportRoute, getReportHandler)
  .openapi(getRecentOrderRoute, getRecentOrderHandler)
  .openapi(getSingleOrderForSellerRoute, getSingleOrderForSellerHandler)
  .openapi(updateSingleOrderForSellerRoute, updateSingleOrderForSellerHandler)
  .openapi(adminMonthlyReportRoute, adminMonthlyReportHandler)
  .openapi(getAdminReportRoute, getAdminReportHandler)
  .openapi(getAdminRecentOrderRoute, getAdminRecentOrderHandler)
  .openapi(getSingleOrderForadminRoute, getSingleOrderForadminHandler);

export default app;
