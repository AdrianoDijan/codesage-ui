import axios from "axios";

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

export const setupInterceptors = () => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL;

  axios.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();
      if (getAccessToken()) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      let accessToken = getAccessToken();
      let refreshToken = getRefreshToken();

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const tokenResponse = await axios.post(`/api/token`, {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          });

          accessToken = tokenResponse.data.access_token;
          refreshToken = tokenResponse.data.refresh_token;

          if (!accessToken || !refreshToken) {
            throw new Error("No access token or refresh token found");
          }

          saveAccessToken(accessToken);
          saveRefreshToken(refreshToken);

          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed — handle logout globally
          deleteTokens();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
