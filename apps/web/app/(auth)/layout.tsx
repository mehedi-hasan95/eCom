import { Logo } from "@/components/common/logo";

interface Props {
  children: React.ReactNode;
}
const Page = async ({ children }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-5">
      <Logo />
      {children}
    </div>
  );
};

export default Page;
