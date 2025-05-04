import { Greeting } from "./components/greeting";
import { Notifications } from "./components/notifications";
import { ProjectsList } from "./components/projects-list";
import { ActivityFeed } from "./components/activity-feed";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <Greeting />
          <Notifications />
        </div>

        <ProjectsList />

        <ActivityFeed />
      </div>
    </div>
  );
}
