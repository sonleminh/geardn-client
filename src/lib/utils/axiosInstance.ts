import { getRefreshToken, getSession, removeSession, setRefreshToken, setSession } from "@/authentication/cookie-session";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = process.env.BACKEND_API_URL;

let isRefreshing = false;
let failedQueue: any[] = [];

console.log('failedQueue', failedQueue);

// Create an instance of Axios with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL, // Set your API base URL
  timeout: 60000, // Set request timeout if needed
  withCredentials: true,
});

const axiosExtend: AxiosInstance = axios.create({
  baseURL: baseURL, // Set your API base URL
  timeout: 60000, // Set request timeout if needed
  withCredentials: true,
});

// Helper function to process failed requests after token refresh
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};


// Add a request interceptor
axiosExtend.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the authentication token from iron-session
    const token = await getSession();
    // Add the token to the request headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  },
);

axiosExtend.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error: AxiosError) {
    if (error?.response?.status === 401) {
      removeSession();
    }
    return Promise.reject(error);
  },
);

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the authentication token from iron-session
    const token = await getSession();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (!originalRequest) {
      // If originalRequest is undefined, reject the promise immediately
      return Promise.reject(error);
    }
    console.log('error?.response:', error?.response)
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // isRefreshing = true;
      // if (isRefreshing) {
      //   console.log('isRefreshing')
      //   // If a refresh is already in progress, queue the requests
      //   return new Promise((resolve, reject) => {
      //     failedQueue.push({ resolve, reject });
      //   })
      //     .then(async (token) => {
      //       // Retry the original request with the new token
      //       // originalRequest.headers.Authorization = `Bearer ${token}`;
      //       const response = await axiosInstance.get("/auth/whoami");
      //       console.log('response when refresh', response);
      //       if (!!response.data?.data) {
      //         window.location.reload();
      //         axiosInstance(originalRequest);
      //         return;
      //       } else {
      //         return axiosInstance(originalRequest);
      //       }
      //     })
      //     .catch((err) => Promise.reject(err));
      // }


      // const refreshToken = await getRefreshToken();
      // console.log('refresh_token:', refreshToken)
      // if (!refreshToken) {
      //   // If no refresh token or access token is available
      //   console.log('If no refresh token or access token is available')
      //   return Promise.reject(error);
      // }

      // Attempt to refresh the token
      // try {
      //   console.log('Attempt to refresh the token')
      //   // const newAxiosInstance = axios.create({
      //   //   baseURL,
      //   //   timeout: 60000,
      //   //   withCredentials: true,
      //   //   // headers: {
      //   //   //   Authorization: `Bearer ${refreshToken}`,
      //   //   // },
      //   // });

      //   const response = await axiosInstance.get(`/auth/refresh-token`);
      //   console.log('response', response);
      //   const newAccessToken = response.data?.data?.accessToken;

      //   // Save the new access and refresh token
      //   // axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
      //   // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      //   processQueue(null, newAccessToken);
      //   isRefreshing = false;
      //   return axiosInstance(originalRequest); // Retry the original request with the new token
      // } catch (refreshError: any) {
      //   processQueue(refreshError, null);
      //   removeSession(); // Clear session on failure
      //   isRefreshing = false;
      //   return Promise.reject(refreshError);
      // }
      //  finally {
      //   isRefreshing = false;
      // }
    }

    return Promise.reject(error);
  },
);

export { axiosInstance, axiosExtend };
