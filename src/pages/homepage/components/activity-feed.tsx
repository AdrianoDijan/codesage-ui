import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function ActivityFeed() {
  // This would typically fetch activity data from an API
  const activityItems = [
    {
      id: 1,
      avatar: "SYS",
      title: "System analyzed your code",
      time: "2 hours ago in Project Alpha",
      description: "Found 3 potential improvements in the codebase",
    },
    {
      id: 2,
      avatar: "TM",
      title: "Team Member added you to a project",
      time: "Yesterday",
      description: "You were added to Project Beta",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>
            See what's happening in your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {activityItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarFallback>{item.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
                {index < activityItems.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
