import { AdminDashboardPage } from "./admin-dashboard/admin-dashboard-page";
import { SellerDashboardPage } from "./seller/seller-dashboard";
import { sessionAction } from "@/lib/actions/auth-server-action";

export const DashboardPage = async () => {
  const user = await sessionAction();
  return (
    <>
      {user?.user.role === "SELLER" ? (
        <SellerDashboardPage />
      ) : user?.user.role === "ADMIN" ? (
        <AdminDashboardPage />
      ) : (
        <>Seller</>
      )}
    </>
  );
};
