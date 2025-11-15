export const reOrderPlayers = (players, currentPlayerId) => {
  let curPlayerIndex = -1;
  for (var i = 0; i < players.length; i++) {
    if (players[i].id == currentPlayerId) {
      curPlayerIndex = i;
      break;
    }
  }
  if (curPlayerIndex == -1)
    throw new Error("current player doesnt exist in game");
  return [
    ...players.slice(curPlayerIndex, players.length),
    ...players.slice(0, curPlayerIndex),
  ];
};
