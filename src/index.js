import createKeyboardListener from "./controlls.js";
import createGame from "./game.js";
import drawGame from "./draw-game.js";

export const canvas = document.getElementById("canvas");
export const pincel = canvas.getContext("2d");

const list = document.getElementById("little-list")
const buttons = document.getElementById("buttons")

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

  if(state["playerIds"].length == 1){
    let button1 = document.createElement("button")
    button1.addEventListener("click",() => {
      socket.emit("start-game", 3000);
    })
    button1.innerText = "Start"
    buttons.appendChild(button1)

    let button2 = document.createElement("button")
    button2.addEventListener("click",() => {
      socket.emit("end-game");
    })
    button2.innerText = "End"
    buttons.appendChild(button2)

    let button3 = document.createElement("button")
    button3.addEventListener("click",() => {
      socket.emit("start-game", 2000);
    })
    button3.innerText = "velocidade 2"
    buttons.appendChild(button3)

    let button4 = document.createElement("button")
    button4.addEventListener("click",() => {
      socket.emit("start-game", 1000);
    })
    button4.innerText = "velocidade 3"
    buttons.appendChild(button4)

    let button5 = document.createElement("button")
    button5.addEventListener("click",() => {
      socket.emit("bombs", 3000);
    })
    button5.innerText = "bombs"
    buttons.appendChild(button5)

    let button6 = document.createElement("button")
    button6.addEventListener("click",() => {
      socket.emit("end-bombs");
    })
    button6.innerText = "endBombs"
    buttons.appendChild(button6)
  }

  state["playerIds"].forEach((element) => { 
    if(element != playerId){
      const para = document.createElement("li");
      para.id = element
      para.innerText = element
      const para2 = document.createElement("p");
      para2.id = `${element}p`
      para2.innerText = 0;
      para.appendChild(para2)
      list.appendChild(para);
    } else if(element == playerId){
      const para = document.createElement("li");
      para.id = element
      para.style.color = "red"
      para.innerText = element
      const para2 = document.createElement("p");
      para2.id = `${element}p`
      para2.innerText = 0;
      para.appendChild(para2)
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
    const para2 = document.createElement("p");
    para2.id = `${command.playerId}p`
    para2.innerText = 0;
    para.id = command.playerId
    para.innerText = command.playerId
    para.appendChild(para2)
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
  console.log(`Receiving ${command.type} -> ${command.fruitId}`);
  game.addFruit(command);
});

socket.on("remove-fruit", (command) => {
  console.log(`Receiving ${command.type} -> ${command.fruitId}`);

  game.removeFruit(command);
});

socket.on("add-bomb", (command) => {
  console.log(`Receiving ${command.type} -> ${command.bombId}`);
  game.addBomb(command);
});

socket.on("remove-bomb", (command) => {
  console.log(`Receiving ${command.type} -> ${command.bombId}`);

  game.removeBomb(command);
});

socket.on("add-point", (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId} -> ${command.playerPoints}`);
  let points = document.getElementById(`${command.playerId}p`)
  points.innerText = command.playerPoints
  game.removeFruit(command);
});
socket.on("remove-point", (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId} -> ${command.playerPoints}`);
  let points = document.getElementById(`${command.playerId}p`)
  points.innerText = command.playerPoints
  game.removeBomb(command);
});
socket.on("win-game", (command) => {
  console.log(`Receiving ${command.type} -> ${command.playerId}`);
  game.win(command);
  socket.emit("end-game");
  socket.emit("end-bombs");
});