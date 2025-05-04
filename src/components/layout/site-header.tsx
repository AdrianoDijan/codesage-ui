import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { AppBreadcrumbs } from "./breadcrumbs";

interface SiteHeaderProps {
  projects?: {
    id: string;
    name: string;
  }[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function SiteHeader({
  projects,
  searchQuery = "",
  onSearchChange,
}: SiteHeaderProps) {
  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        {/* Left side - Sidebar trigger and breadcrumbs */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-1 data-[orientation=vertical]:h-4"
          />
          <AppBreadcrumbs projects={projects} />
        </div>

        {/* Right side - Search and mode toggle */}
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 h-8"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
