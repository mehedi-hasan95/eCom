import {
  getCategoriesAction,
  getSubCategoriesAction,
} from "@/lib/actions/category/category-action";
import getQueryClient from "@/lib/query-client";

interface Props {
  children: React.ReactNode;
}
const Page = async ({ children }: Props) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });
  await queryClient.prefetchQuery({
    queryKey: ["subCategories"],
    queryFn: getSubCategoriesAction,
  });
  return <>{children}</>;
};

export default Page;
