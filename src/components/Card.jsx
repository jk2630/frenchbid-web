import { motion } from "framer-motion";

// --- Reusable Card Component ---
// Now accepts an isInteractive prop to control hover animations.
const Card = ({ rank, suit, width = "w-24", height = "h-36", isInteractive = true }) => {
    const suitSymbols = {
        clubs: { symbol: '♣', color: 'text-gray-800' },
        diamonds: { symbol: '♦', color: 'text-red-600' },
        hearts: { symbol: '♥', color: 'text-red-600' },
        spades: { symbol: '♠', color: 'text-gray-800' },
    };

    const { symbol, color } = suitSymbols[suit] || {};

    const rankFontSize = width === "w-20" ? 'text-xl' : 'text-2xl';
    const suitFontSize = width === "w-20" ? 'text-4xl' : 'text-5xl';

    // Conditionally apply hover animation
    const hoverAnimation = isInteractive ? { scale: 1.1, y: -10, cursor: 'pointer' } : {};

    return (
        <motion.div
            className={`bg-white rounded-lg shadow-md flex flex-col justify-between p-2 border border-gray-300 shrink-0 ${width} ${height}`}
            whileHover={hoverAnimation}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
            <div className={`${rankFontSize} font-bold ${color}`}>{rank}{symbol}</div>
            <div className={`${suitFontSize} self-center ${color}`}>{symbol}</div>
            <div className={`${rankFontSize} font-bold self-end rotate-180 ${color}`}>{rank}{symbol}</div>
        </motion.div>
    );
};

export default Card;
