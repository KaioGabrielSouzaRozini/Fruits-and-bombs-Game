import express from "express";
import http from "http";
import createGame from "./src/game.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static("src"));

const game = createGame();


game.subscribe((command) => {
  console.log(`Emitting ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`Player connected on server with id: ${playerId}`);

  game.addPlayer({ playerId: playerId });

  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    game.removePlayer({ playerId: playerId });
  });

  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";

    game.movePlayer(command);
  });

  socket.on("start-game", (command) => {
    game.start(command)
  });

  socket.on("end-game", () => {
    game.end()
  });

  socket.on("bombs", () => {
    game.bombs()
  });
  socket.on("end-bombs", () => {
    game.endBombs()
  });
});



server.listen(3000, () => {
  console.log(`> Server listening on port: http://localhost:3000`);
});
