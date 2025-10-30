import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FBHeader from "../components/ui/FBHeader";
import FBFooter from "../components/ui/FBFooter";
import logo from "../assets/fantacy_bg.jpg"; // Make sure this path is correct
import FindPlayers from "../components/ui/FBSearchPlayers"; // <-- Import the new component

// --- Mock Data ---
const currentUser = { id: "p1", name: "PlayerOne (Host)" };

const Lobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  // --- State Definitions ---
  const [lobbyPlayers, setLobbyPlayers] = useState([currentUser]);
  const [playerToInvite, setPlayerToInvite] = useState(null);

  // --- Effect Hook ---
  // Watches 'playerToInvite' state. When it changes, this code runs.
  useEffect(() => {
    if (playerToInvite) {
      if (!lobbyPlayers.find((p) => p.id === playerToInvite.id)) {
        setLobbyPlayers((prevPlayers) => [...prevPlayers, playerToInvite]);
        console.log(`(Lobby) Added ${playerToInvite.name} to game ${gameId}`);
      }
      setPlayerToInvite(null); // Reset state
    }
  }, [playerToInvite, lobbyPlayers]); // Dependencies

  // --- Plain JavaScript Functions (Handlers) ---

  /**
   * Removes a player from the lobby.
   */
  const handleRemovePlayer = (playerToRemove) => {
    if (playerToRemove.id === currentUser.id) return;
    setLobbyPlayers(lobbyPlayers.filter((p) => p.id !== playerToRemove.id));
  };

  /**
   * Checks player count and navigates to the game.
   */
  const handleStartGame = () => {
    if (lobbyPlayers.length < 2) {
      alert("You need at least 2 players to start a game.");
      return;
    }
    console.log(`Starting game ${gameId}...`);
    navigate(`/game`);
  };

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
        <FBHeader display_stats={false} display_menu={true} inGame={false} />

        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 flex flex-col md:flex-row gap-8 md:overflow-hidden">
          {/* --- Left Panel: Players in Lobby --- */}
          <div className="flex-1 bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50 flex flex-col min-h-[400px] md:min-h-0">
            <h2 className="text-3xl text-amber-300 mb-6 font-semibold border-b-2 border-amber-400 pb-2">
              <i className="fas fa-users mr-3 text-teal-300"></i>
              Players in Lobby
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Game ID:{" "}
              <span className="font-mono text-amber-300">{gameId}</span>
            </p>

            {/* Scrollable list of players in the lobby */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
              {lobbyPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-700/90 p-3 rounded-lg flex justify-between items-center"
                >
                  <span className="text-lg text-white">{player.name}</span>
                  {player.id !== currentUser.id && (
                    <button
                      onClick={() => handleRemovePlayer(player)}
                      className="bg-red-600 hover:bg-red-500 text-white font-semibold py-1 px-4 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Start Game Button */}
            <button
              onClick={handleStartGame}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-xl transition-transform hover:scale-105 mt-6"
            >
              Start Game
            </button>
            <Link
              to="/"
              className="text-center text-gray-300 hover:text-white mt-4"
            >
              Cancel and return to Dashboard
            </Link>
          </div>

          {/* --- Right Panel: Find Players --- */}
          <div className="md:max-w-md w-full flex flex-col">
            {/* Pass the 'setPlayerToInvite' state setter function as a prop */}
            <FindPlayers setPlayerToInvite={setPlayerToInvite} />
          </div>
        </div>

        <FBFooter />
      </main>
    </div>
  );
};

export default Lobby;
