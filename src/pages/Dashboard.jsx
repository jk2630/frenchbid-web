import { useEffect, useState, useRef } from "react"; // Import useState
import FBFooter from "../components/ui/FBFooter";
import FBHeader from "../components/ui/FBHeader";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useGame from "../hooks/useGame";
import { GameContext } from "../context/GameContext";
import { useGameService } from "../service/game/useGameService";

// --- Mock Data: Changed 'round' to 'isPublic' ---
const activeGames = [
  { id: "g1", name: "Player A's Game", players: "3/6", isPublic: true },
  { id: "g2", name: "The French Connection", players: "5/6", isPublic: false },
  { id: "g3", name: "High Bidders Only", players: "2/6", isPublic: true },
  { id: "g4", name: "Test Game 4", players: "4/6", isPublic: true },
  { id: "g5", name: "Another Lobby", players: "1/6", isPublic: false },
  { id: "g6", name: "Sample Game", players: "3/7", isPublic: true },
  { id: "g7", name: "Waiting Room", players: "1/6", isPublic: true },
];
// --- Removed availablePlayers array ---

// --- Mock Password "Database" ---
// In a real app, you'd check this on the backend
const gamePasswords = {
  g2: "nothing",
  g5: "nothing",
};

const PAGE_SIZE = 10;

const Dashboard = () => {
  // --- State for Modal and Navigation ---
  const navigate = useNavigate();
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

  // game context data
  const { gameInfo, updateGameInfo } = useGame(GameContext);

  // client hook
  const { createGameAPI, fetchGamesAPI } = useGameService(navigate);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchGamesRequest = {
      status: "GAME_CREATED",
      page: page,
      size: PAGE_SIZE,
    };
    setActiveGamesLoading(true);
    setActiveGamesMessage("");
    const fetchActiveGames = async () => {
      try {
        const res = await fetchGamesAPI(fetchGamesRequest);
        console.log("Active games:", res);
        setActiveGamesList(res);
      } catch (error) {
        console.error("handleCreateGame:", error);
        setActiveGamesMessage(error.message);
      }
    };
    fetchActiveGames();
  }, [page]);

  // --- Click Handler for Join Button ---
  const handleJoinClick = (game) => {
    if (game.isPublic) {
      // Public game: just navigate
      //   navigate(`/game/${game.id}`);
      navigate("/game");
    } else {
      // Private game: open modal
      setSelectedGame(game);
      setPasswordInput(""); // Clear old password
      setPasswordError(""); // Clear old error
      setIsModalOpen(true);
    }
  };

  // --- Handler for Password Form Submit ---
  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    // Check if password matches our mock database
    if (gamePasswords[selectedGame.id] === passwordInput) {
      // Success: close modal and navigate
      setIsModalOpen(false);
      //   navigate(`/game/${selectedGame.id}`);
      navigate("/game");
    } else {
      // Failure: show error
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleCreateGame = async (event) => {
    event.preventDefault();
    const gameRequest = {
      gameName: gameInfo.gameName,
      password: gameInfo.password,
      isPrivate: gameInfo.isPrivate,
    };
    setLoading(true);
    setMessage("");
    try {
      await createGameAPI(gameRequest);
      navigate("/lobby");
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
        <FBHeader display_stats={false} display_menu={true} inGame={false} />

        {/* --- Content area --- */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {/* --- Left Panel: Active Games --- */}
          <div className="flex-1 bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50 flex flex-col h-[calc(100vh-220px)]">
            <h2 className="text-3xl text-amber-300 mb-6 font-semibold border-b-2 border-amber-400 pb-2">
              <i className="fas fa-list-ul mr-3 text-teal-300"></i>
              Active Games
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                        {game.players.length}
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

          {/* --- Right Panel: Create Game --- */}
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
                {selectedGame.name}
              </h2>
              <div className="flex gap-4 text-gray-300 text-sm mt-1 mb-6">
                <span>
                  <i className="fas fa-users text-yellow-400 mr-1"></i>{" "}
                  {selectedGame.players}
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
