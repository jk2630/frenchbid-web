export const getAntiClockwisePlayers = (gamePlayersObj, currentPlayerId) => {
  const gamePlayers = Object.values(gamePlayersObj);
  const n = gamePlayers.length;
  if (n === 0) {
    return [];
  }
  const startIndex = gamePlayers.findIndex(
    (player) => player.id === currentPlayerId
  );

  if (startIndex === -1) {
    console.error("Current player ID not found in game players list.");
    return [];
  }

  // 2. Build the result array in two loops (one logical pass)
  const reorderedPlayers = [];

  // Part 1: Loop from startIndex (3) down to 0
  // Adds [p4, p3, p2, p1]
  for (let i = startIndex; i >= 0; i--) {
    reorderedPlayers.push(gamePlayers[i]);
  }

  // Part 2: Loop from the end (6) down to startIndex + 1 (4)
  // Adds [p7, p6, p5]
  for (let i = n - 1; i > startIndex; i--) {
    reorderedPlayers.push(gamePlayers[i]);
  }

  // Final result: [p4, p3, p2, p1, p7, p6, p5]
  return reorderedPlayers;
};
