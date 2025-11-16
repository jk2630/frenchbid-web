import { motion } from "framer-motion";
import Card from "../Card";
import useGame from "../../hooks/useGame";
import { GameContext } from "../../context/GameContext";

// --- Single Player Component ---
// Opponent cards are not interactive.
const FBPlayer = ({ playerName, id, currentPlayerTurn }) => {
  const { gameRounds, gameData } = useGame(GameContext);
  const currentRoundIndex = gameData.roundNumber - 1;
  const currentRound = gameRounds[currentRoundIndex];
  const subRoundIndex = currentRound.subRoundIndex;
  const cardsPlayedByPlayers =
    currentRound.subRounds[subRoundIndex].cardsPlayed;

  const isCurrentPlayerTurn = id === currentPlayerTurn;

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div
        className={`
    flex flex-col items-center bg-teal-600/50 p-2 rounded-lg
    ${
      isCurrentPlayerTurn
        ? "border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.7)]"
        : "border border-teal-500 opacity-75"
    }
  `}
      >
        <i className="fas fa-user text-teal-100 text-2xl"></i>
        <span
          className={`font-semibold text-sm mt-1 ${
            isCurrentPlayerTurn ? "text-yellow-300" : "text-white"
          }`}
        >
          {playerName}
        </span>
        {/* <span className="text-teal-200 text-xs">{playerId}</span> */}
      </div>
      {cardsPlayedByPlayers != null && cardsPlayedByPlayers[id] != null && (
        <Card
          rank={cardsPlayedByPlayers[id].rank}
          suit={cardsPlayedByPlayers[id].suit}
          width="w-20"
          height="h-28"
          isInteractive={false}
        />
      )}
      {(cardsPlayedByPlayers == null || cardsPlayedByPlayers[id] == null) && (
        <Card width="w-20" height="h-28" isInteractive={false} />
      )}
    </motion.div>
  );
};

export default FBPlayer;
