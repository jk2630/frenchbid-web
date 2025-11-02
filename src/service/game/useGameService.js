import { useCallback } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { useAxiosClient } from "../../hooks/axiosClient";
import useGame from "../../hooks/useGame";
import usePlayer from "../../hooks/usePlayer";

export const useGameService = (navigate) => {
  const axiosClient = useAxiosClient(navigate);
  const { player } = usePlayer(PlayerContext);
  const { createGame } = useGame();

  const createGameAPI = useCallback(
    async (gameRequest) => {
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
    },
    [navigate]
  );

  const fetchGamesAPI = useCallback(
    async (fetchGamesRequest) => {
      const queryParams = {
        ...(fetchGamesRequest.playerId && {
          owner: fetchGamesRequest.playerName,
        }),
        ...(fetchGamesRequest.status && { status: fetchGamesRequest.status }),
        ...(fetchGamesRequest.page != null && { page: fetchGamesRequest.page }),
        ...(fetchGamesRequest.size != null && { size: fetchGamesRequest.size }),
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
    },
    [navigate]
  );

  const joinPlayerAPI = useCallback(
    async (joinPlayerRequest) => {
      try {
        const res = await axiosClient.post(
          `/games/${joinPlayerRequest.gameId}/players/${joinPlayerRequest.playerId}`,
          null
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
        throw new Error("Game creation failed. Try again");
      }
    },
    [navigate]
  );

  const removePlayerAPI = useCallback(async (removePlayerRequest) => {
    try {
      const res = await axiosClient.delete(
        `/games/${removePlayerRequest.gameId}/players/${removePlayerRequest.playerId}`,
        null
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
      throw new Error("Game creation failed. Try again");
    }
  });

  const getGamesBySearchKeyAPI = useCallback(
    async (searchKey) => {
      try {
        const res = await axiosClient.get(`games/search/${searchKey}`);
        if (res.status == 200) return res.data;
        if (res.status >= 400 && res.status < 500) {
          console.error(res.data.message);
          throw new Error(res.data?.message);
        }
      } catch (error) {
        if (error.response?.data?.message) {
          throw new Error(error.response?.data?.message);
        }
        console.log("error:", error);
        throw new Error("Get games by searchKey failed. Try again");
      }
    },
    [navigate]
  );

  const updateGameAPI = useCallback(
    async (gameId, updateGameRequest) => {
      try {
        const res = await axiosClient.put(`games/${gameId}`, updateGameRequest);
        if (res.status == 200) return res.data;
        if (res.status >= 400 && res.status < 500) {
          console.error(res.data.message);
          throw new Error(res.data?.message);
        }
      } catch (error) {
        if (error.response?.data?.message) {
          throw new Error(error.response?.data?.message);
        }
        console.log("error:", error);
        throw new Error("Get games by searchKey failed. Try again");
      }
    },
    [navigate]
  );

  return {
    createGameAPI,
    fetchGamesAPI,
    joinPlayerAPI,
    removePlayerAPI,
    updateGameAPI,
    getGamesBySearchKeyAPI,
  };
};
