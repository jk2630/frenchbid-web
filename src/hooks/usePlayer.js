import { PlayerContext } from "../context/PlayerContext";
import { useContext } from "react";

const usePlayer = () => {
  const playerContext = useContext(PlayerContext);

  if (!playerContext) {
    throw new Error("Player was not set in the Player Context");
  }
  return playerContext;
};

export default usePlayer;
