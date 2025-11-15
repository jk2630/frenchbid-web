import { motion } from "framer-motion";

// --- Reusable Card Component ---
// Now accepts an isInteractive prop to control hover animations.
const Card = ({
  rank,
  suit,
  width = "w-24",
  height = "h-36",
  isInteractive = true,
}) => {
  const isCardEmpty = rank == null || suit == null;
  const rankMap = {
    ACE: "A",
    TWO: "2",
    THREE: "3",
    FOUR: "4",
    FIVE: "5",
    SIX: "6",
    SEVEN: "7",
    EIGHT: "8",
    NINE: "9",
    TEN: "10",
    JACK: "J",
    QUEEN: "Q",
    KING: "K",
  };

  const rankFromMap = rankMap[rank];

  const suitSymbols = {
    CLUBS: { symbol: "♣", color: "text-gray-800" },
    DIAMONDS: { symbol: "♦", color: "text-red-600" },
    HEARTS: { symbol: "♥", color: "text-red-600" },
    SPADES: { symbol: "♠", color: "text-gray-800" },
  };

  const { symbol, color } = suitSymbols[suit] || {};

  const rankFontSize = width === "w-20" ? "text-xl" : "text-2xl";
  const suitFontSize = width === "w-20" ? "text-4xl" : "text-5xl";

  // Conditionally apply hover animation
  const hoverAnimation = isInteractive
    ? { scale: 1.1, y: -10, cursor: "pointer" }
    : {};

  const defaultCardClassName = `${width} ${height} bg-black/20 rounded-xl border-2 border-dashed border-teal-500 p-2`;
  const cardClassName = `bg-white rounded-lg shadow-md flex flex-col justify-between p-2 border border-gray-300 shrink-0 ${width} ${height}`;

  return (
    <motion.div
      className={isCardEmpty ? defaultCardClassName : cardClassName}
      whileHover={hoverAnimation}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <div className={`${rankFontSize} font-bold ${color}`}>
        {rankFromMap}
        {symbol}
      </div>
      <div className={`${suitFontSize} self-center ${color}`}>{symbol}</div>
      <div className={`${rankFontSize} font-bold self-end rotate-180 ${color}`}>
        {rankFromMap}
        {symbol}
      </div>
    </motion.div>
  );
};

export default Card;
