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
        console.error(res.data);
        throw new Error(res.data?.message);
      }
    } catch (err) {
      console.log("Game creation failed. err:", err);
      throw new Error("createGame: Game creation failed");
    }
  };

  return { createGameAPI };
};
