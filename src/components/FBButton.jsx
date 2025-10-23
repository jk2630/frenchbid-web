const FBButton = (props) => {

    const {buttonText, px = "px-6", py = "py-2"} = props;

    return <button className={`text-sm md:text-xl text-white border border-indigo-500 bg-indigo-400 shadow-xl shadow-indigo-500/50
     ${px} ${py} rounded-md transition duration-400 ease-in-out hover:scale-105 md:hover:scale-115 m-32`}>
        {buttonText ? buttonText : "Click Me!"}
    </button>
}

export default FBButton;