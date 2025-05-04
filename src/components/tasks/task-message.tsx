import { cn } from "@/lib/utils";
import { TaskMessageSchema } from "@/api/models";
import { parseMessageContent } from "@/lib/utils/formatting";
import { TaskResult } from "../results";
import MarkdownText from "../markdown";

interface TaskMessageProps {
  message: TaskMessageSchema;
}

/**
 * Component for rendering individual task messages
 */
export function TaskMessage({ message }: TaskMessageProps) {
  const parsedContent = parseMessageContent(message.content);

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        "bg-background/80 hover:bg-background transition-colors",
      )}
    >
      <p className="text-sm font-medium text-primary mb-2">{message.type}</p>
      <div
        className={cn(
          "prose prose-sm dark:prose-invert",
          "prose-headings:font-medium prose-p:text-foreground/90",
          "prose-code:text-secondary-foreground prose-code:bg-secondary/30 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5",
          "prose-pre:bg-secondary/20 prose-pre:text-foreground/90 prose-pre:rounded-md",
          "max-w-none",
        )}
      >
        {parsedContent ? (
          <TaskResult content={parsedContent} />
        ) : (
          <MarkdownText>{message.content}</MarkdownText>
        )}
      </div>
    </div>
  );
}
