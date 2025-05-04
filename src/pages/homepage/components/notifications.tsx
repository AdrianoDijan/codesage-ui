import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock notifications (would fetch from API in real implementation)
const notifications = [
  {
    id: 1,
    title: "Project analysis complete",
    message: "Analysis for Project XYZ is ready to view",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "New task assigned",
    message: "You've been assigned a new code review task",
    time: "Yesterday",
  },
  {
    id: 3,
    title: "System update",
    message: "CodeSage will undergo maintenance this weekend",
    time: "2 days ago",
  },
];

export function Notifications() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setShowNotifications(!showNotifications);
        }}
        className="relative"
      >
        <Bell />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
          {notifications.length}
        </span>
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 z-50 w-80 mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications</p>
            ) : (
              <div className="flex flex-col space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex flex-col space-y-1 pb-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <Separator className="mt-1" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="w-full">
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
