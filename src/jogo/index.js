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
          cardAdjustment: {
            x: -25,
            y: -12,
            size: 0.4
          },
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
let cardAdjustment = initialValues().gameObject.cardAdjustment;1
let showChallenge = false;

const MINIGAMES = {
  OPERACOES: 1,
  GEOMETRIA: 2,
  ORDENACAO: 3
}

let bespokeMinigame = MINIGAMES.OPERACOES;
let minigameInfo = {};

const GAME_OBJECT_TYPES = {
  PLAYER: "player",
  ENEMY: "enemy",
  ITEM: "item",
  CHEST: "chest",
  TRAP: "trap"
}

let player = {
  type: GAME_OBJECT_TYPES.PLAYER,
  isCollectable: false,
  HP: 10
}

let gameObjects = [
  {
    item: {
      type: GAME_OBJECT_TYPES.ENEMY,
      isCollectable: false,
      minHP: 1,
      maxHP: 6,
    },
    weight: 15
  },
  {
    item: {
      type: GAME_OBJECT_TYPES.ITEM,
      isCollectable: true,
      minHP: 3,
      maxHP: 8,
    },
    weight: 5
  },
  {
    item: {
      type: GAME_OBJECT_TYPES.CHEST,
      isCollectable: true,
    },
    weight: 10
  },
  // {
  //   item: {
  //     type: GAME_OBJECT_TYPES.TRAP,
  //     isCollectable: true,
  //   },
  //   weight: 5
  // }
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

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
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
    case GAME_OBJECT_TYPES.PLAYER:
      imagem(cardPlayer, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      imagem(imgPlayer, x + imgAdjustment.x, y + imgAdjustment.y, imgAdjustment.size)
      imagem(heartHealthy, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      fill('#fff');
      textSize(24);
      text(gameObject.HP, x + 160 - (textWidth(gameObject.HP) / 2), y + 18)
      break;
    case GAME_OBJECT_TYPES.ENEMY:
      imagem(cardHollow, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      imagem(imgHollow, x + imgAdjustment.x, y + imgAdjustment.y, imgAdjustment.size)
      imagem(heartHollow, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      fill('#fff');
      textSize(24);
      text(gameObject.HP, x + 160 - (textWidth(gameObject.HP) / 2), y + 18)
      break;
    case GAME_OBJECT_TYPES.ITEM:
      // imagem(imgHollow, x + imgAdjustment.x, y + imgAdjustment.y, imgAdjustment.size)
      imagem(cardItem, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      text(gameObject.type, x + 6, y + 70)
      imagem(heartHealthy, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      fill('#fff');
      textSize(24);
      text(gameObject.HP, x + 160 - (textWidth(gameObject.HP) / 2), y + 18)
      break;
    case GAME_OBJECT_TYPES.CHEST:
      // imagem(imgHollow, x + imgAdjustment.x, y + imgAdjustment.y, imgAdjustment.size)
      imagem(cardChest, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      text(gameObject.type, x + 6, y + 70)
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
      // rect(x, y, w, h, 15);
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
  console.log(GAME_OBJECT_TYPES.PLAYER, currentPosition);
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

function handleInteraction(target) {
  let valid = target.isCollectable;
  switch(target.type){
    case GAME_OBJECT_TYPES.ENEMY:
      valid = player.HP > target.HP 
      if (valid) {
        player.HP -= target.HP;
      }
      break;
    case GAME_OBJECT_TYPES.ITEM:
      player.HP += target.HP;
      break;
    case GAME_OBJECT_TYPES.CHEST:
      minigameInfo = generateChallenge();
      break;
    }
    return valid;
}

let operacoes = [
  "+",
  "-",
  "*",
  "/",
];

function getOperacaoAnswer(inputA, operacao, inputB) {
  switch(operacao){
    case "+":
      return inputA + inputB;
    case "-":
      return inputA - inputB;
    case "*":
      return inputA * inputB;
    case "/":
      return inputA / inputB;
  }
}

let answersArray = [];

function getUniqueAnswer(input) {
  let result = randomIntFromInterval(input - 5, input + 5);
  while (answersArray.includes(result)) {
    result = randomIntFromInterval(input - 5, input + 5);
  }
  answersArray.push(result);
  return result;
}

function generateChallenge() {
  showChallenge = true;
  answersArray = [];
  switch(bespokeMinigame) {
    case MINIGAMES.OPERACOES:
      let inputA = randomIntFromInterval(1, 10);
      let inputB = randomIntFromInterval(1, 10);
      let operacao = operacoes[randomIntFromInterval(0, 3)]
      let result = getOperacaoAnswer(inputA, operacao, inputB);
      answersArray.push(result);
      let minigameInfo = {
        question: {
          inputA,
          inputB,
          operacao
        },
        answer: {
          right: result,
          wrongA: getUniqueAnswer(result),
          wrongB: getUniqueAnswer(result),
          wrongC: getUniqueAnswer(result)
        }
      }
      answersArray.sort(() => Math.random() - 0.5)
      return minigameInfo;
  }
}

function drawChallenge() {
  if (!showChallenge) return;
  rectMode(CENTER)
  rect(largCanvas / 2, altCanvas / 2, 1200, 800)
  switch(bespokeMinigame) {
    case MINIGAMES.OPERACOES:
      let questionText = `Quanto dá essa conta: ${minigameInfo.question.inputA} ${minigameInfo.question.operacao} ${minigameInfo.question.inputB}?`;
      fill("#000");
      text(
        questionText,
        (largCanvas / 2) - (textWidth(questionText) / 2), 
        (altCanvas / 2) - 200
      )
      
      text(
        answersArray[0],
        (largCanvas / 2) - (textWidth(questionText) / 2) - 200, 
        (altCanvas / 2) + 50
      )
      
      text(
        answersArray[1],
        (largCanvas / 2) - (textWidth(questionText) / 2) + 200, 
        (altCanvas / 2) + 50
      )
      
      text(
        answersArray[2],
        (largCanvas / 2) - (textWidth(questionText) / 2) - 200, 
        (altCanvas / 2) + 250
      )

      text(
        answersArray[3],
        (largCanvas / 2) - (textWidth(questionText) / 2) + 200, 
        (altCanvas / 2) + 250
      )
      break;
  }
}

const Jogo = {
  draw() {
    background(imgFundoJogo);
    drawMatrix();
    drawChallenge();
    //desenhaBotao(xBtnMenu, yBtnMenu + 150, 'Voltar', funcBtnMenu, 1);
  },
  handleInput() {
    switch (keyCode) {
      case UP_ARROW:
        if (currentPosition.y > 0){
          // Pegar o que está na posição alvo
          let target = currentState[currentPosition.x][currentPosition.y - 1];
          if (handleInteraction(target)){
            move("up");
          } else {
            telaAtual = TELAS.TELADEMORTE
          }
        }
        break;
      case DOWN_ARROW:
        if (currentPosition.y < matrixSize - 1){
          let target = currentState[currentPosition.x][currentPosition.y + 1];
          if (handleInteraction(target)){
            move("down");
          } else {
            telaAtual = TELAS.TELADEMORTE
          }
        }
        break;
      case LEFT_ARROW:
        if (currentPosition.x > 0){
          let target = currentState[currentPosition.x - 1][currentPosition.y];
          if (handleInteraction(target)){
            move("left");
          } else {
            telaAtual = TELAS.TELADEMORTE
          }
        }
        break;
      case RIGHT_ARROW:
        if (currentPosition.x < matrixSize - 1){
          let target = currentState[currentPosition.x + 1][currentPosition.y];
          if (handleInteraction(target)){
            move("right");
          } else {
            telaAtual = TELAS.TELADEMORTE
          }
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