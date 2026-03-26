import { auth } from "@workspace/auth/server";
import { Hono } from "hono";
import { stripeClient } from "../utils/stripe-client";
import Stripe from "stripe";
import { authMiddleware } from "../middleware";
import { prisma } from "@workspace/db";

const app = new Hono()
  .post("/connect", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) {
      return c.json({ message: "Unauthorize User" }, 401);
    }
    const createAccount = await stripeClient.accounts.create({
      email: session.user.email,
      type: "express",
    });
    const linksAccount = await stripeClient.accountLinks.create({
      account: createAccount.id,
      type: "account_onboarding",
      refresh_url: "http://localhost:3000",
      return_url: "http://localhost:3000",
    });
    return c.json({ url: linksAccount.url });
  })
  .post("/create-checkout-session", authMiddleware, async (c) => {
    const email = c.get("user")?.email;
    if (!email) {
      return c.json({ message: "Unauthorize user" });
    }
    const ids = await c.req.json();

    const products = await prisma.addToCart.findMany({
      where: { userEmail: email, id: { in: ids } },
      include: {
        product: { select: { salePrice: true, title: true } },
        user: { select: { stripeCustomerId: true } },
      },
    });
    if (!products.length) {
      return c.json({ message: "You've no product in your cart 😭😭😭" });
    }
    const order = await prisma.order.create({
      data: {
        email,
        orderItems: {
          create: products.map((item) => ({
            price: item.product.salePrice,
            productId: item.productId,
            color: item.color,
            quantity: item.quantity,
            size: item.size,
            usedCupon: item.usedCupon,
          })),
        },
      },
    });
    const line_items = products.map((item: any) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(
          item.usedCupon
            ? item.product.salePrice * 100 * 0.9
            : item.product.salePrice * 100,
        ), // convert to cents
        product_data: {
          name: item.product.title,
        },
      },
      quantity: item.quantity,
    }));
    const session = await stripeClient.checkout.sessions.create({
      ui_mode: "custom",
      payment_method_types: ["card"],
      customer_email: email,
      line_items,
      mode: "payment",
      metadata: {
        email,
        order: JSON.stringify(order.id),
      },
      return_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
    });

    return c.json({ clientSecret: session.client_secret });
  })
  .post("/webhooks", async (c) => {
    console.log("hit");
    const body = await c.req.text();
    const sig = c.req.header("stripe-signature");

    let event: Stripe.Event;
    console.log("sig", sig);
    return c.json({ message: "Done the api" });
  });

export default app;
