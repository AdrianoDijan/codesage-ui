import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { logout } from "@/lib/auth/auth-service";
import { UserInfoCard } from "./components/user-info";
import { SecurityCard } from "./components/security";
import { IntegrationsCard } from "./components/integrations";
import { DeleteAccountCard } from "./components/delete-account";

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6">
        <UserInfoCard />
        <SecurityCard />
        <IntegrationsCard />
        <DeleteAccountCard />
      </div>
    </div>
  );
}
