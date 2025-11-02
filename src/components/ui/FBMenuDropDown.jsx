import { useState } from "react";
import FBMenuButton from "../FBMenuButton";
import { Link } from "react-router";
import usePlayer from "../../hooks/usePlayer";
import { PlayerContext } from "../../context/PlayerContext";
import playerService from "../../service/player/playerService";
import useGame from "../../hooks/useGame";
import { GameContext } from "../../context/GameContext";
import { useGameService } from "../../service/game/useGameService";

const FBMenuDropDown = (props) => {
  const { inGame, navigate } = props;
  const [isActive, setIsActive] = useState(false);

  // Contexts
  const { player, logoutPlayer } = usePlayer(PlayerContext);
  const { gameInfo, resetGame } = useGame(GameContext);

  // Services
  const { removePlayerAPI, updateGameAPI } = useGameService(navigate);

  const handleLogoutPlayer = () => {
    const playerName = player.playerName;
    logoutPlayer();
    playerService.logoutPlayer(playerName);
  };

  const handleLeaveGame = async () => {
    try {
      const removePlayerRequest = {
        gameId: gameInfo.id,
        playerId: player.id,
      };
      await removePlayerAPI(removePlayerRequest);
      if (gameInfo.owner === player.playerName) {
        const updateGameRequest = {
          gameData: {
            gameState: "GAME_CANCELLED",
          },
        };
        await updateGameAPI(gameInfo.id, updateGameRequest);
      }
      navigate("/dashboard");
    } catch (error) {
      console.log("handleLeaveGame:", error);
    } finally {
      resetGame();
    }
  };

  return (
    <div className="">
      <div className="relative text-left flex flex-col">
        <FBMenuButton isActive={isActive} setIsActive={setIsActive} />

        {isActive && (
          <div
            className="fixed right-0 text-white mt-11.5 md:mt-14 mr-2 w-40 border border-teal-400/30
                     bg-teal-700/90 rounded-2xl shadow-lg flex flex-col justify-around items-center"
          >
            <Link to="#" className="p-2">
              Profile
            </Link>
            <Link to="/about" className="p-2">
              About
            </Link>
            {inGame && (
              <button onClick={handleLeaveGame} className="cursor-pointer p-2">
                Leave game
              </button>
            )}
            <Link to="/login" onClick={handleLogoutPlayer} className="p-2">
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FBMenuDropDown;
