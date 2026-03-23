import { auth } from "@workspace/auth/server";
import { Hono } from "hono";
import { stripeClient } from "../utils/stripe-client";
import Stripe from "stripe";
import { authMiddleware } from "../middleware";

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
    const session = await stripeClient.checkout.sessions.create({
      ui_mode: "custom",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 2000,
            product_data: { name: "Test Data" },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
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
