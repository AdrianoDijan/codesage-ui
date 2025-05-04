import { Outlet } from "react-router";
import { AppSidebar, SidebarData } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useGetUserInfo } from "@/api/endpoints/users/users.gen";
import { HomeIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/mode-toggle";

const useUserSidebarData = (): SidebarData => {
  const { data } = useGetUserInfo("me");

  const userName = data?.data.first_name
    ? `${String(data.data.first_name)} ${String(data.data.last_name ?? "")}`
    : data?.data.username ?? "";

  const userEmail = data?.data.email ?? "";

  return {
    user: {
      name: userName,
      email: userEmail,
      avatar: "",
    },
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: HomeIcon,
        isActive: false,
      },
    ],
    projects: [],
  };
};

function MainLayout() {
  const sidebarData = useUserSidebarData();

  return (
    <SidebarProvider>
      <AppSidebar sidebarData={sidebarData} />
      <main className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        <Outlet />
      </main>
      <Toaster />
    </SidebarProvider>
  );
}

export default MainLayout;
