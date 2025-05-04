import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
} from "./auth/auth-service";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const setupInterceptors = () => {
  const baseURL =
    (import.meta.env.VITE_BASE_API_URL as string | undefined) ??
    "http://localhost:8080";
  axios.defaults.baseURL = baseURL;

  axios.interceptors.request.use(
    (config) => {
      // Skip adding token for token refresh requests
      if (config.url === "/api/token") {
        return config;
      }

      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(
        new Error(error instanceof Error ? error.message : String(error)),
      );
    },
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: unknown) => {
      if (!(error instanceof AxiosError) || !error.config) {
        return Promise.reject(new Error("Unknown error occurred"));
      }

      const originalRequest = error.config as ExtendedAxiosRequestConfig;
      const hasRetryFlag = originalRequest._retry === true;

      if (
        error.response?.status === 401 &&
        !hasRetryFlag &&
        originalRequest.url !== "/api/token"
      ) {
        // Add retry flag to avoid infinite loops
        originalRequest._retry = true;
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          clearTokens();
          return Promise.reject(new Error("No refresh token available"));
        }

        try {
          // Create form-encoded data for the refresh token request
          const formData = new URLSearchParams();
          formData.append("grant_type", "refresh_token");
          formData.append("refresh_token", refreshToken);

          const tokenResponse = await axios.post<TokenResponse>(
            `/api/token`,
            formData,
          );

          const accessToken = tokenResponse.data.access_token;
          const newRefreshToken = tokenResponse.data.refresh_token;

          // Use the auth service to store tokens, which will notify components
          storeTokens(accessToken, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return await axios(originalRequest);
        } catch {
          // Use the auth service to clear tokens, which will notify components
          clearTokens();
          return Promise.reject(new Error("Token refresh failed"));
        }
      }

      return Promise.reject(error);
    },
  );
};
