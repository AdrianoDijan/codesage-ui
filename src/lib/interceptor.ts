import axios, { AxiosError } from "axios";

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

const saveAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

const saveRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

const deleteTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const setupInterceptors = () => {
  axios.defaults.baseURL =
    import.meta.env.VITE_BASE_API_URL ?? "http://localhost:8080";

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
        new Error(error instanceof Error ? error.message : String(error))
      );
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (!(error instanceof AxiosError) || !error.config) {
        return Promise.reject(new Error("Unknown error occurred"));
      }

      const originalRequest = error.config;
      const hasRetryFlag = "_retry" in originalRequest;

      if (
        error.response?.status === 401 &&
        !hasRetryFlag &&
        originalRequest.url !== "/api/token"
      ) {
        // Add retry flag to avoid infinite loops
        originalRequest._retry = true;
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          deleteTokens();
          return Promise.reject(new Error("No refresh token available"));
        }

        try {
          const tokenResponse = await axios.post<TokenResponse>(`/api/token`, {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          });

          const accessToken = tokenResponse.data.access_token;
          const newRefreshToken = tokenResponse.data.refresh_token;

          saveAccessToken(accessToken);
          saveRefreshToken(newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return await axios(originalRequest);
        } catch (error) {
          deleteTokens();
          return Promise.reject(new Error("Token refresh failed"));
        }
      }

      return Promise.reject(error);
    }
  );
};
