import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { usePlayerActionService } from "../../service/playerAction/usePlayerActionService";
import { useGameService } from "../../service/game/useGameService";
import useGameEvents from "../../hooks/useGameEvents";

// --- Main Game Table Component ---
// This component assembles the entire UI.
const GameTable = () => {
  const navigate = useNavigate();

  // --- 1. HOOKS (Context) ---
  const {
    gameInfo,
    gamePlayers,
    gameData,
    updateGameData,
    gameRounds,
    updatePlayerBid,
    updateSubRound,
    scores,
    createGame,
    resetGame,
  } = useGame(GameContext);
  const { player } = usePlayer(PlayerContext);

  // --- 2. HOOKS (Services) ---
  const { playerBidAPI, playerSubRoundAPI } = usePlayerActionService(navigate);
  const { fetchGameAPI } = useGameService(navigate);

  // --- 3. HOOKS (State) ---
  // Initialize state with safe, empty values.
  // This prevents crashes if gameData is null on first render.
  const [myHand, setMyHand] = useState([]); // FIX: Initialize as empty array
  const [playedCard, setPlayedCard] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gamePause, setGamePause] = useState(false);

  // --- 6. GAME VARIABLES (Now safe to calculate) ---
  const isBidding = gameData.gameState === "BIDDING";
  const isInProgress = gameData.gameState === "IN_PROGRESS";
  const isGameOver = gameData.gameState === "GAME_OVER";

  const currentGamePlayers = Object.values(gamePlayers);
  const playerTurn =
    currentGamePlayers[gameData.currentPlayerTurnIndex]?.id || "";
  const playerTurnPlayername =
    currentGamePlayers[gameData.currentPlayerTurnIndex]?.playerName;

  const currentRoundIndex = Object.keys(gameRounds).length - 1;
  const currentRound = gameRounds[currentRoundIndex];
  const subRoundIndex = Object.keys(currentRound.subRounds).length - 1;
  const currentSubRound = currentRound.subRounds[subRoundIndex];

  const playerTotalWins = currentRound.playerWins;

  // We calculate these here but set them in an effect.
  const winnerName = currentSubRound.winnerId
    ? gamePlayers[currentSubRound.winnerId]?.playerName
    : "-";
  const cardsPlayed = currentSubRound.cardsPlayed;
  const trumpCard = currentRound.trumpCard;
  const currentPlayedCard = cardsPlayed?.[player.id] ?? null;
  const currentPlayerHand = gameData.playerHoldingCards[player.id];

  // --- 7. HOOK (Memo for displayPlayers) ---

  const displayPlayers = useMemo(() => {
    return getAntiClockwisePlayers(gamePlayers, player.id);
  }, [gamePlayers, player]);

  const bidNumbersList = useMemo(() => {
    return Array.from({ length: currentRoundIndex + 2 }, (_, i) => i);
  }, [navigate, currentRoundIndex]);

  // FIX: This effect synchronizes `myHand` state with the context
  useEffect(() => {
    setMyHand(currentPlayerHand);
  }, [currentPlayerHand]); // Dependency: the hand from gameData

  // FIX: This effect synchronizes `playedCard` state with the context
  useEffect(() => {
    setPlayedCard(currentPlayedCard);
  }, [currentPlayedCard]); // Dependency: the card from cardsPlayed

  // --- 9. HOOKS (Effects for API calls) ---
  const fetchCurrentGame = useCallback(async () => {
    try {
      const res = await fetchGameAPI(gameInfo.id);
      createGame(res);
    } catch (error) {
      console.error("fetchCurrentGame:", error);
      alert(error.message || "unable to fetch current game. try again");
    }
  }, [fetchGameAPI]); // Added createGame to dependency array

  useEffect(() => {
    fetchCurrentGame();
  }, [fetchCurrentGame]); // Dependency is now the memoized function

  // --- 10. HELPER FUNCTIONS ---
  const isValidPlayedCard = () => {
    return playedCard != null && Object.keys(playedCard).length > 0;
  };

  const handlePlayCard = async (cardToPlay, index) => {
    // This logic is now fine
    if (!isInProgress || isValidPlayedCard() || playerTurn !== player.id)
      return;
    setPlayedCard(cardToPlay);
    setMyHand((currentHand) => currentHand.filter((_, i) => i !== index));
    const playerSubRoundRequest = {
      gameId: gameInfo.id,
      playerCard: cardToPlay,
    };
    try {
      await playerSubRoundAPI(playerSubRoundRequest);
    } catch (error) {
      console.error("handlePlayCard:", error);
      // Revert state on error
      setPlayedCard(currentPlayedCard); // Revert to what context says
      setMyHand(currentPlayerHand); // Revert to what context says
      alert(error.message || "unable to play this card. try again");
    }
  };

  const handleBidSubmit = async () => {
    if (selectedBid != null) {
      const playerBidRequest = {
        gameId: gameInfo.id,
        playerBid: selectedBid,
      };
      setLoading(true);
      try {
        await playerBidAPI(playerBidRequest);
      } catch (error) {
        console.error("handleBidSubmit:", error);
        alert(error.message || "unable to place the bid. try again");
      } finally {
        setLoading(false);
        setSelectedBid(null);
      }
    }
  };

  const handleGameSseEvents = useMemo(() => {
    return {
      PLAYER_BID: (data) => {
        // update bid directly
        const {
          currentPlayerTurnIndex,
          roundIndex,
          playerId,
          playerBid,
          isLastPlayerBid,
        } = data;
        if (isLastPlayerBid) {
          fetchCurrentGame();
        } else {
          updatePlayerBid(roundIndex, playerId, playerBid);
          updateGameData({ currentPlayerTurnIndex: currentPlayerTurnIndex });
        }
      },
      PLAYER_CARD: (data) => {
        // if last player card received, then announce winner and pause for 5sec and
        // an api call to update the game for each player.

        const {
          currentPlayerTurnIndex,
          roundIndex,
          updatedSubRound,
          isLastPlay,
        } = data;
        // update cardPlayed, winnerPlayerId
        updateSubRound(roundIndex, updatedSubRound);
        if (isLastPlay) {
          setGamePause(true);
          setTimeout(() => {
            setGamePause(false);
            fetchCurrentGame();
          }, 3000);
        } else {
          updateGameData({ currentPlayerTurnIndex: currentPlayerTurnIndex });
        }
      },
      PLAYER_LEFT: (data) => {
        const leftPlayer = gamePlayers[data].playerName;
        alert(data === player.id ? "You" : leftPlayer + " left the game.");
        fetchCurrentGame();
      },
      GAME_CANCELLED: (data) => {
        resetGame();
      },
    };
  }, [navigate]);

  useGameEvents(player.id, gameInfo.id, handleGameSseEvents);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // --- 11. RETURN STATEMENT (Unchanged, as requested) ---
  return (
    <div className="bg-teal-700 min-h-screen flex flex-col items-center">
      <FBHeader
        display_stats={true}
        display_menu={true}
        inGame={true}
        navigate={navigate}
        playersCount={currentGamePlayers.length}
        round={currentRound.id}
      />
      <main className="w-full grow flex flex-col items-center justify-between p-2">
        <div className="flex flex-col w-full lg:flex-row items-center gap-4">
          <FBPlayers
            currentPlayerTurn={playerTurn}
            displayPlayers={displayPlayers}
            playerTotalWins={playerTotalWins}
          />
        </div>

        {/* --- 5. MODIFIED BIDDING/INFO PANEL --- */}
        <motion.div
          className="w-full lg:w-3xl bg-black/20 rounded-xl border-2 border-dashed border-teal-500 shrink-0 flex flex-col md:flex-row justify-center gap-10 items-center m-1 p-4 min-h-52" // Fixed typo
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-white font-medium">Trump</h1>
            <div className="p-1 m-2 border border-teal-200 rounded-xl border-dashed">
              <Card
                {...trumpCard}
                width="w-20"
                height="h-28"
                isTrump={true}
                isInteractive={false}
              />
            </div>
          </div>
          <div className="flex flex-col">
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
                    {bidNumbersList.map((bid) => (
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
                    disabled={playerTurn !== player.id || selectedBid == null}
                    className="
                    mt-4 px-6 py-2 rounded-lg font-bold text-white
                    transition-all duration-150
                    disabled:bg-gray-500 disabled:opacity-70 disabled:cursor-not-allowed
                    bg-green-500 hover:bg-green-400
                  "
                  >
                    {selectedBid != null
                      ? loading
                        ? `Bidding ${selectedBid}`
                        : `Bid ${selectedBid}`
                      : "Select a Bid"}
                  </button>
                </motion.div>
              ) : isGameOver ? (
                // ### DEFAULT STATE (Your original div) ###
                <motion.div
                  key="game-info"
                  className="w-full flex flex-col items-center"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h3 className="text-white font-bold text-center">
                    Game Info
                  </h3>
                  <p className="text-teal-200 text-xs text-center mt-2">
                    Game Over. Scores chuskoni chill avvandi guys
                  </p>
                </motion.div>
              ) : (
                // ### DEFAULT STATE (Your original div) ###
                <motion.div
                  key="game-info"
                  className="w-full flex flex-col items-center gap-3"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* <h3 className="text-white font-bold text-center">
                      Game Info
                    </h3> */}

                  {/* Responsive row/column layout */}
                  <div className="flex flex-col items-center justify-center gap-3 w-full max-w-md">
                    {/* Current Turn Box */}
                    {gamePause ? (
                      ""
                    ) : (
                      <div className="flex items-center justify-center gap-2 bg-teal-500/20 border border-teal-500 rounded-lg p-3">
                        <div className="text-teal-200 text-sm font-semibold">
                          Current Turn:
                        </div>
                        <div className="text-white text-base font-bold">
                          {playerTurnPlayername || "-"}
                        </div>
                      </div>
                    )}

                    {/* Last Winner Box */}
                    <div className="flex items-center justify-center gap-2 bg-teal-500/20 border border-teal-500 rounded-lg p-3">
                      <div className="text-teal-200 text-sm font-semibold">
                        {gamePause ? "Winner:" : "Winning Player:"}
                      </div>
                      <div className="text-white text-base font-bold">
                        {winnerName}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                {isValidPlayedCard() ? (
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
              className={`flex flex-wrap justify-center gap-2 p-4 bg-black/20 rounded-xl ${
                playerTurn === player.id
                  ? "border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.7)]"
                  : "border-2 border-teal-500"
              }`}
            >
              {myHand == null ? (
                <h1 className="text-white">ELIMINATED</h1>
              ) : (
                myHand.map((card, index) => (
                  <div key={index} onClick={() => handlePlayCard(card, index)}>
                    <Card
                      {...card}
                      width="w-20"
                      height="h-28"
                      isInteractive={true}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-around border w-full border-cyan-300/50 bg-teal-700 rounded-md px-3 py-2 mt-1 gap-4">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-cyan-200 text-md font-bold">Player:</h1>
              <h1 className="text-white font-medium">{player.playerName}</h1>
            </div>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-cyan-200 text-md font-bold">Score:</h1>
              <p className="text-white font-medium">{scores?.[player.id]}</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-cyan-200 text-md font-bold">Bid:</h1>
              <p className="text-white font-medium">
                {currentRound.playerBids?.[player.id] != null
                  ? currentRound.playerBids[player.id]
                  : "Yet to Bid"}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-cyan-200 text-md font-bold">Won:</h1>
              <p className="text-white font-medium">
                {playerTotalWins?.[player.id] || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <FBFooter />
    </div>
  );
};

export default GameTable;
