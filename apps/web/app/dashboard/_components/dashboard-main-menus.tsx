"use client";
import { useGetSession } from "@/hooks/use-auth";
import { SidebarGroup } from "@workspace/ui/components/sidebar";
import {
  BaggageClaim,
  Guitar,
  IdCard,
  Landmark,
  LayoutDashboard,
  List,
  PackagePlus,
  ShoppingBasket,
  UserCog,
} from "lucide-react";
import { DashboardSidebarMenus } from "./dashboard-sidebar-menus";

const generalMenus = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", url: "/dashboard/profile", icon: IdCard },
  { name: "Stripe", url: "/dashboard/stripe", icon: Landmark },
];

const vendorMenus = [
  { name: "Vendor", url: "/dashboard/vendor", icon: ShoppingBasket },
  {
    name: "Create Product",
    url: "/dashboard/vendor/create-product",
    icon: PackagePlus,
  },
  { name: "Orders", url: "/dashboard/vendor/orders", icon: BaggageClaim },
];

const adminMenus = [
  { name: "ADMIN", url: "/dashboard/admin", icon: UserCog },
  { name: "Category", url: "/dashboard/admin/categories", icon: Guitar },
  { name: "Sub Category", url: "/dashboard/admin/sub-categories", icon: List },
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
          <DashboardSidebarMenus menus={adminMenus} sidebarLabel="Vendors" />
        )}
      </SidebarGroup>
    </>
  );
};
