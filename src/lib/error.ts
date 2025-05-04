import { BaseErrorResponse, HTTPValidationError } from "@/api/models";
import { AxiosError } from "axios";

function isValidationError(data: unknown): data is HTTPValidationError {
  if (typeof data !== "object" || data === null) return false;

  const maybe = data as HTTPValidationError;
  return (
    Array.isArray(maybe.detail) &&
    maybe.detail.every(
      (item) => Array.isArray(item.loc) && typeof item.msg === "string",
    )
  );
}

function isBaseError(data: unknown): data is BaseErrorResponse {
  if (typeof data !== "object" || data === null) return false;

  const maybe = data as BaseErrorResponse;
  return typeof maybe.detail === "string";
}

export function getErrorMessage(error: AxiosError) {
  const responseData = error.response?.data;
  if (isValidationError(responseData)) {
    return (
      responseData.detail
        ?.map((item) => {
          const loc = item.loc.join(".");
          return `${loc}: ${item.msg}`;
        })
        .join("\n") ?? "Validation error"
    );
  }
  if (isBaseError(responseData)) {
    return responseData.detail;
  }
  return error.message;
}
