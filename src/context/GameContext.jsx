import { createContext, useEffect, useState } from "react";

const defaultGameInfo = {
  id: null,
  gameName: "",
  owner: "",
  isPrivate: false,
  gamePassword: "",
};

const defaultGameData = {
  gameState: null,
  roundNumber: 0,
  currentPlayerTurnIndex: 0,
  dealerIndex: 0,
  playerHoldingCards: {},
};

const getInitialStateOfGameInfo = () => {
  const gameInfoFromStorage = localStorage.getItem("gameInfo");
  return gameInfoFromStorage
    ? JSON.parse(gameInfoFromStorage)
    : defaultGameInfo;
};

const getInitialStateOfGamePlayers = () => {
  const gamePlayersFromStorage = localStorage.getItem("gamePlayers");
  return gamePlayersFromStorage ? JSON.parse(gamePlayersFromStorage) : [];
};

const getInitialStateOfGameRounds = () => {
  const gameRoundsFromStorage = localStorage.getItem("gameRounds");
  return gameRoundsFromStorage ? JSON.parse(gameRoundsFromStorage) : [];
};

const getInitialStateOfGameData = () => {
  const gameDataFromStorage = localStorage.getItem("gameData");
  return gameDataFromStorage
    ? JSON.parse(gameDataFromStorage)
    : defaultGameData;
};

const getInitialStateOfScores = () => {
  const scoresFromStorage = localStorage.getItem("scores");
  return scoresFromStorage ? JSON.parse(scoresFromStorage) : {};
};

export const GameContext = createContext({
  gameInfo: defaultGameInfo,
  gamePlayers: [],
  gameRounds: [],
  gameData: defaultGameData,
  scores: {},
  createGame: () => {},
  resetGame: () => {},
  updateGameInfo: () => {},
  addPlayer: () => {},
  removePlayer: () => {},
  setGamePlayers: () => {},
  updateGameRound: () => {},
  updateGameData: () => {},
  updateScores: () => {},
});

export const GameContextProvider = ({ children }) => {
  const [gameInfo, setGameInfo] = useState(getInitialStateOfGameInfo);

  const [gamePlayers, setGamePlayers] = useState(getInitialStateOfGamePlayers);
  const [gameRounds, setGameRounds] = useState(getInitialStateOfGameRounds);
  const [scores, setScores] = useState(getInitialStateOfScores);
  const [gameData, setGameData] = useState(getInitialStateOfGameData);

  useEffect(() => {
    localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
  }, [gameInfo]);

  useEffect(() => {
    localStorage.setItem("gamePlayers", JSON.stringify(gamePlayers));
  }, [gamePlayers]);

  useEffect(() => {
    localStorage.setItem("gameRounds", JSON.stringify(gameRounds));
  }, [gameRounds]);

  useEffect(() => {
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem("gameData", JSON.stringify(gameData));
  }, [gameData]);

  const createGame = (game) => {
    // game info
    setGameInfo({
      id: game.id,
      gameName: game.gameName,
      owner: game.owner,
      isPrivate: game.isPrivate,
      gamePassword: game.password,
    });

    // gamePlayers
    setGamePlayers(game.players);

    // rounds
    setGameRounds(game.rounds);

    // scores
    setScores(game.scores);

    // game data
    setGameData({
      gameState: game.gameData.gameState,
      roundNumber: game.gameData.roundNumber,
      currentPlayerTurnIndex: game.gameData.currentPlayerTurnIndex,
      dealerIndex: game.gameData.dealerIndex,
      playerHoldingCards: game.gameData.playerHoldingCards,
    });
  };

  const resetGame = () => {
    setGameInfo(defaultGameInfo);
    setGamePlayers([]);
    setGameRounds([]);
    setGameData(defaultGameData);
    setScores({});
  };

  const addPlayer = (player) => {
    setGamePlayers((prev) => [...prev, ...player]);
  };
  const removePlayer = (playerId) => {
    setGamePlayers((prev) => {
      const updated = { ...prev };
      delete updated[playerId];
      return updated;
    });
  };

  const updateGameInfo = (newValues) => {
    setGameInfo((prev) => ({ ...prev, ...newValues }));
  };

  const updateGameData = (newValues) => {
    setGameData((prev) => ({ ...prev, ...newValues }));
  };

  const updateGameRound = (roundId, newValues) => {
    setGameRounds((prevRounds) =>
      prevRounds.map((round) =>
        round.roundId === roundId ? { ...round, ...newValues } : round
      )
    );
  };

  const updateScores = (newScores) => {
    setScores((prev) => ({ ...prev, ...newScores }));
  };

  return (
    <GameContext.Provider
      value={{
        gameInfo,
        gamePlayers,
        gameRounds,
        gameData,
        scores,
        createGame,
        resetGame,
        updateGameInfo,
        addPlayer,
        removePlayer,
        setGamePlayers,
        updateGameRound,
        updateGameData,
        updateScores,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
