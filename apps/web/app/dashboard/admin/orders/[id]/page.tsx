import { getAdminSingleOrderAction } from "@/lib/actions/product-action";
import getQueryClient from "@/lib/query-client";
import { AdminSingleOrderPage } from "./_components/admin-single-order-page";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{ id: string }>;
}
const Page = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-single-order", id],
    queryFn: () => getAdminSingleOrderAction({ id }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminSingleOrderPage id={id} />
    </HydrationBoundary>
  );
};

export default Page;
