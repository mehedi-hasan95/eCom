import getQueryClient from "@/lib/query-client";
import { getSingleProductAction } from "@/lib/actions/product-action";
import { Metadata, ResolvingMetadata } from "next";
import { SingleProductPage } from "./_components/single-product-page";
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
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SingleProductPage id={id} />
    </HydrationBoundary>
  );
};

export default Page;

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { id } = await params;

  // fetch data
  const product = await getSingleProductAction(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.product.title,
    description: product.product.shortDescription,
    authors: [{ name: product.product.user.name }],
    icons: {
      icon: product.product.images[0],
    },
    openGraph: {
      images: [{ url: product.product.images[0] as string }, ...previousImages],
      title: product.product.title,
      actors: product.product.user.name,
    },
  };
}
