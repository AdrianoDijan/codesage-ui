import { PlayCircle, CheckCircle, ClockIcon, AlertCircle } from "lucide-react";
import { TaskState } from "@/api/models";

/**
 * Task status mapping for consistent display across components
 */
export const taskStatusMap: Record<
  TaskState,
  {
    label: string;
    icon: React.JSX.Element;
    variant: "secondary" | "default" | "destructive" | "outline";
  }
> = {
  [TaskState.pending]: {
    label: "Pending",
    icon: <ClockIcon className="h-3 w-3" />,
    variant: "secondary",
  },
  [TaskState.running]: {
    label: "Running",
    icon: <PlayCircle className="h-3 w-3" />,
    variant: "default",
  },
  [TaskState.completed]: {
    label: "Completed",
    icon: <CheckCircle className="h-3 w-3" />,
    variant: "secondary",
  },
  [TaskState.failed]: {
    label: "Failed",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "destructive",
  },
  [TaskState.interrupted]: {
    label: "Interrupted",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "outline",
  },
  [TaskState.timeout]: {
    label: "Timeout",
    icon: <ClockIcon className="h-3 w-3" />,
    variant: "destructive",
  },
  [TaskState.cancelled]: {
    label: "Cancelled",
    icon: <AlertCircle className="h-3 w-3" />,
    variant: "secondary",
  },
  [TaskState.waiting]: {
    label: "Waiting",
    icon: <ClockIcon className="h-3 w-3" />,
    variant: "outline",
  },
};
