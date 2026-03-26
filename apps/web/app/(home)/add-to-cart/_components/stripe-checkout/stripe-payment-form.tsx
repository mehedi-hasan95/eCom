"use client";

import { Appearance, loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { useMemo } from "react";
import { StripeCheckoutForm } from "./stripe-checkout-form";
import { useTheme } from "next-themes";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
);

interface Props {
  data: string[] | undefined;
}
export const StripePaymentForm = ({ data }: Props) => {
  const { theme } = useTheme();

  const clientSecret = useMemo(() => {
    return fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_URL}/stripe/create-checkout-session`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      },
    )
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [data]);

  const appearance: Appearance = useMemo(() => {
    return {
      theme: theme === "dark" ? "night" : "stripe",
    };
  }, [theme]);

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret, elementsOptions: { appearance } }}
    >
      <StripeCheckoutForm />
    </CheckoutProvider>
  );
};
