"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BoostingPriceForm } from "./boosting-price-form";
import {
  activeBoostingCoinAction,
  getAllBoostingCoinAction,
} from "@/lib/actions/admin/admin-action";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";

export const BoostinPricePage = () => {
  const { data } = useQuery({
    queryKey: ["boosting-coin"],
    queryFn: getAllBoostingCoinAction,
    staleTime: 5 * 1000 * 60,
  });

  const queryClient = useQueryClient();
  const activeMutation = useMutation({
    mutationFn: activeBoostingCoinAction,
    onMutate: async (newCoin) => {
      await queryClient.cancelQueries({
        queryKey: ["boosting-coin", newCoin.id],
      });

      const previousCoin = queryClient.getQueryData([
        "boosting-coin",
        newCoin.id,
      ]);

      queryClient.setQueryData(["boosting-coin", newCoin.id], newCoin);

      return { previousCoin, newCoin };
    },
    onError: (err, newCoin, onMutateResult) => {
      queryClient.setQueryData(
        ["boosting-coin", onMutateResult?.newCoin.id],
        onMutateResult?.previousCoin,
      );
    },
    onSettled: (newCoin) => {
      queryClient.invalidateQueries({
        queryKey: ["boosting-coin", newCoin.id],
      });
      toast.success(newCoin.message);
    },
  });

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <BoostingPriceForm />
      {data?.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "border border-muted-foreground bg-transparent cursor-pointer flex items-center",
            item.isActive && "border-orange-500",
          )}
          onClick={() => activeMutation.mutate({ id: item.id })}
        >
          <CardContent className="flex justify-center items-center py-10 px-16 gap-2 w-full text-2xl font-bold">
            {item.coin.toFixed(2)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
