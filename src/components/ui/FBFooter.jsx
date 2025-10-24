import { motion } from "framer-motion";
import fbLogo from "../../assets/frenchbid_logo.png";
import { Link } from "react-router-dom";

// --- Footer Component ---
// A simple footer for the bottom of the page.
const FBFooter = () => (
    <motion.footer
        className="w-full bg-gray-800 text-white p-3 mt-auto shadow-inner"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <img src={fbLogo} alt="French Bid Logo" className="h-12 w-15 rounded" />
                <div className="text-left">
                    <h3 className="text-xl font-bold text-yellow-400">French Bid</h3>
                    <p className="text-gray-400 text-sm">&copy; 2025 All Rights Reserved.</p>
                </div>
            </div>
            <div className="flex gap-6 text-gray-300">
                <Link to="/game/rules" className="hover:text-yellow-400 transition-colors">Rules</Link>
                <Link to="/about" className="hover:text-yellow-400 transition-colors">About</Link>
                <Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
            </div>
            <div className="flex gap-4 text-2xl">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fab fa-twitter"></i></Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fab fa-facebook"></i></Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors"><i className="fab fa-instagram"></i></Link>
            </div>
        </div>
    </motion.footer>
);

export default FBFooter;
