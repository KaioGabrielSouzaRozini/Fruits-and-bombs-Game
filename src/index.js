import createKeyboardListener from "./controlls.js";
import createGame from "./game.js";
import drawGame from "./draw-game.js";

export const canvas = document.getElementById("canvas");
export const pincel = canvas.getContext("2d");

const list = document.getElementById("little-list")

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

  state["playerIds"].forEach((element) => { 
    if(element != playerId){
      const para = document.createElement("li");
      para.id = element
      para.innerText = element
      list.appendChild(para);
    } else if(element == playerId){
      const para = document.createElement("li");
      para.id = element
      para.style.color = "red"
      para.innerText = element
      list.appendChild(para);
    }
  })
  
  keyboardListener.registerPlayerId(playerId);
  keyboardListener.subscribe(game.movePlayer);
  keyboardListener.subscribe((command) => {
    socket.emit("move-player", command);
  });
});

socket.on("add-player", (command) => {
  const playerId = socket.id;
  console.log(`Receiving ${command.type} -> ${command.playerId}`);

  if(command.playerId != playerId){
    const para = document.createElement("li");
    para.id = command.playerId
    para.innerText = command.playerId
    list.appendChild(para);
  }


  game.addPlayer(command);
});

socket.on("remove-player", (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);

  const removePlayer = document.getElementById(command.playerId);
  list.removeChild(removePlayer)

  game.removePlayer(command);
});

socket.on("move-player", (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);

  const playerId = socket.id;

  if (playerId !== command.playerId) {
    game.movePlayer(command);
  }
});

socket.on("add-fruit", (command) => {
  const fruitId = socket.id;
  console.log(`Receiving ${command.type} -> ${command.fruitId}`);

  game.addFruit(command);
});

socket.on("remove-fruit", (command) => {
  console.log(`Receiving ${command.type} -> ${command.fruitId}`);

  game.removeFruit(command);
});
