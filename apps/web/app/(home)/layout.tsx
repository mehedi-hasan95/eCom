import { Footer } from "./_components/footer";
import { NavHeader } from "./_components/nav-header";
import { NavSeconderyMenu } from "./_components/nav-secondery-menu";

interface Props {
  children: React.ReactNode;
}
const Page = async ({ children }: Props) => {
  return (
    <div className="flex flex-col justify-between min-h-screen relative">
      <div className="sticky top-0 container-default bg-white dark:bg-black">
        <NavHeader />
      </div>
      <nav className="bg-card border-b border-border">
        <div className="container-default">
          <NavSeconderyMenu />
        </div>
      </nav>
      <div className="flex-1 py-3">{children}</div>
      <Footer />
    </div>
  );
};

export default Page;
