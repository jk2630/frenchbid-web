import { GameContext } from "../../context/GameContext";
import useGame from "../../hooks/useGame";
import FBPlayer from "./FBPlayer";
import { motion } from "framer-motion";

// --- Opponent Players Container ---
// Arranges all the opponent players in a responsive, wrapping row.
const FBPlayers = () => {
  const { gamePlayers } = useGame(GameContext);
  // const players = Array.from({ length: 5 }, (_, i) => ({
  //     playerName: `player ${i + 1}`,
  //     playerId: `ID_${1001 + i}`,
  // }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="grow bg-black/20 p-4 rounded-xl border-2 border-teal-500">
      <motion.div
        className="flex flex-wrap justify-around gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {gamePlayers.map(
          (player, index) => index != 0 && <FBPlayer key={index} {...player} />
        )}
      </motion.div>
    </div>
  );
};

export default FBPlayers;
