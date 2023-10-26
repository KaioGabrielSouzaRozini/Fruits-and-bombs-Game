export default function createGame() {
  const state = {
    playerIds: [],
    fruits: {},
    players: {},
    canvas: {
      width:30,
      height: 30,
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
    state.playerIds.push(playerId)

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


    state.playerIds.forEach((element, index) => {
      if(element == playerId){
        state.playerIds.splice(index, 1)
      }
    })

    notifyAll({
      type: "remove-player",
      playerId: playerId,
    });
  }


  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = {
        x: fruitX,
        y: fruitY
    }

    notifyAll({
        type: 'add-fruit',
        fruitId: fruitId,
        fruitX: fruitX,
        fruitY: fruitY
    })
}

function removeFruit(command) {
    const fruitId = command.fruitId

    delete state.fruits[fruitId]

    notifyAll({
        type: 'remove-fruit',
        fruitId: fruitId,
    })
}

  function movePlayer(command) {
    notifyAll(command);
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y > 0) {
          player.y -= 1;
        } else {
          player.y = state.canvas.height - 1
        }
      },
      ArrowRight(player) {
        if (player.x < state.canvas.width - 1) {
          player.x += 1;
        } else {
          player.x = 0
        }
      },
      ArrowDown(player) {
        if (player.y < state.canvas.height - 1) {
          player.y += 1;
        } else {
          player.y = 0
        }
      },
      ArrowLeft(player) {
        if (player.x > 0) {
          player.x -= 1;
        } else {
          player.x = state.canvas.width - 1
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
    addFruit,
    removeFruit,
    state,
    setState,
    subscribe,
  };
}
