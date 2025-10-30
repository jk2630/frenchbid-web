import { createContext, useEffect, useState } from "react";

const defaultGameInfo = {
  id: null,
  gameName: "",
  owner: "",
  isPrivate: false,
  gamePassword: "",
};

const defaultGameData = {
  gameState: "GAME_CREATED",
  roundNumber: 0,
  currentPlayerTurnIndex: 0,
  dealerIndex: 0,
  playerHoldingCards: {},
};

export const GameContext = createContext({
  gameInfo: defaultGameInfo,
  gamePlayers: [],
  gameRounds: [],
  gameData: defaultGameData,
  scores: [],
  createGame: () => {},
  updateGameInfo: () => {},
  addPlayer: () => {},
  removePlayer: () => {},
  updateGameRound: () => {},
  updateGameData: () => {},
  updateScores: () => {},
});

export const GameContextProvider = ({ children }) => {
  const [gameInfo, setGameInfo] = useState(defaultGameInfo);

  const [gamePlayers, setGamePlayers] = useState([]);
  const [gameRounds, setGameRounds] = useState([]);
  const [scores, setScores] = useState([]);
  const [gameData, setGameData] = useState(defaultGameData);

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

  const addPlayer = (player) => {
    setGamePlayers((prev) => ({ ...prev, player }));
  };
  const removePlayer = (playerId) => {
    setGamePlayers(gamePlayers.filter((player) => player.id != playerId));
  };

  const updateGameInfo = (newValues) => {
    setGameInfo((prev) => ({ ...prev, ...newValues }));
  };

  const updateGameData = (newValues) => {
    setGameData((prev) => ({ ...prev, newValues }));
  };

  const updateGameRound = (roundId, newValues) => {
    setGameRounds((prevRounds) =>
      prevRounds.map((round) =>
        round.roundId === roundId ? { ...round, ...newValues } : round
      )
    );
  };

  const updateScores = (newScores) => {
    setScores((prev) => ({ ...prev, newScores }));
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
        updateGameInfo,
        addPlayer,
        removePlayer,
        updateGameRound,
        updateGameData,
        updateScores,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
