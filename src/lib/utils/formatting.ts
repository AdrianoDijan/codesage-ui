import { TaskResultSchema } from "@/api/models";

/**
 * Formats a date string for display
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Attempts to parse a message content string as a TaskResultSchema JSON
 * @param content The content string to parse
 * @returns The parsed TaskResultSchema or null if parsing fails
 */
export const parseMessageContent = (
  content: string,
): TaskResultSchema | null => {
  try {
    const parsedContent = JSON.parse(content) as unknown;

    if (
      parsedContent &&
      typeof parsedContent === "object" &&
      "type" in parsedContent &&
      "result" in parsedContent
    ) {
      return parsedContent as TaskResultSchema;
    }

    return null;
  } catch {
    return null;
  }
};
