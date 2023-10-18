import createKeyboardListener from "./controlls.js";
import createGame from "./game.js";
import drawGame from "./draw-game.js";

export const canvas = document.getElementById("canvas");
export const pincel = canvas.getContext("2d");

const game = createGame();
const keyboardListener = createKeyboardListener(document);

const socket = io();

socket.on("connect", () => {
  const playerId = socket.id;
  console.log(`Player connected on client with id; ${playerId}`);

  drawGame(game, requestAnimationFrame, playerId);
});

socket.on("setup", (state) => {
  const playerId = socket.id;
  game.setState(state);

  keyboardListener.registerPlayerId(playerId);
  keyboardListener.subscribe(game.movePlayer);
  keyboardListener.subscribe((command) => {
    socket.emit("move-player", command);
  });
});

socket.on("add-player", (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);
  game.addPlayer(command);
});

socket.on("remove-player", (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);
  game.removePlayer(command);
});

socket.on("move-player", (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);

  const playerId = socket.id;

  if (playerId !== command.playerId) {
    game.movePlayer(command);
  }
});
