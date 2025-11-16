import { Navigate, Outlet } from "react-router-dom";
import useGame from "../hooks/useGame"; // Adjust path
import { GameContext } from "../context/GameContext"; // Adjust path

const RequireGame = () => {
  const { gameInfo, gameData } = useGame(GameContext);

  // Check if the essential game data exists.
  const hasGame = !!gameInfo?.id && !!gameData;

  if (!hasGame) {
    // No game data found, redirect to dashboard.
    // This stops GameTable from ever rendering without data.
    return <Navigate to="/dashboard" replace />;
  }

  // A game exists, so render the child component (GameTable).
  return <Outlet />;
};

export default RequireGame;
