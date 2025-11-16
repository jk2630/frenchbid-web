import { useCallback } from "react";
import { useAxiosClient } from "../../hooks/axiosClient";
import usePlayer from "../../hooks/usePlayer";
import { PlayerContext } from "../../context/PlayerContext";

export const usePlayerActionService = (navigate) => {
  const axiosClient = useAxiosClient(navigate);
  const { player } = usePlayer(PlayerContext);

  const playerBidAPI = useCallback(
    async (playerBidRequest) => {
      try {
        const res = await axiosClient.post(
          `/action/${player.id}/bid`,
          playerBidRequest
        );
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
        throw new Error(player.playerName + " failed to place bid");
      }
    },
    [navigate]
  );

  const playerSubRoundAPI = useCallback(
    async (playerSubRoundRequest) => {
      try {
        const res = await axiosClient.post(
          `/action/${player.id}/subround`,
          playerSubRoundRequest
        );
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
        throw new Error(player.playerName + " failed to play this card");
      }
    },
    [navigate]
  );

  return { playerBidAPI, playerSubRoundAPI };
};
