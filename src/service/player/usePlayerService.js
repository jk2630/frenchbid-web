import { useCallback } from "react";
import { useAxiosClient } from "../../hooks/axiosClient";

export const usePlayerService = (navigate) => {
  // axios client.
  const axiosClient = useAxiosClient(navigate);

  const getPlayersBySearchKeyAPI = useCallback(
    async (playerId) => {
      try {
        const res = await axiosClient.get(`/players/search/${playerId}`);
        if (res.status == 200) return res.data;
        else if (res.status >= 400 && res.status < 500) {
          console.error(res.data.message);
          throw new Error(res.data?.message);
        }
      } catch (error) {
        if (error.response?.data?.message) {
          throw new Error(error.response?.data?.message);
        }
        console.log("error:", error);
        throw new Error("Game creation failed. Try again");
      }
    },
    [navigate]
  );

  return { getPlayersBySearchKeyAPI };
};
