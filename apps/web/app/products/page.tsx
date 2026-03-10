import { Suspense } from "react";
import { AllProductPage } from "./_components/all-product-page";

const Page = async () => {
  return (
    <Suspense>
      <AllProductPage />
    </Suspense>
  );
};

export default Page;
