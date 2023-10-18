export default function createGame() {
  const state = {
    players: {},
    canvas: {
      width:50,
      height: 50,
    },
  };
  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX =
      "playerX" in command
        ? command.playerX
        : Math.floor(Math.random() * state.canvas.width);
    const playerY =
      "playerY" in command
        ? command.playerY
        : Math.floor(Math.random() * state.canvas.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: "add-player",
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,
    });
  }

  function removePlayer(command) {
    const playerId = command.playerId;
    delete state.players[playerId];

    notifyAll({
      type: "remove-player",
      playerId: playerId,
    });
  }

  function movePlayer(command) {
    notifyAll(command);
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y > 0) {
          player.y -= 1;
        }
      },
      ArrowRight(player) {
        if (player.x < state.canvas.width - 1) {
          player.x += 1;
        }
      },
      ArrowDown(player) {
        if (player.y < state.canvas.height - 1) {
          player.y += 1;
        }
      },
      ArrowLeft(player) {
        if (player.x > 0) {
          player.x -= 1;
        }
      },
    };

    const keyPressed = command.keyPressed;
    const playerId = command.playerId;
    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
    function checkForFruitCollision(playerId) {
      const player = state.players[playerId];

      for (const fruitId in state.fruits) {
        const fruit = state.fruits[fruitId];
        console.log(`check ${playerId} and ${fruitId}`);

        if (player.x === fruit.x && player.y === fruit.y) {
          console.log(`COLLISION between ${playerId} and ${fruitId}`);
          removeFruit({ fruitId: fruitId });
        }
      }
    }
  }
  return {
    addPlayer,
    removePlayer,
    movePlayer,
    state,
    setState,
    subscribe,
  };
}
