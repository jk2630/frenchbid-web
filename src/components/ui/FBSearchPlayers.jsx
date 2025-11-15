import { useCallback, useEffect, useState } from "react";
import { usePlayerService } from "../../service/player/usePlayerService";
import { useGameService } from "../../service/game/useGameService";
import useGame from "../../hooks/useGame";
import { GameContext } from "../../context/GameContext";

const PLAYERS_NOT_FOUND = "No Players Found";

const FBSearchPlayers = (props) => {
  const { navigate } = props;
  const { gameInfo, createGame } = useGame(GameContext);

  // services
  const { getPlayersBySearchKeyAPI } = usePlayerService(navigate);
  const { joinPlayerAPI } = useGameService(navigate);

  // States
  const [searchTerm, setSearchTerm] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [message, setMessage] = useState("");

  const getPlayersByKey = useCallback(async () => {
    try {
      const res = await getPlayersBySearchKeyAPI(searchTerm);
      if (res.length === 0) {
        setMessage(PLAYERS_NOT_FOUND);
      } else {
        setMessage("");
      }
      setAvailablePlayers(res);
    } catch (error) {
      console.error("getGamesByKey:", error);
      setMessage(error.message);
      setActiveGamesList([]);
    }
  }, [searchTerm, getPlayersBySearchKeyAPI]);

  useEffect(() => {
    if (searchTerm == null) return;
    if (searchTerm == "") {
      setAvailablePlayers([]);
      setMessage("");
      return;
    }
    const delayDebounce = setTimeout(() => {
      getPlayersByKey();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, getPlayersByKey]);

  const handleClickInvite = async (playerInvited) => {
    // join this player to the game for now.
    try {
      const joinPlayerRequest = {
        gameId: gameInfo.id,
        playerId: playerInvited.id,
      };
      const res = await joinPlayerAPI(joinPlayerRequest);
      createGame(res);
      console.log(
        playerInvited.playerName + " has joined game: " + gameInfo.gameName
      );
    } catch (error) {
      console.error("handleClickInvite:", error);
      alert(
        error.message ? error.message : "unable to join this game. try again"
      );
    }
  };

  return (
    <div className="flex-1 bg-gray-800/80 p-6 rounded-lg shadow-xl border border-teal-500/50 flex flex-col overflow-hidden min-h-[300px] md:min-h-0">
      <h2 className="text-3xl text-amber-300 mb-6 font-semibold border-b-2 border-amber-400 pb-2">
        <i className="fas fa-search mr-3 text-blue-300"></i>
        Find Players
      </h2>
      <input
        type="search"
        placeholder="Search by username..."
        value={searchTerm || ""}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 bg-gray-700/90 rounded-md border border-gray-600 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 mb-4"
      />

      {message !== "" && (
        <div className="text-center text-blue-300 my-1">
          <h1>{message}</h1>
        </div>
      )}

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-28">
        {availablePlayers.map((player) => (
          <div
            key={player.id}
            className="bg-gray-700/90 p-3 rounded-lg flex justify-between items-center"
          >
            <span className="text-lg text-white">{player.playerName}</span>
            <button
              onClick={() => handleClickInvite(player)} // Pass the player object to the state setter
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-4 rounded-lg transition-colors"
            >
              Invite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FBSearchPlayers;
