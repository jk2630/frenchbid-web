import FBFooter from "../components/ui/FBFooter"
import FBHeader from "../components/ui/FBHeader"
import logo from "../assets/frenchbid_logo.png";
import FBInputBox from "../components/FBInputBox";
import FBButton from "../components/FBButton";
import { useNavigate, Link } from "react-router";

const LoginPage = () => {

    const navigate = useNavigate();
    const handleLogin = (event) => {
        event.preventDefault();
        navigate("/dashboard");
    };

    return <div className="bg-teal-700 min-h-screen flex flex-col items-center">
        <FBHeader />
        <div className="flex flex-col items-center justify-center">
            <img className="h-30 w-45 mt-12 shadow-xl shadow-black/30" src={logo} alt="Frenchbid" />

            <form onSubmit={handleLogin}>
                <div className="flex flex-col justify-center items-center text-white border-2 border-teal-200 rounded-2xl m-8 px-4 h-90 w-xl gap-4">
                    <h1 className="text-3xl text-amber-300 ml-8 mb-8 text-shadow-lg/70">Play with Heart, Bid with Courage.</h1>
                    <div className="flex gap-4 justify-between items-center">
                        <label className="mr-2">Player Id</label>
                        <FBInputBox type="text" place_holder="Player Id" name="player_id"/>
                    </div>
                    <div className="flex gap-4 justify-between items-center">
                        <label>Password</label>
                        <FBInputBox type="password" place_holder="password" name="password"/>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center items-end">
                        <FBButton buttonText="Login" type="submit" px="px-13"/>
                        <Link to="/register" className="underline mr-8 text-teal-100 hover:text-teal-400 visited:text-teal-950 transition-colors duration-200">Create Account</Link>
                    </div>
                </div>
            </form>

        </div>
        <FBFooter />
    </div>
};

export default LoginPage;
