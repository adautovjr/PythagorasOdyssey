const matrixSize = 3;

let shownDebug = false;
let x = 0, y = 0, w = 100, h = 120;

let gameObjects = [
  {
    item: "Enemy",
    weight: 15
  }, {
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
    currentState[i][j] = weighted_random(gameObjects);
  }
}

let currentPosition = {
  x: Math.floor(matrixSize / 2) + (matrixSize % 2 == 0 ? 0 : 1),
  y: Math.floor(matrixSize / 2) + (matrixSize % 2 == 0 ? 0 : 1)
}

function updatePlayerPosition(){
  currentState[currentPosition.x - 1][currentPosition.y - 1] = "player";
}

updatePlayerPosition();

function drawMatrix(initialPosX = 315, initialPosY = 100, padding = 10) {
  for (let i = 1; i <= matrixSize; i++) {
    for (let j = 1; j <= matrixSize; j++) {
      x = ((w + padding) * (i - 1)) + initialPosX;
      y = ((h + padding) * ((j - 1))) + initialPosY;
      rect(x, y, w, h, 15);
      text(currentState[i-1][j-1], x + 15, y + 15);
    }
  }
  if (!shownDebug) {
    showDebug();
  }
  shownDebug = true;
}

function weighted_random(options) {
  var i;

  var weights = [];

  for (i = 0; i < options.length; i++)
    weights[i] = options[i].weight + (weights[i - 1] || 0);

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++)
    if (weights[i] > random)
      break;

  return options[i].item;
}

function showDebug() {
  console.table(currentState);
  console.log(currentPosition);
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
        currentPosition.y -= 1;
        break;
      case DOWN_ARROW:
        currentPosition.y += 1;
        break;
      case LEFT_ARROW:
        currentPosition.x -= 1;
        break;
      case RIGHT_ARROW:
        currentPosition.x += 1;
        break;
      default:
        console.log(keyCode);
        break;
    }
    updatePlayerPosition();
    console.log(currentPosition);
  }
}