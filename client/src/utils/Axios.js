import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Sending access token in the header
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // Eğer token yoksa ve login/logout/register sayfalarında değilsek isteği engelle
    if (!accessToken && !isAuthPage()) {
      return Promise.reject(new Error("No access token"));
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors and refresh token
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Logout endpoint'ine yapılan isteklerde token yenileme işlemi yapma
    if (originalRequest.url === SummaryApi.logout.url) {
      return Promise.reject(error);
    }

    // If the error status is 401 and there's no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // If no refresh token, redirect to login
          if (!isAuthPage()) {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${baseURL}${SummaryApi.refresToken.url}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          const newAccessToken = response.data.data.accessToken;

          // Store the new token
          localStorage.setItem("accessToken", newAccessToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid or expired, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (!isAuthPage()) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth sayfalarını kontrol et
const isAuthPage = () => {
  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/verification-otp",
    "/reset-password",
  ];
  return authPages.some((page) => window.location.pathname.includes(page));
};

export default Axios;
