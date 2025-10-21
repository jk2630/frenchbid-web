import { motion } from "framer-motion";
import { useState } from "react";
import FBHeader from "./FBHeader";
import FBPlayers from "./FBPlayers";
import FBFooter from "./FBFooter";
import Card from "./Card";

// --- Main Game Table Component ---
// This component assembles the entire UI.
const GameTable = () => {
    const initialCards = [
        { rank: "7", suit: "clubs" }, { rank: "A", suit: "clubs" },
        { rank: "K", suit: "hearts" }, { rank: "10", suit: "diamonds" },
        { rank: "Q", suit: "spades" }, { rank: "5", suit: "hearts" },
        { rank: "2", suit: "diamonds" },{ rank: "2", suit: "diamonds" },
        { rank: "2", suit: "diamonds" }, { rank: "Q", suit: "spades" }, 
        { rank: "5", suit: "hearts" }
    ];

    const [myHand, setMyHand] = useState(initialCards);
    const [playedCard, setPlayedCard] = useState(null);

    const handlePlayCard = (cardToPlay, index) => {
        if (playedCard) return; // Prevent playing more than one card
        setPlayedCard(cardToPlay);
        setMyHand(currentHand => currentHand.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-teal-700 min-h-screen flex flex-col items-center">
            <FBHeader />
            <main className="w-full flex-grow flex flex-col items-center justify-between md:p-8">
                
                <div className="flex flex-col w-full lg:flex-row items-center gap-4">
                    <FBPlayers />
                </div>

                <motion.div 
                    className="w-full lg:w-128 bg-black/20 rounded-xl border-2 border-dashed border-teal-500 flex-shrink-0 flex flex-col justify-center items-center m-1 p-2 h-48"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-white font-bold text-center">Game Info</h3>
                    <p className="text-teal-200 text-xs text-center mt-2">Bids, Scores, and other details can be displayed here.</p>
                </motion.div>

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
                                    <Card {...playedCard} width="w-20" height="h-28" isInteractive={false} />
                                ) : (
                                    <span className="text-teal-200 text-sm">Yet to play</span>
                                )}
                            </div>
                        </div>

                        {/* Your Deck of Cards */}
                        <div className="flex flex-wrap justify-center gap-2 p-4 bg-black/20 rounded-xl border-2 border-teal-500">
                            {myHand.map((card, index) => (
                                <div key={index} onClick={() => handlePlayCard(card, index)}>
                                    <Card {...card} width="w-20" height="h-28" isInteractive={true} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-white font-semibold mt-2">My name and my details.</p>
                </motion.div>
            </main>
            <FBFooter />
        </div>
    );
};

export default GameTable;