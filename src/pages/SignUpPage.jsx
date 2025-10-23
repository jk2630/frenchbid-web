import FBFooter from "../components/ui/FBFooter"
import FBHeader from "../components/ui/FBHeader"
import logo from "../assets/frenchbid_logo.png";
import FBInputBox from "../components/FBInputBox";
import FBButton from "../components/FBButton";

const SignUpPage = () => {
    return <div className="bg-teal-700 min-h-screen flex flex-col items-center">
        <FBHeader />
        <div className="flex flex-col items-center justify-center">
            <img className="h-30 w-45 mt-12 shadow-xl shadow-black/30" src={logo} alt="Frenchbid" />

            <div className="flex flex-col justify-center text-white border-2 border-teal-200 rounded-2xl m-8 px-12 h-90 w-xl gap-4">
                <h1 className="text-3xl text-amber-300 ml-16 mb-8 text-shadow-lg/70">Hi There! Create Account</h1>
                <div className="flex flex-col justify-between items-start gap-4">
                    <div className="flex gap-4 justify-between items-center">
                        <label className="mr-2">Player name</label>
                        <FBInputBox type="text" place_holder="player name"/>
                    </div>
                    <div className="flex gap-4 justify-between items-center">
                        <label className="mr-6.5">Password</label>
                        <FBInputBox type="password" place_holder="password"/>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center pr-10">
                    <FBButton buttonText="Sign Up" px="px-12" py="py-3"/>
                    <a href='#' className="underline text-teal-100 hover:text-teal-400 visited:text-teal-950 transition-colors duration-200">Already have an account?</a>
                </div>
            </div>

        </div>
        <FBFooter />
    </div>
};

export default SignUpPage;