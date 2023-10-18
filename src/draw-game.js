import { pincel } from "./index.js";

export default function drawGame(game, requestAnimationFrame, currentPlayerId) {
  function drawReact(x, y, size, color) {
    pincel.fillStyle = color;
    pincel.fillRect(x, y, size, size);
  }

  pincel.fillStyle = "white";
  pincel.clearRect(0, 0, 50, 50);

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];
    drawReact(player.x, player.y, 1, "black");
  }
  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    drawReact(fruit.x, fruit.y, 1, "green");
  }

  const currentPlayer = game.state.players[currentPlayerId];
  if (currentPlayer) {
    drawReact(currentPlayer.x, currentPlayer.y, 1, "yellow");
  }
  requestAnimationFrame(() => {
    drawGame(game, requestAnimationFrame, currentPlayerId);
  });
}
