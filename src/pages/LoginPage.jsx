import FBFooter from "../components/ui/FBFooter";
import FBHeader from "../components/ui/FBHeader";
import FBInputBox from "../components/FBInputBox";
import FBButton from "../components/FBButton";
import { useNavigate, Link } from "react-router-dom";
import usePlayer from "../hooks/usePlayer";
import { PlayerContext } from "../context/PlayerContext";
import { useState } from "react";
import playerService from "../service/player/playerService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { player, updatePlayer, loginPlayer } = usePlayer(PlayerContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginRequest = {
      playerName: player.playerName,
      password: player.password,
    };

    setLoading(true);
    try {
      const res = await playerService.loginPlayer(loginRequest);
      if (res == null) {
        console.log("null response");
      } else if (res.status == 200) {
        const { accessToken, playerDetails } = res.data;
        loginPlayer(playerDetails, accessToken);
        console.log("Login Successfull");
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(
        error.response?.data || "Log in failed. Please try again later"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    updatePlayer({ [name]: value });
  };

  return (
    <div className="bg-teal-700 min-h-screen flex flex-col items-center">
      <FBHeader />

      <div className="pt-4 mt-8 mb-2 w-full text-center justify-center">
        <h2 className="text-4xl font-semibold text-amber-300/90 mb-4 shadow-md">
          Login
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around w-full px-4 sm:px-6 lg:px-8">
        {/* Optional logo */}
        {/* <img
          className="h-24 sm:h-28 md:h-32 mt-8 shadow-xl shadow-black/30"
          src={logo}
          alt="Frenchbid"
        /> */}

        {/* Login form container */}
        <div className="flex flex-col justify-center text-white border border-teal-200 rounded-2xl mt-2 px-6 sm:px-10 py-4 w-full max-w-lg shadow-lg bg-teal-800/40 backdrop-blur-sm">
          <h1 className="text-xl md:text-2xl text-amber-300/85 mb-6 text-center font-semibold drop-shadow-md">
            Play with Heart, Bid with Courage
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Player ID */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="playerName"
                className="text-base md:text-sm font-normal"
              >
                Player Name
              </label>
              <FBInputBox
                type="text"
                place_holder="Enter your username"
                name="playerName"
                value={player?.playerName || ""}
                onChange={handleOnChange}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-base md:text-sm font-normal"
              >
                Password
              </label>
              <FBInputBox
                type="password"
                place_holder="Enter your password"
                name="password"
                onChange={handleOnChange}
              />
            </div>
            {message && <p className="text-center">{message}</p>}
            {/* Button + Link */}
            <div className="flex flex-col items-center justify-center">
              <FBButton
                buttonText={loading ? "Logging in" : "Login"}
                type="submit"
                px="px-10"
              />
              <Link
                to="/register"
                className="underline text-teal-100 hover:text-teal-400 visited:text-teal-950 transition-colors duration-200 text-sm sm:text-base"
              >
                Create an Account
              </Link>
            </div>
          </form>
        </div>
      </div>

      <FBFooter />
    </div>
  );
};

export default LoginPage;
