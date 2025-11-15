import { motion, AnimatePresence } from "framer-motion"; // <-- Added AnimatePresence
import { useMemo, useState } from "react";
import FBHeader from "./FBHeader";
import FBPlayers from "./FBPlayers";
import FBFooter from "./FBFooter";
import Card from "../Card";
import { useNavigate } from "react-router-dom";
import useGame from "../../hooks/useGame";
import { GameContext } from "../../context/GameContext";
import { getAntiClockwisePlayers } from "../../utils/gameTableUtils";
import usePlayer from "../../hooks/usePlayer";
import { PlayerContext } from "../../context/PlayerContext";

// --- Main Game Table Component ---
// This component assembles the entire UI.
const GameTable = () => {
  const navigate = useNavigate();

  const { gamePlayers, gameData } = useGame(GameContext);
  const { player } = usePlayer(PlayerContext);

  const [myHand, setMyHand] = useState(gameData.playerHoldingCards[player.id]);
  const [playedCard, setPlayedCard] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);

  const gameState = gameData.gameState;
  const isBidding = gameState === "BIDDING";
  const currentPlayerTurn =
    gamePlayers[gameData.currentPlayerTurnIndex]?.id || "";

  const displayPlayers = useMemo(() => {
    if (!gamePlayers || gamePlayers.length === 0) {
      return [];
    }
    // Your utility function creates a new array in the correct order
    return getAntiClockwisePlayers(gamePlayers, player.id);
  }, [gamePlayers, player]); // Dependencies

  if (!gamePlayers || gamePlayers.length === 0) {
    navigate("/dashboard");
    return null;
  }

  const handlePlayCard = (cardToPlay, index) => {
    if (playedCard) return; // Prevent playing more than one card
    setPlayedCard(cardToPlay);
    setMyHand((currentHand) => currentHand.filter((_, i) => i !== index));
  };

  // --- 3. Added Bid Submit Handler ---
  const handleBidSubmit = () => {
    if (selectedBid) {
      console.log(`Bid submitted: ${selectedBid}`);
      // TODO: Add your logic here to send the bid to the game context or server.
      // e.g., submitBid(selectedBid);

      // This will reset the selection. The panel will "close"
      // when the gameData.gameState prop changes from "BIDDING"
      // (which should happen after your context processes the bid).
      setSelectedBid(null);
    }
  };

  // --- 4. Added Animation Variants ---
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="bg-teal-700 min-h-screen flex flex-col items-center">
      <FBHeader
        display_stats={true}
        display_menu={true}
        inGame={true}
        navigate={navigate}
        playersCount={gamePlayers.length}
        round={gameData.roundNumber}
      />
      <main className="w-full grow flex flex-col items-center justify-between p-2">
        <div className="flex flex-col w-full lg:flex-row items-center gap-4">
          <FBPlayers
            currentPlayerTurn={currentPlayerTurn}
            displayPlayers={displayPlayers}
          />
        </div>

        {/* --- 5. MODIFIED BIDDING/INFO PANEL --- */}
        <motion.div
          className="w-full lg:w-2xl bg-black/20 rounded-xl border-2 border-dashed border-teal-500 shrink-0 flex flex-col justify-center items-center m-1 p-4 min-h-5]" // <-- 6. Changed h-54/p-2
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isBidding ? (
              // ### BIDDING STATE ###
              <motion.div
                key="bidding-ui"
                className="w-full flex flex-col items-center"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-white font-bold text-center text-lg mb-4">
                  Place Your Bid
                </h3>

                {/* Grid of numbers 1-14 */}
                <div className="flex flex-wrap justify-center gap-2">
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((bid) => (
                    <button
                      key={bid}
                      onClick={() => setSelectedBid(bid)}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        font-bold text-white transition-all duration-150
                        ${
                          selectedBid === bid
                            ? "bg-teal-500 ring-2 ring-white scale-110" // Selected style
                            : "bg-teal-700 hover:bg-teal-600" // Default style
                        }
                      `}
                    >
                      {bid}
                    </button>
                  ))}
                </div>

                {/* Bid Button */}
                <button
                  onClick={handleBidSubmit}
                  disabled={!selectedBid}
                  className="
                    mt-4 px-6 py-2 rounded-lg font-bold text-white
                    transition-all duration-150
                    disabled:bg-gray-500 disabled:opacity-70 disabled:cursor-not-allowed
                    bg-green-500 hover:bg-green-400
                  "
                >
                  {selectedBid ? `Bid ${selectedBid}` : "Select a Bid"}
                </button>
              </motion.div>
            ) : (
              // ### DEFAULT STATE (Your original div) ###
              <motion.div
                key="game-info"
                className="w-full flex flex-col items-center"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-white font-bold text-center">Game Info</h3>
                <p className="text-teal-200 text-xs text-center mt-2">
                  Bids, Scores, and other details can be displayed here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {/* --- END OF MODIFIED SECTION --- */}

        {/* Player's Hand Section */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Played Card Slot & Game Info */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-32 bg-black/20 rounded-xl border-2 border-dashed border-teal-500 flex justify-center items-center p-2">
                {playedCard ? (
                  <Card
                    {...playedCard}
                    width="w-20"
                    height="h-28"
                    isInteractive={false}
                  />
                ) : (
                  <span className="text-teal-200 text-sm">Yet to play</span>
                )}
              </div>
            </div>

            {/* Your Deck of Cards */}
            <div
              className={`
    flex flex-wrap justify-center gap-2 p-4
    bg-black/20 rounded-xl
    ${
      currentPlayerTurn === player.id
        ? "border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.7)]"
        : "border-2 border-teal-500"
    }
  `}
            >
              {myHand.map((card, index) => (
                <div key={index} onClick={() => handlePlayCard(card, index)}>
                  <Card
                    {...card}
                    width="w-20"
                    height="h-28"
                    isInteractive={true}
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="text-white font-semibold mt-2">
            My name and my details.
          </p>
        </motion.div>
      </main>
      <FBFooter />
    </div>
  );
};

export default GameTable;
