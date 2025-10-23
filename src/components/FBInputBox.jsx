const FBInputBox = (props) => {

    const { place_holder, type } = props;

    return <div>
        <input type={type ? type : "text"} placeholder={place_holder} className="border-2 block border-teal-200
        placeholder-gray-700 p-4 hover:border-sky-300 hover:shadow-xl hover:shadow-teal-400/30
        bg-teal-700 h-14 w-[320px] rounded-xl focus:border-teal-400 focus:ring-teal-400" />
    </div>
}

export default FBInputBox;