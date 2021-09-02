const matrixSize = 3;

const initialValues = function(){
  switch (matrixSize) {
    case 3:
      return {
        x: 600,
        y: 220,
        cardWidth: 200,
        cardHeight: 220,
        padding: 30,
        gameObject: {
          imgAdjustment: {
            x: 10,
            y: 20,
            size: 0.3
          }
        }
      }
    case 4:
      return {
        x: 580,
        y: 200,
        cardWidth: 150,
        cardHeight: 170,
        padding: 20,
        gameObject: {
          imgAdjustment: {
            x: 4,
            y: 16,
            size: 0.24
          }
        }
      }
    case 5:
      return {
        x: 580,
        y: 180,
        cardWidth: 130,
        cardHeight: 150,
        padding: 10,
        gameObject: {
          imgAdjustment: {
            x: 6,
            y: 16,
            size: 0.2
          }
        }
      }
    case 6:
      return {
        x: 580,
        y: 200,
        cardWidth: 100,
        cardHeight: 120,
        padding: 10,
        gameObject: {
          imgAdjustment: {
            x: 0,
            y: 10,
            size: 0.17
          }
        }
      }
    default:
      return {
        x: 150,
        y: 150,
        cardWidth: 100,
        cardHeight: 120,
        padding: 10,
        gameObject: {
          imgAdjustment: {
            x: 10,
            y: 20,
            size: 0.3
          }
        }
      }
  }
}

let shownDebug = false;
let initialTablePosX = initialValues().x, initialTablePosY = initialValues().y, initialPaddingValue = initialValues().padding;
let x = 0, y = 0, w = initialValues().cardWidth, h = initialValues().cardHeight;
let imgAdjustment = initialValues().gameObject.imgAdjustment;

let player = {
  type: "player",
  isCollectable: false,
  HP: 10
}

let gameObjects = [
  {
    item: {
      type: "enemy",
      isCollectable: false,
      minHP: 3,
      maxHP: 12,
    },
    weight: 15
  },
  {
    item: {
      type: "item",
      isCollectable: true,
    },
    weight: 5
  },
  {
    item: {
      type: "chest",
      isCollectable: true,
    },
    weight: 10
  },
  {
    item: {
      type: "trap",
      isCollectable: true,
    },
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
  console.log(`Setting ${gameObject.type} in ${x},${y}`);
  currentState[x][y] = gameObject;
}

function updatePlayerPosition() {
  setGameObjectPosition(currentPosition.x, currentPosition.y, player);
}

if (matrixSize > 0) {
  updatePlayerPosition();
}

function drawCard(gameObject, x, y){
  switch(gameObject.type) {
    case "player":
      imagem(imgPlayer, x + imgAdjustment.x, y + imgAdjustment.y, imgAdjustment.size)
      text(gameObject.HP, x + 150, y + 200)
      break;
    case "enemy":
      imagem(imgHollow, x + imgAdjustment.x, y + imgAdjustment.y, imgAdjustment.size)
      text(gameObject.HP, x + 150, y + 200)
      break;
    default:
      text(gameObject.type, x + 6, y + 70)
      break;
  }
}

function drawMatrix(initialPosX = initialTablePosX, initialPosY = initialTablePosY, padding = initialPaddingValue) {
  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      x = ((w + padding) * (i)) + initialPosX;
      y = ((h + padding) * ((j))) + initialPosY;
      rect(x, y, w, h, 15);
      drawCard(currentState[i][j], x, y);
    }
  }
  if (!shownDebug) {
    showDebug();
  }
  shownDebug = true;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
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
  let toBeSpawned = { ...gameObjects[i].item };
  if (toBeSpawned.minHP !== undefined, toBeSpawned.maxHP !== undefined) {
    toBeSpawned.HP = randomIntFromInterval(toBeSpawned.minHP, toBeSpawned.maxHP);
  }
  return toBeSpawned;
}

function showDebug() {
  console.log("player", currentPosition);
}

function move(direction) {
  const previousPosition = currentPosition;
  switch (direction) {
    case "up":
      for (let i = 0; i <= previousPosition.y + 1; i++) {
        // Para todas as casas na direção oposta que jogador estar, estas devem se mover na direção do jogador
        if (previousPosition.y + i == matrixSize - 1) {
          // Se estiver na borda do tabuleiro
          if (currentState[previousPosition.y + i] !== undefined) {
            setGameObjectPosition(previousPosition.x, previousPosition.y + i, spawn_random());
          }
        } else {
          // Se não move o anterior pra casa atual
          if (currentState[previousPosition.y + i] !== undefined) {
            setGameObjectPosition(previousPosition.x, previousPosition.y + i, currentState[previousPosition.x][previousPosition.y + (i + 1)]);
          }
        }
      }
      currentPosition.y -= 1;
      break;
    case "down":
      for (let i = 0; i <= previousPosition.y + 1; i++) {
        // Para todas as casas na direção oposta que jogador estar, estas devem se mover na direção do jogador
        if (previousPosition.y - i == 0) {
          // Se estiver na borda do tabuleiro
          if (currentState[previousPosition.y - i] !== undefined) {
            setGameObjectPosition(previousPosition.x, previousPosition.y - i, spawn_random());
          }
        } else {
          // Se não move o anterior pra casa atual
          if (currentState[previousPosition.y - i] !== undefined) {
            setGameObjectPosition(previousPosition.x, previousPosition.y - i, currentState[previousPosition.x][previousPosition.y - (i + 1)]);
          }
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
          // Pegar o que está na posição alvo
          let target = currentState[currentPosition.x][currentPosition.y - 1];
          console.log(target);
          move("up");
        }
        break;
      case DOWN_ARROW:
        if (currentPosition.y < matrixSize - 1){
          let target = currentState[currentPosition.x][currentPosition.y + 1];
          console.log(target);
          move("down");
        }
        break;
      case LEFT_ARROW:
        if (currentPosition.x > 0){
          let target = currentState[currentPosition.x - 1][currentPosition.y];
          console.log(target);
          move("left");
        }
        break;
      case RIGHT_ARROW:
        if (currentPosition.x < matrixSize - 1){
          let target = currentState[currentPosition.x + 1][currentPosition.y];
          console.log(target);
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