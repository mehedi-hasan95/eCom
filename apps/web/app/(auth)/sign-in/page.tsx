import { AuthLayout } from "../_components/auth-layout";
import { SignInForm } from "../_components/signin-form";

const Page = async () => {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
};

export default Page;
