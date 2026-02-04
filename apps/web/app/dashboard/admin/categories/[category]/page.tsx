import { getCategoryAction } from "@/lib/actions/category/category-action";
import { CreateCategory } from "../_components/create-category";

interface Props {
  params: Promise<{ category: string }>;
}
const Page = async ({ params }: Props) => {
  const { category } = await params;
  const data = await getCategoryAction(category);
  return <CreateCategory initialData={data.category} />;
};

export default Page;
