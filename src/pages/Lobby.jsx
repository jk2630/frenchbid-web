import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FBHeader from "../components/ui/FBHeader";
import FBFooter from "../components/ui/FBFooter";
import logo from "../assets/fantacy_bg.jpg"; // Make sure this path is correct
import FindPlayers from "../components/ui/FBSearchPlayers"; // <-- Import the new component
import useGame from "../hooks/useGame";
import { GameContext } from "../context/GameContext";
import usePlayer from "../hooks/usePlayer";
import { PlayerContext } from "../context/PlayerContext";
import { useGameService } from "../service/game/useGameService";
import useGameEvents from "../hooks/useGameEvents";

const Lobby = () => {
  const navigate = useNavigate();

  // Contexts
  const {
    gameInfo,
    gamePlayers,
    createGame,
    resetGame,
    addPlayer,
    removePlayer,
  } = useGame(GameContext);
  const { player } = usePlayer(PlayerContext);

  // services
  const { removePlayerAPI, fetchGameAPI, initGameAPI } =
    useGameService(navigate);

  // States
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ref's
  const hasFetched = useRef();

  const fetchGameByGameId = useCallback(
    async (gameId) => {
      try {
        const res = await fetchGameAPI(gameId);
        createGame(res);
        if (
          res.gameData.gameState === "BIDDING" ||
          res.gameData.gameState == "IN_PROGRESS"
        ) {
          navigate("/game");
        }
      } catch (error) {
        console.error("fetchGameByGameId:", error);
        alert(error.message || "Failed to fetch your game. try again later.");
      }
    },
    [fetchGameAPI]
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const gameId = gameInfo.id;
    if (gameId !== null || gameId !== "") {
      fetchGameByGameId(gameId);
    }
  }, [fetchGameByGameId]);

  const handleRemovePlayer = async (playerToRemove) => {
    try {
      await removePlayerAPI({
        gameId: gameInfo.id,
        playerId: playerToRemove.id,
      });
      removePlayer(playerToRemove.id);
    } catch (error) {
      console.error("handleRemovePlayer:", error);
      alert(error.message || "Player remove failed. try again");
    }
  };

  /**
   * Checks player count and navigates to the game.
   */
  const handleStartGame = async () => {
    if (Object.keys(gamePlayers).length < 2) {
      setMessage("Need atleast 2 players");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await initGameAPI(gameInfo.id, null);
      createGame(res);
      navigate(`/game`);
    } catch (error) {
      console.error("handleStartGame:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLobbySseEvents = useMemo(
    () => ({
      PLAYER_JOINED: (data) => {
        addPlayer(data);
      },
      PLAYER_LEFT: (data) => {
        removePlayer(data);
      },
      GAME_STARTED: (data) => {
        navigate("/game");
      },
      GAME_CANCELLED: (data) => {
        resetGame();
      },
    }),
    [navigate]
  );

  useGameEvents(player.id, gameInfo.id, handleLobbySseEvents);

  // --- Main Render ---

  return (
    <div className="relative min-h-screen md:h-screen md:overflow-hidden">
      {/* --- Background --- */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${logo})` }}
      />
      <div className="fixed inset-0 z-10 bg-teal-900/60 backdrop-blur-sm" />

      {/* --- Main Content --- */}
      <main className="relative z-20 min-h-screen md:h-screen flex flex-col justify-between">
        <FBHeader
          display_stats={false}
          display_menu={true}
          inGame={true}
          navigate={navigate}
        />

        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 flex flex-col md:flex-row gap-8 md:overflow-hidden">
          {/* --- Left Panel: Players in Lobby --- */}
          <div className="flex-1 bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50 flex flex-col min-h-[400px] md:min-h-0">
            <h2 className="text-3xl text-amber-300 mb-6 font-semibold border-b-2 border-amber-400 pb-2">
              <i className="fas fa-users mr-3 text-teal-300"></i>
              Players in Lobby
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Game:{" "}
              <span className="font-mono text-amber-300">
                {gameInfo.gameName}
              </span>
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Host:{" "}
              <span className="font-mono text-amber-300">{gameInfo.owner}</span>
            </p>

            {/* Scrollable list of players in the lobby */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
              {Object.values(gamePlayers).map(
                (lobbyPlayer) =>
                  lobbyPlayer.playerName !== gameInfo.owner && (
                    <div
                      key={lobbyPlayer.id}
                      className="bg-gray-700/90 p-3 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-lg text-white">
                        {lobbyPlayer.playerName}
                      </span>
                      {(lobbyPlayer.playerName !== player.playerName ||
                        lobbyPlayer.playerName == gameInfo.owner) && (
                        <button
                          onClick={() => handleRemovePlayer(lobbyPlayer)}
                          className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-4 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )
              )}
            </div>

            {/* Start Game Button */}
            {message && (
              <div className="text-md font-normal text-red-400 ml-1">
                {message}
              </div>
            )}
            {player.playerName == gameInfo.owner ? (
              <button
                onClick={handleStartGame}
                className={`w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-xl transition-transform hover:scale-105 ${
                  message ? "mt-1" : "mt-6"
                }`}
              >
                {loading ? "Creating Game" : "Start Game"}
              </button>
            ) : (
              <h1
                className={`w-full bg-green-600 text-white text-center font-bold py-3 px-4 rounded-lg shadow-lg text-xl ${
                  message ? "mt-1" : "mt-6"
                }`}
              >
                Wait for Host to Start
              </h1>
            )}
          </div>

          {/* --- Right Panel: Find Players --- */}
          <div className="md:max-w-md w-full flex flex-col">
            {/* Pass the 'setPlayerToInvite' state setter function as a prop */}
            <FindPlayers navigate={navigate} />
          </div>
        </div>

        <FBFooter />
      </main>
    </div>
  );
};

export default Lobby;
