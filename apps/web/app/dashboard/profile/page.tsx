import { getUserDetailsAction } from "@/lib/actions/auth-server-action";
import { ProfilePage } from "./_components/profile-page";
import getQueryClient from "@/lib/query-client";

const Page = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user-details"],
    queryFn: getUserDetailsAction,
    retry: 1,
  });
  return <ProfilePage />;
};

export default Page;
