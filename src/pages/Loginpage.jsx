import FBFooter from "../components/ui/FBFooter"
import FBHeader from "../components/ui/FBHeader"
import logo from "../assets/frenchbid_logo.png";
import FBInputBox from "../components/FBInputBox";
import FBButton from "../components/FBButton";

const LoginPage = () => {
    return <div className="bg-teal-700 min-h-screen flex flex-col items-center">
        <FBHeader />
        <div className="flex flex-col items-center justify-center">
            <img className="h-30 w-54 mt-12 shadow-xl shadow-black/30" src={logo} alt="Frenchbid" />

            <div className="flex flex-col justify-center items-center text-white border-2 border-teal-200 rounded-2xl m-8 px-4 h-90 w-xl gap-4">
                <div className="flex gap-4 justify-between items-center">
                    <label className="mr-2">Player Id</label>
                    <FBInputBox type="text" place_holder="Player Id"/>
                </div>
                <div className="flex gap-4 justify-between items-center">
                    <label>Password</label>
                    <FBInputBox type="password" place_holder="password"/>
                </div>
                <div className="flex justify-center items-center">
                    <FBButton buttonText="Sign Up" px="px-10" />
                    <FBButton buttonText="Login" px="px-13"/>
                </div>
            </div>

        </div>
        <FBFooter />
    </div>
};

export default LoginPage;