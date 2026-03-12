import { sessionAction } from "@/lib/actions/auth-server-action";
import { getCategoriesAction } from "@/lib/actions/category/category-action";
import { getAllProductsAction } from "@/lib/actions/product-action";
import getQueryClient from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}
const Page = async ({ children }: Props) => {
  const queryClient = getQueryClient();
  const session = await sessionAction();
  await queryClient.prefetchQuery({
    queryKey: ["all-products", session?.user.email],
    queryFn: () => getAllProductsAction(session?.user.email),
    staleTime: 5000 * 60,
  });
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
    staleTime: 5000 * 60,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};

export default Page;
