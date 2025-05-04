import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DangerZoneCardProps {
  isLoading?: boolean;
}

export function DeleteAccountCard({ isLoading = false }: DangerZoneCardProps) {
  if (isLoading) {
    return <DangerZoneCardSkeleton />;
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="destructive">Delete Account</Button>
      </CardFooter>
    </Card>
  );
}

export function DangerZoneCardSkeleton() {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-7 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-80" />
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t px-6 py-4">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
