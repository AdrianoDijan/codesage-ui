import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { useState } from "react";
import {
  useGetUserInfo,
  useGetProjects,
} from "@/api/endpoints/users/users.gen";

function MainLayout() {
  const { data: userInfo } = useGetUserInfo("me");
  const { data: projectsData } = useGetProjects("me");
  const [searchQuery, setSearchQuery] = useState("");

  // Process user data
  const user = {
    name: userInfo?.data.user.first_name
      ? `${userInfo.data.user.first_name} ${userInfo.data.user.last_name ?? ""}`
      : (userInfo?.data.user.username ?? ""),
    email: userInfo?.data.user.email ?? "",
    avatar: "",
  };

  // Process projects - just the essentials
  const projects =
    projectsData?.data.projects.map((p) => ({
      id: p.id,
      name: p.name,
    })) ?? [];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={user}
        projects={projects}
        searchQuery={searchQuery}
      />
      <SidebarInset>
        <SiteHeader
          projects={projects}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="container mx-auto px-6">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

export default MainLayout;
