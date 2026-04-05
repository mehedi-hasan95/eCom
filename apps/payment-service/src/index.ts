// index.ts
import { Hono } from "hono";
import stripe from "./stripe/stripe-index";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { consumer, producer } from "./utils/kafka";
import { runKafkaSubscriptions } from "./utils/subscriptions";

const app = new Hono();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const routes = app.route("/stripe", stripe);

/**
 * ============================================================
 * 📌 If i didn't use kafka
 * ============================================================
 */
serve(
  {
    fetch: app.fetch,
    port: 7001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

// /**
//  * ============================================================
//  * 📌 Used Kafka
//  * ============================================================
//  */
// const start = async () => {
//   try {
//     await Promise.all([producer.connect(), consumer.connect()]);
//     await runKafkaSubscriptions();
//     serve(
//       {
//         fetch: app.fetch,
//         port: 7001,
//       },
//       (info) => {
//         console.log(`Server is running on http://localhost:${info.port}`);
//       },
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// start();
export default app;
export type AppType = typeof routes;
