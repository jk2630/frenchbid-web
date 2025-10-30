import { useContext } from "react";
import { GameContext } from "../context/GameContext";

const useGame = () => {
  const gameContext = useContext(GameContext);
  if (!gameContext) {
    throw new Error("Game Context was not set in the App context");
  }
  return gameContext;
};

export default useGame;
