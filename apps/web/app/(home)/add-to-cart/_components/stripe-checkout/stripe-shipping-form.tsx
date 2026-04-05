"use client";
import { InputController } from "@/components/common/form/input-controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingFormSchema } from "@workspace/open-api/schemas/product.schemas";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Field, FieldGroup } from "@workspace/ui/components/field";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  onSubmitData: (data: z.infer<typeof shippingFormSchema>) => void;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
};
export const StripeShippingForm = ({ onSubmitData, setStep }: Props) => {
  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      city: "",
      line1: "",
      phone: "",
      postal_code: "",
      state: "",
      country: "US",
    },
  });

  function onSubmit(data: z.infer<typeof shippingFormSchema>) {
    onSubmitData(data);
    setStep(2);
  }
  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <CardTitle>Almost there! Where do we send it?</CardTitle>
        <CardDescription>
          Add your delivery address so we can get your order to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid lg:grid-cols-2 gap-5">
              <InputController
                control={form.control}
                name="line1"
                title="Shipping Address"
                placeholder="e.g. 123, Buruli"
              />
              <InputController
                control={form.control}
                name="phone"
                title="Phone Number"
                placeholder="e.g. +0123456789"
              />
              <InputController
                control={form.control}
                name="city"
                title="City"
                placeholder="e.g. Jessore"
              />
              <InputController
                control={form.control}
                name="postal_code"
                title="Postal Code (optional)"
                placeholder="e.g. 7450"
                inputTypes="number"
              />
              <InputController
                control={form.control}
                name="state"
                title="State (optional)"
                placeholder="e.g. Khulna"
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
