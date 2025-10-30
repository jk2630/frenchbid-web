import { useState } from "react";
import FBMenuButton from "../FBMenuButton";
import { Link } from "react-router";

const FBMenuDropDown = (props) => {
  const { inGame } = props;
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="">
      <div className="relative text-left flex flex-col">
        <FBMenuButton isActive={isActive} setIsActive={setIsActive} />

        {isActive && (
          <div
            className="fixed right-0 text-white mt-11.5 md:mt-14 mr-2 w-40 border border-teal-400/30
                     bg-teal-700/90 rounded-2xl shadow-lg flex flex-col justify-around items-center"
          >
            <Link to="#" className="p-2">
              Profile
            </Link>
            <Link to="/about" className="p-2">
              About
            </Link>
            {inGame && (
              <Link to="/dashboard" className="p-2">
                Leave game
              </Link>
            )}
            <Link to="/login" className="p-2">
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FBMenuDropDown;
