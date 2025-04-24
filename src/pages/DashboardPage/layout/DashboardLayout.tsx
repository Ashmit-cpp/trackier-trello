import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import AppHeader from "@/components/ui/header";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex grow h-screen">
        <AppSidebar />
        <main className="grow">
          <AppHeader />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
