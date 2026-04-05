"use client";

import { InputController } from "@/components/common/form/input-controller";
import { LoadingButton } from "@/components/common/loading-button";
import { createBoostingCoinAction } from "@/lib/actions/admin/admin-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoostingCoin } from "@workspace/db";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Field, FieldGroup } from "@workspace/ui/components/field";
import { BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  coin: z.coerce.number().int().positive(),
});
export const BoostingPriceForm = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coin: "",
    },
  });

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createBoostingCoinAction,
    // When mutate is called:
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["boosting-coin"] });
      const previousTodos = queryClient.getQueryData(["boosting-coin"]);
      queryClient.setQueryData(["boosting-coin"], (old = []) => [
        ...(old as BoostingCoin[]),
        newTodo,
      ]);
      setOpen(false);
      form.reset();
      router.push("/dashboard/admin/boosting-price");
      return { previousTodos };
    },
    onError: (err, newTodo, onMutateResult) => {
      queryClient.setQueryData(
        ["boosting-coin"],
        onMutateResult?.previousTodos,
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["boosting-coin"] }),
  });
  async function onSubmit(data: z.input<typeof formSchema>) {
    createMutation.mutate({ coin: data.coin as number });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border-dashed border-muted-foreground bg-transparent cursor-pointer flex items-center">
          <CardContent className="flex justify-center items-center py-10 px-16 gap-2 w-full">
            <BadgePlus /> Add Price
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>
              <DialogTitle>Add Boosting Price</DialogTitle>
            </CardTitle>
            <CardDescription>
              How many coin get for boosting for a doller
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="boosting-price-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <InputController
                  control={form.control}
                  name="coin"
                  title="Add Coin"
                  placeholder="e.g. 5"
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              {createMutation.isPending ? (
                <LoadingButton />
              ) : (
                <Button type="submit" form="boosting-price-form">
                  Submit
                </Button>
              )}
            </Field>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
