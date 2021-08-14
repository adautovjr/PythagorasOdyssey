const matrixSize = 3;

const initialValues = function(){
  switch (matrixSize) {
    case 3:
      return {
        x: 770,
        y: 350
      }
    case 4:
      return {
        x: 700,
        y: 290
      }
    case 5:
      return {
        x: 650,
        y: 220
      }
    case 6:
      return {
        x: 600,
        y: 150
      }
    default:
      return {
        x: 150,
        y: 150
      }
  }
}

let shownDebug = false;
let initialTablePosX = initialValues().x, initialTablePosY = initialValues().y;
let x = 0, y = 0, w = 100, h = 120;

let gameObjects = [
  {
    item: "Enemy",
    weight: 15
  },
  {
    item: "item",
    weight: 5
  },
  {
    item: "chest",
    weight: 10
  },
  {
    item: "trap",
    weight: 5
  }
];

var currentState = [];
for (var i = 0; i < matrixSize; i++) {
  currentState[i] = [];
  for (var j = 0; j < matrixSize; j++) {
    currentState[i][j] = spawn_random();
  }
}

let currentPosition = {
  x: Math.floor(matrixSize / 2) + (matrixSize % 2 == 0 ? -1 : 0),
  y: Math.floor(matrixSize / 2) + (matrixSize % 2 == 0 ? -1 : 0)
}

function setGameObjectPosition(x, y, gameObject) {
  console.log(`Setting ${gameObject} in ${x},${y}`);
  currentState[x][y] = gameObject;
}

function updatePlayerPosition() {
  setGameObjectPosition(currentPosition.x, currentPosition.y, "player");
}

if (matrixSize > 0) {
  updatePlayerPosition();
}

function drawMatrix(initialPosX = initialTablePosX, initialPosY = initialTablePosY, padding = 10) {
  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      x = ((w + padding) * (i)) + initialPosX;
      y = ((h + padding) * ((j))) + initialPosY;
      rect(x, y, w, h, 15);
      text(currentState[i][j], x + 6, y + 70);
    }
  }
  if (!shownDebug) {
    showDebug();
  }
  shownDebug = true;
}

function spawn_random() {
  var i;
  var weights = [];

  for (i = 0; i < gameObjects.length; i++)
    weights[i] = gameObjects[i].weight + (weights[i - 1] || 0);

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++)
    if (weights[i] > random)
      break;

  return gameObjects[i].item;
}

function showDebug() {
  console.table(currentState);
  console.log(currentPosition);
}

function move(direction) {
  const previousPosition = currentPosition;
  switch (direction) {
    case "up":
      for (let i = 0; i <= previousPosition.y + 1; i++) {
        // Para todas as casas na direção oposta que jogador estar, estas devem se mover na direção do jogador
        if (previousPosition.y + i == matrixSize - 1) {
          // Se estiver na borda do tabuleiro
          setGameObjectPosition(previousPosition.x, previousPosition.y + i, spawn_random());
        } else {
          // Se não move o anterior pra casa atual
          setGameObjectPosition(previousPosition.x, previousPosition.y + i, currentState[previousPosition.x][previousPosition.y + (i + 1)]);
        }
      }
      currentPosition.y -= 1;
      break;
    case "down":
      for (let i = 0; i <= previousPosition.y + 1; i++) {
        // Para todas as casas na direção oposta que jogador estar, estas devem se mover na direção do jogador
        if (previousPosition.y - i == 0) {
          // Se estiver na borda do tabuleiro
          setGameObjectPosition(previousPosition.x, previousPosition.y - i, spawn_random());
        } else {
          // Se não move o anterior pra casa atual
          setGameObjectPosition(previousPosition.x, previousPosition.y - i, currentState[previousPosition.x][previousPosition.y - (i + 1)]);
        }
      }
      currentPosition.y += 1;
      break;
    case "right":
      for (let i = 0; i <= previousPosition.x + 1; i++) {
        // Para todas as casas na direção oposta que jogador estar, estas devem se mover na direção do jogador
        if (previousPosition.x - i == 0) {
          // Se estiver na borda do tabuleiro
          if (currentState[previousPosition.x - i] !== undefined) {
            setGameObjectPosition(previousPosition.x - i, previousPosition.y, spawn_random());
          }
        } else {
          // Se não move o anterior pra casa atual
          if (currentState[previousPosition.x - i] !== undefined) {
            setGameObjectPosition(previousPosition.x - i, previousPosition.y, currentState[previousPosition.x - (i + 1)][previousPosition.y]);
          }
        }
      }
      currentPosition.x += 1;
      break;
    case "left":
      for (let i = 0; i <= previousPosition.x + 1; i++) {
        // Para todas as casas na direção oposta que jogador estar, estas devem se mover na direção do jogador
        if (previousPosition.x + i == matrixSize - 1) {
          // Se estiver na borda do tabuleiro
          if (currentState[previousPosition.x + i] !== undefined) {
          setGameObjectPosition(previousPosition.x + i, previousPosition.y, spawn_random());
          }
        } else {
          // Se não move o anterior pra casa atual
          if (currentState[previousPosition.x + i] !== undefined) {
            setGameObjectPosition(previousPosition.x + i, previousPosition.y, currentState[previousPosition.x + (i + 1)][previousPosition.y]);
          }
        }
      }
      currentPosition.x -= 1;
      break;
    default:
      console.error(`Weird direction ${direction}`);
      break;
  }
}

const Jogo = {
  draw() {
    background(imgFundoJogo);
    drawMatrix()
    //desenhaBotao(xBtnMenu, yBtnMenu + 150, 'Voltar', funcBtnMenu, 1);
  },
  handleInput() {
    switch (keyCode) {
      case UP_ARROW:
        if (currentPosition.y > 0){
          move("up");
        }
        break;
      case DOWN_ARROW:
        if (currentPosition.y < matrixSize - 1){
          move("down");
        }
        break;
      case LEFT_ARROW:
        if (currentPosition.x > 0){
          move("left");
        }
        break;
      case RIGHT_ARROW:
        if (currentPosition.x < matrixSize - 1){
          move("right");
        }
        break;
      case ESCAPE:
        telaAtual = TELAS.MENU;
        break;
      default:
        console.log(keyCode);
        break;
    }
    updatePlayerPosition();
    console.log(currentPosition);
  }
}