import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";
const API_BASE_RENDER = "https://frenchbid-api.onrender.com/api";

export const useAxiosClient = (navigate) => {
  const { accessToken, setAccessToken, logoutPlayer } =
    useContext(PlayerContext);

  const axiosClient = axios.create({
    baseURL: API_BASE_RENDER,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Attach token to every request
  axiosClient.interceptors.request.use((config) => {
    if (config._skipAuthInterceptor) {
      return config;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Handle 401 response with retry
  axiosClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      // from error.config, we can get all the original request params.
      // like request, headers and others etc.
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        error.response?.data?.error?.startsWith(
          "accessToken expired or invalid" // exact response from backend to point refresh case.
        ) &&
        !originalRequest._retry
      ) {
        // we create a _retry flag.
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            `${API_BASE_RENDER}/auth/refresh`,
            null,
            {
              // this is required to send headers from browser to backend
              withCredentials: true,
              headers: {
                // this explicitly declared for null request case.
                "Content-Type": "application/json",
              },
            }
          );
          const newAccess = res.data?.accessToken;
          if (!newAccess) {
            throw new Error("No access token in refresh response");
          }

          setAccessToken(newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          // Skip the request interceptor for this retry
          originalRequest._skipAuthInterceptor = true;
          return axiosClient(originalRequest);
        } catch (err) {
          // clears the players context in frontend app
          logoutPlayer();
          try {
            // this is to clear cookie and refreshToken in db
            axios.post(`${API_BASE_RENDER}/auth/logout`, null, {
              // this is required to send headers from browser to backend
              withCredentials: true,
              headers: {
                // this explicitly declared for null request case.
                "Content-Type": "application/json",
              },
            });
          } catch (logoutError) {
            console.log("Logout Api Failed");
            return Promise.reject(logoutError);
          }
          navigate("/login");
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosClient;
};
