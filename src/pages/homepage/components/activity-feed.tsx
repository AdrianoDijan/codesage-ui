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
import { Separator } from "@/components/ui/separator";
import {
  useGetProjects,
  useGetUserInfo,
} from "@/api/endpoints/users/users.gen";
import { NotificationLinkSchema } from "@/api/models";
import { useNavigate } from "react-router";

export function ActivityFeed() {
  const user = useGetUserInfo("me");
  const notifications = Array.isArray(user.data?.data.user.notifications)
    ? user.data.data.user.notifications
    : [];
  const navigate = useNavigate();
  const projectsData = useGetProjects("me");

  const handleNavigate = React.useCallback(
    async (link: NotificationLinkSchema) => {
      if (link.type === "task") {
        if (projectsData.data?.data.projects) {
          for (const project of projectsData.data.data.projects) {
            const taskMatch = project.tasks.find((task) => task.id === link.id);
            if (taskMatch) {
              await navigate(`/projects/${project.id}/tasks/${link.id}`);
              return;
            }
          }
        }
        await navigate(`/${link.type}/${link.id}`);
      } else {
        await navigate(`/${link.type}/${link.id}`);
      }
    },
    [navigate, projectsData],
  );

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
            {notifications.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm font-medium">{item.text}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {item.notification_type}
                    </span>
                  </div>
                  {item.link && (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-primary"
                      onClick={() => {
                        if (item.link)
                          handleNavigate(item.link).catch((error: unknown) => {
                            console.error(error);
                          });
                      }}
                    >
                      Go to {item.link.type === "task" ? "Task" : "Project"}
                    </Button>
                  )}
                </div>
                {index < notifications.length - 1 && <Separator />}
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
