import {
  getCategoriesAction,
  getSubCategoriesAction,
} from "@/lib/actions/category/category-action";
import getQueryClient from "@/lib/query-client";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}
const Page = async ({ children }: Props) => {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategoriesAction,
      staleTime: 5000 * 60,
    }),
    queryClient.prefetchQuery({
      queryKey: ["subCategories"],
      queryFn: () => getSubCategoriesAction,
      staleTime: 5000 * 60,
    }),
  ]);
  return <Suspense>{children}</Suspense>;
};

export default Page;
