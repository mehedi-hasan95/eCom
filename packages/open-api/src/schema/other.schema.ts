import z from "zod";

export const shortUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().optional(),
  stripeCustomerId: z.string(),
});
