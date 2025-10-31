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

const getInitialStateOfPlayer = () => {
  const playerFromStorage = localStorage.getItem("player");
  return playerFromStorage ? JSON.parse(playerFromStorage) : defaultPlayer;
};

const getInitialStateOfAccessToken = () => {
  const accessTokenFromStorage = localStorage.getItem("accessToken");
  return accessTokenFromStorage ? JSON.parse(accessTokenFromStorage) : null;
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
  const [player, setPlayer] = useState(getInitialStateOfPlayer);
  const [accessToken, setAccessToken] = useState(getInitialStateOfAccessToken);

  useEffect(() => {
    localStorage.setItem("player", JSON.stringify(player));
  }, [player]);

  useEffect(() => {
    localStorage.setItem("accessToken", JSON.stringify(accessToken));
  }, [accessToken]);

  const updatePlayer = (newPlayer) =>
    setPlayer((prev) => ({ ...prev, ...newPlayer }));

  const clearPlayer = () => setPlayer(defaultPlayer);

  // Auth functions..
  const loginPlayer = (playerData, accessT) => {
    updatePlayer(playerData);
    setAccessToken(accessT);
  };

  const logoutPlayer = () => {
    clearPlayer();
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
