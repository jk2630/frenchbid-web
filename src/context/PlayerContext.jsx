import { createContext, useContext, useState } from "react";

// create player context
// add provider code

const defaultPlayer = {
  id: "",
  firstName: "",
  lastName: "",
  playerName: "",
  email: "",
  password: "",
};

export const PlayerContext = createContext({
  player: defaultPlayer,
  updatePlayer: () => {},
  clearPlayer: () => {},
});

const PlayerContextProvider = ({ children }) => {
  const [player, setPlayer] = useState(defaultPlayer);

  const updatePlayer = (newPlayer) =>
    setPlayer((prev) => ({ ...prev, ...newPlayer }));

  const clearPlayer = () => setPlayer(defaultPlayer);

  return (
    <PlayerContext.Provider value={{ player, updatePlayer, clearPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
