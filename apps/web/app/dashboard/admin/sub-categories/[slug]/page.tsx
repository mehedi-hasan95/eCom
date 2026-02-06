import { getSubCategoryAction } from "@/lib/actions/category/category-action";
import { SubCategoryForm } from "../_components/sub-category-form";

interface Props {
  params: Promise<{ slug: string }>;
}
const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const data = await getSubCategoryAction(slug);
  return <SubCategoryForm initialData={data.subcategory} />;
};

export default Page;
