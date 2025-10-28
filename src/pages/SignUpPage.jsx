import FBFooter from "../components/ui/FBFooter";
import FBHeader from "../components/ui/FBHeader";
import logo from "../assets/frenchbid_logo.png";
import FBInputBox from "../components/FBInputBox";
import FBButton from "../components/FBButton";
import { useNavigate, Link } from "react-router-dom";
import usePlayer from "../hooks/usePlayer";
import playerService from "../service/player/playerService";
import { useState } from "react";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { player, updatePlayer } = usePlayer();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();
    const { id, ...playerRequest } = player;
    setLoading(true);
    try {
      const response = await playerService.createPlayer(playerRequest);
      if (response.status == 201 || response.status == 200) {
        setMessage("Player Created Successfully");
        updatePlayer(response.data);
        navigate("/dashboard");
      } else if (response.status >= 400 && response.status < 500) {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Sign up failed. Please try again later"
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

      <div className="flex flex-col md:flex-row items-center justify-around grow w-full px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        {/* <img
          className="h-24 sm:h-24 md:h-24 mt-10 shadow-xl shadow-black/30"
          src={logo}
          alt="Frenchbid"
        /> */}

        {/* Form container */}
        <div className="flex flex-col justify-center text-white border border-teal-200 rounded-2xl mt-2 px-6 sm:px-10 py-2 w-full max-w-lg shadow-lg bg-teal-800/40 backdrop-blur-sm">
          <h1 className="text-2xl sm:text-2xl text-amber-300/85 mb-4 text-center font-semibold drop-shadow-md">
            Hi There! Create Account
          </h1>

          <form onSubmit={handleSignup} className="flex flex-col gap-2">
            {/* Player name field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="firstName"
                className="text-base md:text-sm font-normal"
              >
                Player name
              </label>
              <FBInputBox
                type="text"
                place_holder="First name"
                name="firstName"
                value={player?.firstName || ""}
                onChange={handleOnChange}
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastName"
                className="text-base md:text-sm font-normal"
              >
                Last name
              </label>
              <FBInputBox
                type="text"
                place_holder="Last name"
                name="lastName"
                value={player?.lastName || ""}
                onChange={handleOnChange}
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="playerName"
                className="text-base md:text-sm font-normal"
              >
                Player Name
              </label>
              <FBInputBox
                type="text"
                place_holder="Player nickname"
                name="playerName"
                value={player?.playerName || ""}
                onChange={handleOnChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-base md:text-sm font-normal"
              >
                Email
              </label>
              <FBInputBox
                type="email"
                place_holder="Email"
                name="email"
                value={player?.email || ""}
                onChange={handleOnChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-base md:text-sm font-normal"
              >
                Password
              </label>
              <FBInputBox
                type="password"
                place_holder="Password"
                name="password"
                value={player?.password || ""}
                onChange={handleOnChange}
              />
            </div>

            {/* Button + Link */}
            <div className="flex flex-col items-center mt-2">
              <FBButton
                buttonText={loading ? "Signing Up" : "Sign Up"}
                type="submit"
                px="px-10"
              />
              <Link
                to="/login"
                className="underline text-teal-100 hover:text-teal-400 visited:text-teal-950 transition-colors duration-200 text-sm sm:text-base"
              >
                Already have an account?
              </Link>
            </div>
            {message && <p className="mt-2 text-center">{message}</p>}
          </form>
        </div>
      </div>

      <FBFooter />
    </div>
  );
};

export default SignUpPage;
