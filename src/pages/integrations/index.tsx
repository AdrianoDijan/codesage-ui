import { useGetIntegrations } from "@/api/endpoints/users/users.gen";
import { Button } from "@/components/ui/button";
import { Plus, Puzzle, Link as LinkIcon, Key } from "lucide-react";
import { IntegrationCreationDialog } from "./components/integration-creation-dialog";
import { IntegrationsList } from "./components/integrations-list";
import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { cn } from "@/lib/utils";

export default function IntegrationsPage() {
  const [searchParams] = useSearchParams();
  const { data: integrationsData, isLoading: isLoadingIntegrations } =
    useGetIntegrations("me");
  const [showCreationDialog, setShowCreationDialog] = useState(false);

  // Get current tab from URL params, default to 'available'
  const currentTab = searchParams.get("tab") ?? "available";

  // GitHub-style tab navigation items
  const navItems = [
    { id: "available", label: "Available", icon: Puzzle },
    { id: "bindings", label: "Bindings", icon: LinkIcon },
    { id: "api-keys", label: "API Keys", icon: Key },
  ];

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Integrations</h1>

          <IntegrationCreationDialog
            open={showCreationDialog}
            onOpenChange={setShowCreationDialog}
            trigger={
              <Button
                onClick={() => {
                  setShowCreationDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Integration
              </Button>
            }
            onSuccess={() => {
              // Data is invalidated by the dialog itself on success
              // queryClient.invalidateQueries({ queryKey: ["/api/users/me/integrations"] });
            }}
          />
        </div>

        {/* GitHub-style Navigation */}
        <nav className="border-b border-border">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <Link
                  key={item.id}
                  to={`?tab=${item.id}`}
                  className={cn(
                    "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Content based on current tab */}
        {currentTab === "available" && (
          <div className="space-y-6">
            {isLoadingIntegrations ? (
              <IntegrationsList integrations={[]} isLoading={true} />
            ) : integrationsData?.data.integrations ? (
              <IntegrationsList
                integrations={integrationsData.data.integrations}
                isLoading={false}
              />
            ) : (
              <IntegrationsList integrations={[]} isLoading={false} />
            )}
          </div>
        )}

        {currentTab === "bindings" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-dashed p-8 text-center">
              <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-medium">Integration Bindings</h3>
              <p className="text-muted-foreground mt-2">
                Manage your integration bindings here
              </p>
            </div>
          </div>
        )}

        {currentTab === "api-keys" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Key className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-medium">API Keys</h3>
              <p className="text-muted-foreground mt-2">
                Manage your API keys and authentication
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
