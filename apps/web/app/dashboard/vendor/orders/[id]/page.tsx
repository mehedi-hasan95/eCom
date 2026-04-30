import { getSellerSingleOrderAction } from "@/lib/actions/product-action";
import getQueryClient from "@/lib/query-client";
import { SellerSingleOrderPage } from "./_components/seller-single-order-page";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{ id: string }>;
}
const Page = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["seller-single-order", id],
    queryFn: () => getSellerSingleOrderAction({ id }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SellerSingleOrderPage id={id} />
    </HydrationBoundary>
  );
};

export default Page;
