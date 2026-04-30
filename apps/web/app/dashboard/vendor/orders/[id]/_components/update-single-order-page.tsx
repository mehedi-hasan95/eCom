"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { updateSellerSingleOrderAction } from "@/lib/actions/product-action";
import { OrderStatus } from "@/lib/@types/db-types";
import { OrderItems } from "@workspace/db";

interface Props {
  id: string;
  currentStatus: OrderStatus;
}

export const UpdateSingleOrderPage = ({ id, currentStatus }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStatus: OrderStatus) =>
      updateSellerSingleOrderAction({
        id,
        status: newStatus,
      }),

    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({
        queryKey: ["seller-single-order", id],
      });

      const previousOrder = queryClient.getQueryData([
        "seller-single-order",
        id,
      ]);

      queryClient.setQueryData(
        ["seller-single-order", id],
        (old: OrderItems) => {
          if (!old) return old;
          return {
            ...old,
            status: newStatus,
          };
        },
      );

      return { previousOrder };
    },

    onError: (err, newStatus, context) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(
          ["seller-single-order", id],
          context.previousOrder,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["seller-single-order", id],
      });
    },
  });

  const handleChange = (value: OrderStatus) => {
    mutation.mutate(value);
  };

  return (
    <Card>
      <CardContent className="space-y-4 flex justify-between items-center">
        <h4 className="text-md font-medium">Update product status:</h4>

        <Select
          value={currentStatus}
          onValueChange={handleChange}
          disabled={mutation.isPending || !currentStatus}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            {Object.values(OrderStatus).map((item) => (
              <SelectItem key={item} value={item}>
                <span className="normal-case">{item}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
