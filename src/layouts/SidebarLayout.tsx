import { Outlet } from "react-router";
import { AppSidebar, SidebarData } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useGetUserInfo } from "@/api/endpoints/users/users.gen";
import { Toaster } from "sonner";

const useUserSidebarData = (): SidebarData => {
  const { data } = useGetUserInfo("me");

  const userName = data?.data?.first_name
    ? `${data?.data?.first_name} ${data?.data?.last_name}`
    : data?.data?.username || "";

  const userEmail = data?.data?.email || "";

  return {
    user: {
      name: userName,
      email: userEmail,
      avatar: "",
    },
    navMain: [],
    projects: [],
  };
};

function MainLayout() {
  const sidebarData = useUserSidebarData();

  return (
    <SidebarProvider>
      <AppSidebar sidebarData={sidebarData} />
      <main className="flex-1 overflow-auto p-4">
        <SidebarTrigger className="mb-4" />
        <Outlet />
        <Toaster />
      </main>
    </SidebarProvider>
  );
}

export default MainLayout;
