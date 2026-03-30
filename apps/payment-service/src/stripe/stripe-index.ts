import { auth } from "@workspace/auth/server";
import { Hono } from "hono";
import { stripeClient } from "../utils/stripe-client";
import Stripe from "stripe";
import { authMiddleware } from "../middleware";
import { prisma } from "@workspace/db";
import { producer } from "../utils/kafka";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
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
          metadata: {
            id: item.productId,
            color: item.color,
            size: item.size,
            usedCupon: item.usedCupon,
          },
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
      return_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
    });

    return c.json({ clientSecret: session.client_secret });
  })
  .get("/:session_id", async (c) => {
    const { session_id } = c.req.param();
    const session = await stripeClient.checkout.sessions.retrieve(
      session_id as string,
      {
        expand: ["line_items"],
      },
    );

    return c.json({
      status: session.status,
      paymentStatus: session.payment_status,
      products: session.line_items,
    });
  })
  .post("/webhooks", async (c) => {
    const body = await c.req.text();
    const sig = c.req.header("stripe-signature");
    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(body, sig!, endpointSecret!);
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`);
      return c.json({ err: "Webhook signature verification failed." }, 400);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        // console.log(session);
        const lineItems = await stripeClient.checkout.sessions.listLineItems(
          session.id,
          { expand: ["data.price.product"] },
        );
        const orderItems = lineItems.data.map((item) => ({
          productId: (item.price?.product as Stripe.Product)?.metadata?.id,
          color: (item.price?.product as Stripe.Product)?.metadata?.color,
          size: (item.price?.product as Stripe.Product)?.metadata?.size,
          usedCupon:
            (item.price?.product as Stripe.Product)?.metadata?.usedCupon ===
            "true"
              ? true
              : false,
          quantity: item.quantity,
          price: item.price?.unit_amount,
        }));

        const shipping_address =
          session.collected_information?.shipping_details?.address;

        /**
         * ============================================================
         * 📌 Used kafka
         * ============================================================
         */

        await producer.send("stripe.payment", {
          value: JSON.stringify({
            orderItems,
            totalPrice: session.amount_total,
            email: session.customer_details?.email,
            isPaid: session.payment_status === "paid" ? true : false,
            payment_intent: session.payment_intent,
            shipping: {
              line1: shipping_address?.line1,
              postal_code: shipping_address?.postal_code,
              city: shipping_address?.city,
              state: shipping_address?.state,
              phone: shipping_address?.line2,
              country: session.customer_details?.address?.country,
            },
          }),
        });
        break;

      default:
        break;
    }

    return c.json({ recived: true });
  });

export default app;
