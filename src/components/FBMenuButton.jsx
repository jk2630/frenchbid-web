const FBMenuButton = (props) => {

    const { isActive, setIsActive } = props;

    return <button 
    onClick={() => setIsActive(!isActive)}
    className="text-md md:text-xl text-white border border-black bg-gray-800 w-8 text-center 
    rounded-full shadow-xl shadow-gray-500/30 hover:shadow-gray-500 hover:scale-110">
        <i className="fa-solid fa-power-off"></i>
    </button>
} 

export default FBMenuButton;