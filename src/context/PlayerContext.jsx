import { createContext, useContext, useEffect, useState } from "react";

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
  loginPlayer: () => {},
  logoutPlayer: () => {},
  accessToken: null,
  setAccessToken: () => {},
});

const PlayerContextProvider = ({ children }) => {
  const [player, setPlayer] = useState(defaultPlayer);
  const [accessToken, setAccessToken] = useState(null);

  const updatePlayer = (newPlayer) =>
    setPlayer((prev) => ({ ...prev, ...newPlayer }));

  const clearPlayer = () => setPlayer(defaultPlayer);

  // Auth functions..
  const loginPlayer = (playerData, accessT) => {
    updatePlayer(playerData);
    setAccessToken(accessT);
  };

  const logoutPlayer = () => {
    updatePlayer(defaultPlayer);
    setAccessToken(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        updatePlayer,
        clearPlayer,
        loginPlayer,
        logoutPlayer,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
