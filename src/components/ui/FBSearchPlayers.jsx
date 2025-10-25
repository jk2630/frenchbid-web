import { useState } from 'react';

// --- Mock Data ---
// In a real app, this data would be fetched from your backend
const allAvailablePlayers = [
  { id: 'p1', name: "PlayerOne" },
  { id: 'p2', name: "CardSharp" },
  { id: 'p3', name: "LeBideur" },
  { id: 'p4', name: "DiamondKing" },
  { id: 'p5', name: "AceHigh" },
];

/**
 * A reusable component to find and invite players.
 * @param {function} setPlayerToInvite - A state setter function from the parent
 */
const FBSearchPlayers = ({ setPlayerToInvite }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = allAvailablePlayers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50 flex flex-col overflow-hidden min-h-[300px] md:min-h-0">
      <h2 className="text-3xl text-amber-300 mb-6 font-semibold border-b-2 border-amber-400 pb-2">
        <i className="fas fa-search mr-3 text-blue-300"></i>
        Find Players
      </h2>
      <input
        type="search"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 bg-gray-700/90 rounded-md border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 mb-4"
      />
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-28">
        {filteredPlayers.map((player) => (
          <div key={player.id} className="bg-gray-700/90 p-3 rounded-lg flex justify-between items-center">
            <span className="text-lg text-white">{player.name}</span>
            <button
              onClick={() => setPlayerToInvite(player)} // Pass the player object to the state setter
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-4 rounded-lg transition-colors"
            >
              Invite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FBSearchPlayers;
