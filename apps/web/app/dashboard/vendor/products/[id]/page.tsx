import { getSingleProductAction } from "@/lib/actions/product-action";
import { CreateProductForm } from "./_components/create-product-form";
import getQueryClient from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{ id: string }>;
}
const Page = async ({ params }: Props) => {
  const { id } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["products", id],
    queryFn: () => getSingleProductAction(id),
  });

  // const data = await getSingleProductAction(id);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateProductForm id={id} />
    </HydrationBoundary>
  );
};

export default Page;
