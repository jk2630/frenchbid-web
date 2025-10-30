import { useState } from "react"; // Import useState
import FBFooter from "../components/ui/FBFooter";
import FBHeader from "../components/ui/FBHeader";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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

const Dashboard = () => {
  // --- State for Modal and Navigation ---
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleCreateGame = (event) => {
    event.preventDefault();
    navigate("/lobby");
  };

  // --- Function to close the modal ---
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* --- Background Image & Overlay --- */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/path/to/your-background-image.jpg')" }}
      />
      <div className="fixed inset-0 z-10 bg-teal-900/60 backdrop-blur-sm" />

      {/* --- Main Content --- */}
      <main className="relative z-20 h-screen flex flex-col justify-between">
        <FBHeader display_stats={false} display_menu={true} inGame={false} />

        {/* This 'div' takes up the remaining space (flex-1) between header and footer */}
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 flex flex-col md:flex-row gap-8 overflow-hidden">
          {/* --- Left Panel: Active Games --- */}
          <div className="flex-1 bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50 flex flex-col">
            <h2 className="text-3xl text-amber-300 mb-6 font-semibold border-b-2 border-amber-400 pb-2">
              <i className="fas fa-list-ul mr-3 text-teal-300"></i>
              Active Games
            </h2>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {activeGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-700/90 p-4 rounded-lg flex justify-between items-center transition-all border-2 border-transparent hover:border-teal-400"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {game.name}
                    </h3>
                    <div className="flex gap-4 text-gray-300 text-sm mt-1">
                      <span>
                        <i className="fas fa-users text-yellow-400 mr-1"></i>{" "}
                        {game.players}
                      </span>
                      {game.isPublic ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <i className="fas fa-globe-americas text-xs"></i>{" "}
                          Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <i className="fas fa-lock text-xs"></i> Private
                        </span>
                      )}
                    </div>
                  </div>
                  {/* --- MODIFIED BUTTON --- */}
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
          {/* MODIFICATION: Added 'justify-center' to vertically center the card */}
          <div className="md:max-w-md w-full flex flex-col gap-8 justify-center">
            {/* --- 'Find Players' panel has been removed --- */}

            {/* Create New Game Section */}
            <div className="bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50">
              <h2 className="text-3xl text-amber-300 mb-6 font-semibold border-b-2 border-amber-400 pb-2">
                <i className="fas fa-plus-circle mr-3 text-green-400"></i>
                Create New Game
              </h2>
              <form onSubmit={handleCreateGame} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Game Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 'My Awesome Game'"
                    className="w-full p-3 bg-gray-700/90 rounded-md border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  Create Game
                </button>
              </form>
            </div>
          </div>
        </div>

        <FBFooter />
      </main>

      {/* --- Password Modal --- */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <div className="bg-gray-800/90 rounded-lg shadow-xl border border-teal-500/50 p-6">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl cursor-pointer"
              >
                &times;
              </button>

              {/* Game Details */}
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

              {/* Password Form */}
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

                {/* Error Message */}
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
