"use client";

import { Appearance, loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { useMemo, useState } from "react";
import { StripeCheckoutForm } from "./stripe-checkout-form";
import { useTheme } from "next-themes";
import { StripeShippingForm } from "./stripe-shipping-form";
import z from "zod";
import { shippingFormSchema } from "@workspace/open-api/schemas/product.schemas";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
);

interface Props {
  data: string[] | undefined;
}
export const StripePaymentForm = ({ data }: Props) => {
  const { theme } = useTheme();
  const [step, setStep] = useState<1 | 2>(1);
  const [shipping, setShipping] = useState<z.infer<
    typeof shippingFormSchema
  > | null>(null);

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

  const handleShippingSubmit = (data: z.infer<typeof shippingFormSchema>) => {
    setShipping(data);
    setStep(2);
  };
  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret, elementsOptions: { appearance } }}
    >
      {step === 1 ? (
        <StripeShippingForm
          onSubmitData={handleShippingSubmit}
          setStep={setStep}
        />
      ) : (
        <StripeCheckoutForm shipping={shipping!} />
      )}
    </CheckoutProvider>
  );
};
