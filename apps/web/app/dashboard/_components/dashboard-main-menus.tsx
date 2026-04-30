"use client";
import { useGetSession } from "@/hooks/use-auth";
import { SidebarGroup } from "@workspace/ui/components/sidebar";
import {
  BaggageClaim,
  BaggageClaimIcon,
  BellRing,
  Guitar,
  IdCard,
  Landmark,
  LayoutDashboard,
  LineChart,
  List,
  PackagePlus,
  Users,
} from "lucide-react";
import { DashboardSidebarMenus } from "./dashboard-sidebar-menus";

const generalMenus = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", url: "/dashboard/profile", icon: IdCard },
  { name: "Stripe", url: "/dashboard/stripe", icon: Landmark },
];

const vendorMenus = [
  {
    name: "Products",
    url: "/dashboard/vendor/products",
    icon: PackagePlus,
  },
  { name: "Orders", url: "/dashboard/vendor/orders", icon: BaggageClaim },
  {
    name: "Notification",
    url: "/dashboard/vendor/notification",
    icon: BellRing,
  },
];

const adminMenus = [
  { name: "Users", url: "/dashboard/admin/users", icon: Users },
  { name: "Orders", url: "/dashboard/admin/orders", icon: BaggageClaimIcon },
  { name: "Category", url: "/dashboard/admin/categories", icon: Guitar },
  { name: "Sub Category", url: "/dashboard/admin/sub-categories", icon: List },
  {
    name: "Boosting Price",
    url: "/dashboard/admin/boosting-price",
    icon: LineChart,
  },
];
export const DashboardMainMenus = () => {
  const { user } = useGetSession();
  return (
    <>
      <SidebarGroup>
        <DashboardSidebarMenus menus={generalMenus} sidebarLabel="General" />
      </SidebarGroup>
      <SidebarGroup>
        {(user?.role === "SELLER" || user?.role === "ADMIN") && (
          <DashboardSidebarMenus menus={vendorMenus} sidebarLabel="Vendors" />
        )}
      </SidebarGroup>
      <SidebarGroup>
        {user?.role === "ADMIN" && (
          <DashboardSidebarMenus menus={adminMenus} sidebarLabel="Admin" />
        )}
      </SidebarGroup>
    </>
  );
};
