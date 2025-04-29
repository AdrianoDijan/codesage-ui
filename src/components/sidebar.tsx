"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export interface NavItem {
  title: string;
  url: string;
  items?: {
    title: string;
    url: string;
  }[];
  icon: LucideIcon;
  isActive?: boolean;
}

export interface UserData {
  name: string;
  email: string;
  avatar: string;
}

export interface ProjectData {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface SidebarData {
  user: UserData;
  navMain: NavItem[];
  projects: ProjectData[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sidebarData: SidebarData;
}

export function AppSidebar({ sidebarData, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
