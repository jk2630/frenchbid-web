import { useEffect, useState, useRef, useCallback } from "react"; // Import useState
import FBFooter from "../components/ui/FBFooter";
import FBHeader from "../components/ui/FBHeader";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useGame from "../hooks/useGame";
import { GameContext } from "../context/GameContext";
import { useGameService } from "../service/game/useGameService";
import usePlayer from "../hooks/usePlayer";
import { PlayerContext } from "../context/PlayerContext";

const PAGE_SIZE = 10;

const Dashboard = () => {
  const navigate = useNavigate();

  // states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeGamesList, setActiveGamesList] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeGamesLoading, setActiveGamesLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeGamesMessage, setActiveGamesMessage] = useState("");
  const [searchGamesKey, setSearchGamesKey] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [playerFetched, setPlayerFetched] = useState(false);

  // game context data
  const { gameInfo, updateGameInfo, createGame } = useGame(GameContext);

  // player context data
  const { player } = usePlayer(PlayerContext);

  // client hook
  const {
    createGameAPI,
    fetchGamesAPI,
    joinPlayerAPI,
    getGamesBySearchKeyAPI,
  } = useGameService(navigate);

  const hasFetched = useRef(false);

  const fetchActiveGames = useCallback(async () => {
    const fetchGamesRequest = {
      status: "GAME_CREATED",
      page: page,
      size: PAGE_SIZE,
    };

    try {
      const res = await fetchGamesAPI(fetchGamesRequest);
      setActiveGamesList(res);
    } catch (error) {
      console.error("fetchActiveGames:", error);
      setActiveGamesMessage(error.message);
    }
  }, [page, fetchGamesAPI]);

  const fetchCurrentPlayerGame = useCallback(async () => {
    const fetchGameRequest = {
      status: "GAME_CREATED",
      owner: player.playerName,
    };
    try {
      const res = await fetchGamesAPI(fetchGameRequest);
      const gamePlayers = res[0].players;
      let isActiveGameFetched = false;
      for (var i = 0; i < gamePlayers.length; i++) {
        if (gamePlayers[i].playerName === player.playerName) {
          isActiveGameFetched = true;
          createGame(res[0]);
          alert("You have an active game. See you there!!");
        }
      }
      if (!isActiveGameFetched) setPlayerFetched(true);
    } catch (error) {
      console.error("fetchCurrentPlayerGame:", error);
      setPlayerFetched(true);
    }
  }, [player, fetchGamesAPI]);

  const getGamesByKey = useCallback(async () => {
    try {
      const res = await getGamesBySearchKeyAPI(searchGamesKey);
      setActiveGamesList(res);
    } catch (error) {
      console.error("getGamesByKey:", error);
      setActiveGamesList([]);
    }
  }, [searchGamesKey, getGamesBySearchKeyAPI]);

  // navigate to lobby
  useEffect(() => {
    if (gameInfo.id != null && gameInfo.id !== "") {
      navigate("/lobby");
    }
  }, [gameInfo.id, navigate]);

  // player active game
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    if (playerFetched) return;
    fetchCurrentPlayerGame();
  }, [fetchCurrentPlayerGame]);

  // fetch active games
  useEffect(() => {
    if (!playerFetched) return;
    setActiveGamesLoading(true);
    setActiveGamesMessage("");
    fetchActiveGames().finally(() => setActiveGamesLoading(false));
  }, [fetchActiveGames, playerFetched, page]);

  // refresh games
  useEffect(() => {
    if (!refreshToggle) return;
    setActiveGamesLoading(true);

    fetchActiveGames().finally(() => setActiveGamesLoading(false));
    setSearchGamesKey("");
    setRefreshToggle(false);
  }, [refreshToggle]);

  // search games by key
  useEffect(() => {
    if (searchGamesKey == null) return;
    setActiveGamesLoading(true);
    const delayDebounce = setTimeout(() => {
      if (searchGamesKey != null && searchGamesKey.length < 3) {
        fetchActiveGames().finally(() => setActiveGamesLoading(false));
        setSearchGamesKey("");
        return;
      }
      getGamesByKey().finally(() => setActiveGamesLoading(false));
    }, 400);

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [searchGamesKey, fetchActiveGames, getGamesByKey]);

  // --- Click Handler for Join Button ---
  const handleJoinClick = async (game) => {
    if (!game.isPrivate) {
      // join this player to this game.
      try {
        const joinPlayerRequest = {
          gameId: game.id,
          playerId: player.id,
        };
        const res = await joinPlayerAPI(joinPlayerRequest);
        createGame(res);
        console.log(player.playerName + " has joined game: " + game.gameName);
      } catch (error) {
        console.error("handleJoinClick:", error);
        alert(
          error.message ? error.message : "unable to join this game. try again"
        );
      }
    } else {
      setSelectedGame(game);
      setPasswordInput(""); // Clear old password
      setPasswordError(""); // Clear old error
      setIsModalOpen(true);
    }
  };

  // --- Handler for Password Form Submit ---
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (selectedGame.password === passwordInput) {
      try {
        const joinPlayerRequest = {
          gameId: selectedGame.id,
          playerId: player.id,
        };
        const res = await joinPlayerAPI(joinPlayerRequest);
        createGame(res);
        console.log(
          player.playerName + " has joined game: " + selectedGame.gameName
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("handlePasswordSubmit:", error);
        alert(error.message || "unable to join this game. try again");
      }
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleCreateGame = async (event) => {
    event.preventDefault();
    if (gameInfo.gameName == null || gameInfo.gameName === "") {
      alert(
        "yevadaina game name empty pedthada thu!! manchiga oka game name petti start chei."
      );
      setMessage("Game Name cannot be empty");
      return;
    }
    if (
      gameInfo.isPrivate &&
      (gameInfo.password == null || gameInfo.password.length < 5)
    ) {
      console.log(
        "Password should be greater than 4 and non empty for private game"
      );
      setMessage("Password is invalid");
      return;
    }
    const gameRequest = {
      gameName: gameInfo.gameName,
      password: gameInfo.password,
      isPrivate: gameInfo.isPrivate,
    };

    try {
      setLoading(true);
      setMessage("");
      await createGameAPI(gameRequest);
      console.log(
        player.playerName + " has created the game " + gameInfo.gameName
      );
    } catch (error) {
      console.error("handleCreateGame:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChangeForGameInfo = (event) => {
    const { name, type, value, checked } = event.target;
    updateGameInfo({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSearchGamesKey = (event) => {
    const { value } = event.target;
    hasFetched.current = false;
    setSearchGamesKey(value);
  };

  // --- Function to close the modal ---
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* --- Background & Overlay --- */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/path/to/your-background-image.jpg')" }}
      />
      <div className="fixed inset-0 z-10 bg-teal-900/60 backdrop-blur-sm" />

      {/* --- Main Content --- */}
      <main className="relative z-20 flex flex-col flex-1">
        <FBHeader
          display_stats={false}
          display_menu={true}
          inGame={false}
          navigate={navigate}
        />

        {/* --- Content area --- */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {/* --- Left Panel: Active Games (MODIFIED) --- */}
          <div className="md:flex-1 bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50 flex flex-col md:h-[calc(100vh-220px)]">
            {/* --- Panel Header: Title, Search, Refresh (MODIFIED) --- */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b-2 border-amber-400 pb-2">
              {/* Title */}
              <h2 className="text-sxl lg:text-3xl text-amber-300 font-semibold shrink-0">
                <i className="fas fa-list-ul mr-3 text-teal-300"></i>
                Active Games
              </h2>

              {/* Controls: Search + Refresh */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchGamesKey == null ? "" : searchGamesKey}
                    onChange={handleSearchGamesKey}
                    className="w-full p-2 pl-8 bg-gray-700/90 rounded-md border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm"
                  />
                  <i className="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => setRefreshToggle(true)}
                  className="shrink-0 bg-gray-700/90 hover:bg-gray-600/90 text-teal-300 font-bold p-2.5 rounded-md shadow-md transition-all border border-gray-600 hover:border-teal-500"
                  aria-label="Refresh active games"
                >
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>

            {activeGamesLoading && (
              <div className="flex justify-center">
                <h1 className="text-xl text-teal-400">Loading...</h1>
              </div>
            )}
            {/* --- Scrolling Container (Unchanged from previous) --- */}
            <div className="min-h-56 max-h-80 md:flex-1 md:max-h-none overflow-y-auto space-y-4 pr-2">
              {activeGamesList.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-700/90 p-4 rounded-lg flex justify-between items-center transition-all border-2 border-transparent hover:border-teal-400"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {game.gameName}
                    </h3>
                    <div className="flex flex-col lg:flex-row gap-2 text-gray-300 text-sm mt-1">
                      <span>
                        <i className="fas fa-users text-yellow-400 mr-1"></i>{" "}
                        {Object.keys(game.players).length}
                      </span>
                      {game.isPrivate ? (
                        <span className="flex items-center gap-1 text-red-400">
                          <i className="fas fa-lock text-xs"></i> Private
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-400">
                          <i className="fas fa-globe-americas text-xs"></i>{" "}
                          Public
                        </span>
                      )}
                      <span>
                        <i className="fas fa-person text-yellow-400 mr-1"></i>{" "}
                        {game.owner}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinClick(game)}
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- Right Panel: Create Game (Unchanged) --- */}
          <div className="md:max-w-md w-full flex flex-col gap-8 justify-center">
            <div className="bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50">
              <h2 className="text-3xl text-amber-300 mb-6 font-semibold border-b-2 border-amber-400 pb-2">
                <i className="fas fa-plus-circle mr-3 text-green-400"></i>
                Create New Game
              </h2>

              <form onSubmit={handleCreateGame} className="flex flex-col gap-2">
                <div>
                  <label
                    htmlFor="gameName"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Game Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 'My Awesome Game'"
                    name="gameName"
                    onChange={handleOnChangeForGameInfo}
                    className="w-full p-3 bg-gray-700/90 rounded-md border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter game password"
                    name="password"
                    onChange={handleOnChangeForGameInfo}
                    className="w-full p-3 bg-gray-700/90 rounded-md border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <label className="flex text-sm font-normal text-gray-200">
                  <input
                    type="checkbox"
                    name="isPrivate"
                    checked={gameInfo?.isPrivate}
                    onChange={handleOnChangeForGameInfo}
                  />
                  <span className="p-1">Private</span>
                </label>

                {message && (
                  <div className="text-red-400 text-sm font-normal">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  {loading ? "Creating Game..." : "Create Game"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <FBFooter />
      </main>

      {/* --- Password Modal (unchanged) --- */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={closeModal}
          />
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <div className="bg-gray-800/90 rounded-lg shadow-xl border border-teal-500/50 p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl cursor-pointer"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-amber-300">
                {selectedGame.gameName}
              </h2>
              <div className="flex gap-4 text-gray-300 text-sm mt-1 mb-6">
                <span>
                  <i className="fas fa-users text-yellow-400 mr-1"></i>{" "}
                  {selectedGame.players.length}
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <i className="fas fa-lock text-xs"></i> Private Game
                </span>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <label className="block text-lg font-medium text-white mb-2">
                  Enter Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-3 bg-gray-700/90 rounded-md border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-lg transition-transform hover:scale-105 mt-6 cursor-pointer"
                >
                  Join Game
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
