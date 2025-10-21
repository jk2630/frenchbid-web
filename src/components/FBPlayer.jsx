import { motion } from "framer-motion";
import Card from "./Card";

// --- Single Player Component ---
// Opponent cards are not interactive.
const FBPlayer = ({ playerName, playerId }) => (
    <motion.div 
        className="flex flex-col items-center gap-1"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
    >
        <div className="flex flex-col items-center bg-teal-600/50 p-2 rounded-lg border border-teal-400">
            <i className="fas fa-user text-teal-100 text-2xl"></i>
            <span className="text-white font-semibold text-sm mt-1">{playerName}</span>
            <span className="text-teal-200 text-xs">{playerId}</span>
        </div>
        <Card rank="7" suit="clubs" width="w-20" height="h-28" isInteractive={false} />
    </motion.div>
);

export default FBPlayer;