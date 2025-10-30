import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";
const API_BASE_RENDER = "https://frenchbid-api.onrender.com/api";

export const useAxiosClient = () => {
  const { accessToken, setAccessToken, logoutPlayer } =
    useContext(PlayerContext);

  const axiosClient = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  // Attach token to every request
  axiosClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Handle 401 response
  axiosClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh`, null, {
            withCredentials: true,
          });

          // ensure we actually got a valid token
          const newAccess = res.data?.accessToken;
          if (!newAccess) {
            throw new Error("No access token in refresh response");
          }

          setAccessToken(newAccess);
          error.config.headers.Authorization = `Bearer ${newAccess}`;

          // retry original request
          return axiosClient(error.config);
        } catch (err) {
          // refresh failed or invalid
          logoutPlayer();
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosClient;
};
