const FBButton = (props) => {
  const { buttonText, type, px = "px-6", py = "py-2" } = props;

  return (
    <button
      type={type}
      className={`text-sm md:text-xl border text-white border-indigo-500 bg-indigo-300 shadow-xl shadow-indigo-500/50 inset-shadow-sm inset-shadow-white/30
     ${px} ${py} rounded-md transition duration-400 ease-in-out hover:bg-indigo-600 hover:scale-105 md:hover:scale-101 m-2`}
    >
      {buttonText ? buttonText : "Click Me!"}
    </button>
  );
};

export default FBButton;
