"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Link, useLocation } from "react-router";
import { Home, FolderOpen, PuzzleIcon, Plus } from "lucide-react";
import { useAppContext } from "@/hooks/use-app-context";
import { ProjectCreationDialog } from "@/components/projects/project-creation-dialog";
import { Button } from "@/components/ui/button";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  projects: {
    id: string;
    name: string;
  }[];
  searchQuery?: string;
}

export function AppSidebar({
  user,
  projects,
  searchQuery = "",
  ...props
}: AppSidebarProps) {
  const location = useLocation();
  const context = useAppContext();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarContent>
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">CS</span>
          </div>
        </SidebarContent>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <ProjectCreationDialog
                trigger={
                  <SidebarMenuButton
                    className="bg-primary hover:bg-primary/90 hover:text-sidebar-foreground"
                    variant="outline"
                    tooltip="New Project"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </SidebarMenuButton>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Main Navigation Section */}
        <SidebarGroup>
          <SidebarMenu>
            {/* Home */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/")}
                tooltip="Home"
              >
                <Link to="/">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Projects */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={
                  context.type === "projects" || context.type === "task"
                }
                tooltip="Projects"
              >
                <Link to="/projects">
                  <FolderOpen />
                  <span>Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Integrations */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/integrations")}
                tooltip="Integrations"
              >
                <Link to="/integrations">
                  <PuzzleIcon />
                  <span>Integrations</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
