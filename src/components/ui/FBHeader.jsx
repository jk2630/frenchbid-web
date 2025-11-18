import { motion } from "framer-motion";
import fbLogo from "../../assets/frenchbid_logo.png";
import FBMenuDropDown from "./FBMenuDropDown";

// --- Header Component ---
// Re-styled to include the quote and ensure single-line layout on larger screens.
const FBHeader = (props) => {
  const { display_stats, display_menu, inGame, navigate } = props;
  const { playersCount, round } = props;

  return (
    <motion.header
      className="w-full bg-gray-800 text-white p-3 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 shrink-0">
        <img src={fbLogo} alt="French Bid Logo" className="h-10 w-15 rounded" />
        <div className="hidden md:block">
          <p className="text-sm text-gray-300 italic">
            "Bid with wit, play with heart — every card tells a story."
          </p>
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2 text-md sm:text-lg">
        {display_stats && (
          <>
            <span className="flex items-center gap-2">
              <i className="fas fa-users text-yellow-400"></i> {playersCount}
            </span>
            <span className="flex items-center gap-2">
              <i className="fas fa-sync-alt text-yellow-400"></i> {round} / 14
            </span>
            <span className="flex items-center gap-2">
              <i className="fas fa-crown text-yellow-400"></i>Player A
            </span>
          </>
        )}
        {display_menu && (
          <span className="flex items-center gap-2 mx-4 md:mx-12">
            <FBMenuDropDown inGame={inGame} navigate={navigate} />
          </span>
        )}
      </div>
    </motion.header>
  );
};

export default FBHeader;
