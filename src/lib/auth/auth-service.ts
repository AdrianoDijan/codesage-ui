import { useEffect } from "react";

export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken;
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// Create a custom event for authentication state changes
const AUTH_EVENT = "auth-state-changed";

const notifyAuthStateChange = () => {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
};

export const storeTokens = (
  accessToken: string,
  refreshToken: string,
): void => {
  try {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    // Notify components that authentication state has changed
    notifyAuthStateChange();
  } catch (error) {
    console.error("Failed to store tokens:", error);
  }
};

export const clearTokens = (): void => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Notify components that authentication state has changed
    notifyAuthStateChange();
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};

export const logout = (): void => {
  clearTokens();
  window.location.href = "/";
};

// Hook for components to listen to authentication state changes
export const useAuthStateListener = (callback: () => void) => {
  useEffect(() => {
    const handleAuthChange = () => {
      callback();
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    // Also listen for storage events for cross-tab synchronization
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [callback]);
};
