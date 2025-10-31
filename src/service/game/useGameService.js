import { PlayerContext } from "../../context/PlayerContext";
import { useAxiosClient } from "../../hooks/axiosClient";
import useGame from "../../hooks/useGame";
import usePlayer from "../../hooks/usePlayer";

export const useGameService = (navigate) => {
  const axiosClient = useAxiosClient(navigate);
  const { player } = usePlayer(PlayerContext);
  const { createGame } = useGame();

  const createGameAPI = async (gameRequest) => {
    gameRequest = {
      ...gameRequest,
      playerId: player.id,
      playerName: player.playerName,
    };
    try {
      const res = await axiosClient.post("/games", gameRequest);
      if (res.status == 200 || res.status == 201) {
        console.log("Game created Successfully");
        createGame(res.data);
      } else if (res.status >= 400 && res.status < 500) {
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
  };

  const fetchGamesAPI = async (fetchGamesRequest) => {
    const queryParams = {
      ...(fetchGamesRequest.playerId && {
        owner: fetchGamesRequest.playerName,
      }),
      ...(fetchGamesRequest.status && { status: fetchGamesRequest.status }),
      ...(fetchGamesRequest.page && { page: fetchGamesRequest.page }),
      ...(fetchGamesRequest.size && { size: fetchGamesRequest.size }),
    };

    try {
      const res = await axiosClient.get("/games", { params: queryParams });
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
  };

  return { createGameAPI, fetchGamesAPI };
};
