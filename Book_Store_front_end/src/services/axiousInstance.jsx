import axios from "axios";

const axiosInstance = axios.create({
  baseURL:"http://127.0.0.1:8000/",
  withCredentials: true, // send cookies for refresh token
});

// Request Interceptor: add access token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: refresh token on 401
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/refresh",
          {},
          { withCredentials: true }
        );
        const newToken = res.data.access_token;
        localStorage.setItem("access_token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
