const matrixSize = 3;

const initialValues = function () {
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
          cardAdjustment: {
            x: -25,
            y: -12,
            size: 0.4
          },
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
          cardAdjustment: {
            x: -25,
            y: -12,
            size: 0.4
          },
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
          cardAdjustment: {
            x: -25,
            y: -12,
            size: 0.4
          },
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
  }
}

let shownDebug = false;
let movimentos = 0;
let initialTablePosX = initialValues().x, initialTablePosY = initialValues().y, initialPaddingValue = initialValues().padding;
let x = 0, y = 0, w = initialValues().cardWidth, h = initialValues().cardHeight;
let imgAdjustment = initialValues().gameObject.imgAdjustment;
let cardAdjustment = initialValues().gameObject.cardAdjustment; 1
let showChallenge = false, showAnswer = false, usingTheorem = false, canAnswerChallenge = false;
let theoremPoints = [], selectedGameObjects = {}, lastReward = {};

const DIRECTIONS = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
}

const MINIGAMES = {
  OPERACOES: 1,
  GEOMETRIA: 2,
  ORDENACAO: 3
}

const HIGHSCORE_KEY = '@PYTHAGORAS_ODYSSEY:highscore';

const OPERACOES = [
  "+",
  "-",
  "*",
  "/",
];

const TECLAS = {
  W: 87,
  S: 83,
  A: 65,
  D: 68,
}

const MIN_FLOAT_FOR_MINIGAME = -50;
const MAX_FLOAT_FOR_MINIGAME = 50;

let bespokeMinigame = MINIGAMES.ORDENACAO;
let minigameInfo = {};

const GAME_OBJECT_TYPES = {
  PLAYER: "player",
  ENEMY: "enemy",
  HEAL: "heal",
  CHEST: "chest",
  POTION: "potion",
  THEOREM: "theorem",
  TRAP: "trap"
}

let player = {
  id: makeid(30),
  type: GAME_OBJECT_TYPES.PLAYER,
  isCollectable: false,
  HP: 10,
  theorems: 2,
  potions: 6,
  score: 0,
  highscore: localStorage.getItem(HIGHSCORE_KEY) ?? 0
}

let gameObjects = [
  {
    item: {
      type: GAME_OBJECT_TYPES.ENEMY,
      isCollectable: false,
      minHP: 1,
      maxHP: 6,
    },
    weight: 35
  },
  {
    item: {
      type: GAME_OBJECT_TYPES.HEAL,
      isCollectable: true,
      minHP: 3,
      maxHP: 8,
    },
    weight: 10
  },
  {
    item: {
      type: GAME_OBJECT_TYPES.POTION,
      isCollectable: true,
      minHP: 1,
      maxHP: 4,
    },
    weight: 6
  },
  {
    item: {
      type: GAME_OBJECT_TYPES.CHEST,
      isCollectable: true,
    },
    weight: 6
  },
  {
    item: {
      type: GAME_OBJECT_TYPES.THEOREM,
      isCollectable: true,
    },
    weight: 1
  }
  // {
  //   item: {
  //     type: GAME_OBJECT_TYPES.TRAP,
  //     isCollectable: true,
  //   },
  //   weight: 5
  // }
];

let rewards = [
  {
    item: {
      type: GAME_OBJECT_TYPES.HEAL,
      minHP: 3,
      maxHP: 8,
    },
    weight: 10
  },
  {
    item: {
      type: GAME_OBJECT_TYPES.POTION,
      minHP: 3,
      maxHP: 8,
    },
    weight: 8
  },
  {
    item: {
      type: GAME_OBJECT_TYPES.THEOREM,
    },
    weight: 3
  }
]

var currentState = [];
for (var i = 0; i < matrixSize; i++) {
  currentState[i] = [];
  for (var j = 0; j < matrixSize; j++) {
    currentState[i][j] = spawnRandom();
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

function makeid(length) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function drawCard(gameObject, x, y) {
  textSize(24);
  fill('#fff');
  switch (gameObject.type) {
    case GAME_OBJECT_TYPES.PLAYER:
      imagem(assets.cardPlayer, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      imagem(assets.imgPlayer, x + imgAdjustment.x, y + imgAdjustment.y, imgAdjustment.size)
      imagem(assets.heartHealthy, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      text(gameObject.HP, x + 160 - (textWidth(gameObject.HP) / 2), y + 18)
      break;
    case GAME_OBJECT_TYPES.ENEMY:
      imagem(assets.cardHollow, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      imagem(assets.imgHollow, x + imgAdjustment.x, y + imgAdjustment.y, imgAdjustment.size)
      imagem(assets.heartHollow, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      text(gameObject.HP, x + 160 - (textWidth(gameObject.HP) / 2), y + 18)
      break;
    case GAME_OBJECT_TYPES.HEAL:
    case GAME_OBJECT_TYPES.POTION:
      imagem(assets.cardItem, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      text(gameObject.type, x + 70, y + 90)
      imagem(assets.heartHealthy, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      text(gameObject.HP, x + 160 - (textWidth(gameObject.HP) / 2), y + 18)
      break;
    case GAME_OBJECT_TYPES.THEOREM:
    case GAME_OBJECT_TYPES.CHEST:
      imagem(assets.cardChest, x + cardAdjustment.x, y + cardAdjustment.y, cardAdjustment.size)
      text(gameObject.type, x + 70, y + 90)
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
      currentState[i][j] = { 
        ...currentState[i][j],
        position: {
          i,
          j,
        },
        cardPosition: {
          x: x + cardAdjustment.x + 40,
          y: y + cardAdjustment.y + 6,
          w: 160,
          h: 230
        }
      }
      if (currentState[i][j].type == GAME_OBJECT_TYPES.PLAYER) {
        currentState[i][j] = {
          ...currentState[i][j],
          ...player 
        };
      }
    }
  }
  if (!shownDebug) {
    showDebug();
  }
  shownDebug = true;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomFloatFromInterval(min, max, decimalPlaces = 2) {  
  let rand = Math.random() * (max - min) + min;
  let power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

function spawnRandom() {
  var i;
  var weights = [];

  for (i = 0; i < gameObjects.length; i++)
    weights[i] = gameObjects[i].weight + (weights[i - 1] || 0);

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++)
    if (weights[i] > random)
      break;
  let toBeSpawned = { ...gameObjects[i].item, id: makeid(20) };
  if (toBeSpawned.minHP !== undefined, toBeSpawned.maxHP !== undefined) {
    toBeSpawned.HP = randomIntFromInterval(toBeSpawned.minHP, toBeSpawned.maxHP);
  }
  return toBeSpawned;
}

function spawnReward() {
  var i;
  var weights = [];

  for (i = 0; i < rewards.length; i++)
    weights[i] = rewards[i].weight + (weights[i - 1] || 0);

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++)
    if (weights[i] > random)
      break;
  let toBeSpawned = { ...rewards[i].item };
  if (toBeSpawned.minHP !== undefined, toBeSpawned.maxHP !== undefined) {
    toBeSpawned.HP = randomIntFromInterval(toBeSpawned.minHP, toBeSpawned.maxHP);
  }
  return toBeSpawned
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
            setGameObjectPosition(previousPosition.x, previousPosition.y + i, spawnRandom());
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
            setGameObjectPosition(previousPosition.x, previousPosition.y - i, spawnRandom());
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
            setGameObjectPosition(previousPosition.x - i, previousPosition.y, spawnRandom());
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
            setGameObjectPosition(previousPosition.x + i, previousPosition.y, spawnRandom());
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
  switch (target.type) {
    case GAME_OBJECT_TYPES.ENEMY:
      valid = player.HP > target.HP
      if (valid) {
        player.HP -= target.HP;
      }
      break;
    case GAME_OBJECT_TYPES.HEAL:
      player.HP += target.HP;
      break;
    case GAME_OBJECT_TYPES.POTION:
      player.potions += target.HP;
      break;
    case GAME_OBJECT_TYPES.THEOREM:
      player.theorems += 1;
      break;
    case GAME_OBJECT_TYPES.CHEST:
      minigameInfo = generateChallenge();
      break;
  }
  return valid;
}

function getOperacaoAnswer(inputA, operacao, inputB) {
  let result;
  switch (operacao) {
    case "+":
      result = inputA + inputB;
      break;
    case "-":
      result = inputA - inputB;
      break;
    case "*":
      result = inputA * inputB;
      break;
    case "/":
      result = inputA / inputB;
      break;
  }
  return result;
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

function getUniqueFormaGeometrica() {
  let result = Object.keys(FORMAS)[randomIntFromInterval(0, Object.keys(FORMAS).length - 1)];
  while (answersArray.includes(result)) {
    result = Object.keys(FORMAS)[randomIntFromInterval(0, Object.keys(FORMAS).length - 1)];
  }
  answersArray.push(result);
  return result;
}

function getUniqueFloatAnswer() {
  let result = randomFloatFromInterval(MIN_FLOAT_FOR_MINIGAME, MAX_FLOAT_FOR_MINIGAME, randomIntFromInterval(1, 5));
  while (answersArray.includes(result)) {
    result = randomFloatFromInterval(MIN_FLOAT_FOR_MINIGAME, MAX_FLOAT_FOR_MINIGAME, randomIntFromInterval(1, 5));
  }
  answersArray.push(result);
  return result;
}

function generateChallenge() {
  bespokeMinigame = randomIntFromInterval(1, 3);
  showChallenge = true;
  canAnswerChallenge = false;
  answersArray = [];
  let result;
  switch (bespokeMinigame) {
    case MINIGAMES.OPERACOES:
      let inputA = randomIntFromInterval(1, 10);
      let inputB = randomIntFromInterval(1, 10);
      let operacao = OPERACOES[randomIntFromInterval(0, OPERACOES.length - 1)];
      result = getOperacaoAnswer(inputA, operacao, inputB);
      answersArray.push(result);
      minigameInfo = {
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
    case MINIGAMES.GEOMETRIA:
      minigameInfo = {
        question: {
          text: "Que figura geométrica é essa?"
        },
        answer: {
          right: getUniqueFormaGeometrica(),
          wrongA: getUniqueFormaGeometrica(),
          wrongB: getUniqueFormaGeometrica(),
          wrongC: getUniqueFormaGeometrica()
        }
      }
      answersArray.sort(() => Math.random() - 0.5)
      return minigameInfo;
    case MINIGAMES.ORDENACAO:
      minigameInfo = {
        question: {
          actual: randomIntFromInterval(0, 1) == 1 ? "bigger" : "smaller",
          biggerText: "Qual o maior número?",
          smallerText: "Qual o menor número?",
        },
        answer: {
          A: getUniqueFloatAnswer(),
          B: getUniqueFloatAnswer(),
          C: getUniqueFloatAnswer(),
          D: getUniqueFloatAnswer(),
          right: false
        }
      }
      answersArray.sort((a, b) => a - b)
      minigameInfo.answer.right = minigameInfo.question.actual == "bigger" ? answersArray[answersArray.length - 1] : answersArray[0];
      answersArray.sort(() => Math.random() - 0.5)
      answersArray.sort(() => Math.random() - 0.5)
      answersArray.sort(() => Math.random() - 0.5)
      return minigameInfo;
  }
}

function drawChallenge() {
  if (!showChallenge) return;
  setTimeout(() => {
    canAnswerChallenge = true;
  }, 200);
  rectMode(CENTER)
  fill("#000000cc")
  rect(largCanvas / 2, altCanvas / 2, largCanvas, altCanvas)
  fill("#ffffffcc")
  rect(largCanvas / 2, altCanvas / 2, 1200, 800)
  let questionText = "";
  switch (bespokeMinigame) {
    case MINIGAMES.OPERACOES:
      questionText = `Quanto dá essa conta: ${minigameInfo.question.inputA} ${minigameInfo.question.operacao} ${minigameInfo.question.inputB}?`;
      fill("#000");
      textSize(40);
      text(
        questionText,
        (largCanvas / 2) - (textWidth(questionText) / 2),
        (altCanvas / 2) - 300
      )

      textSize(24);
      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) - 200,
        (altCanvas / 2) + 50,
        answersArray[0].toFixed(2).replace(/[.,]00$/, ""),
        () => handleAnswer(0),
        0,
        showAnswer
        ? (answersArray[0] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) + 200,
        (altCanvas / 2) + 50,
        answersArray[1].toFixed(2).replace(/[.,]00$/, ""),
        () => handleAnswer(1),
        1,
        showAnswer
        ? (answersArray[1] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) - 200,
        (altCanvas / 2) + 250,
        answersArray[2].toFixed(2).replace(/[.,]00$/, ""),
        () => handleAnswer(2),
        2,
        showAnswer
        ? (answersArray[2] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) + 200,
        (altCanvas / 2) + 250,
        answersArray[3].toFixed(2).replace(/[.,]00$/, ""),
        () => handleAnswer(3),
        3,
        showAnswer
        ? (answersArray[3] == minigameInfo.answer.right ? "green" : "red")
        : false
      )
      break;
    case MINIGAMES.GEOMETRIA:
      questionText = minigameInfo.question.text;
      fill("#000");
      textSize(40);
      text(
        questionText,
        (largCanvas / 2) - (textWidth(questionText) / 2),
        (altCanvas / 2) - 300
      )

      imagem(assets.imgFormas[minigameInfo.answer.right], (largCanvas / 2) - 105, (altCanvas / 2) - 230, 1)

      textSize(24);
      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) - 200,
        (altCanvas / 2) + 50,
        answersArray[0],
        () => handleAnswer(0),
        0,
        showAnswer
        ? (answersArray[0] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) + 200,
        (altCanvas / 2) + 50,
        answersArray[1],
        () => handleAnswer(1),
        1,
        showAnswer
        ? (answersArray[1] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) - 200,
        (altCanvas / 2) + 250,
        answersArray[2],
        () => handleAnswer(2),
        2,
        showAnswer
        ? (answersArray[2] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) + 200,
        (altCanvas / 2) + 250,
        answersArray[3],
        () => handleAnswer(3),
        3,
        showAnswer
        ? (answersArray[3] == minigameInfo.answer.right ? "green" : "red")
        : false
      )
      break;
    case MINIGAMES.ORDENACAO:
      questionText = minigameInfo.question[`${minigameInfo.question.actual}Text`];
      fill("#000");
      textSize(40);
      text(
        questionText,
        (largCanvas / 2) - (textWidth(questionText) / 2),
        (altCanvas / 2) - 300
      )

      textSize(24);
      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) - 200,
        (altCanvas / 2) + 50,
        answersArray[0],
        () => handleAnswer(0),
        0,
        showAnswer
        ? (answersArray[0] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) + 200,
        (altCanvas / 2) + 50,
        answersArray[1],
        () => handleAnswer(1),
        1,
        showAnswer
        ? (answersArray[1] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) - 200,
        (altCanvas / 2) + 250,
        answersArray[2],
        () => handleAnswer(2),
        2,
        showAnswer
        ? (answersArray[2] == minigameInfo.answer.right ? "green" : "red")
        : false
      )

      desenhaBotao(
        (largCanvas / 2) - (textWidth(questionText) / 2) + 200,
        (altCanvas / 2) + 250,
        answersArray[3],
        () => handleAnswer(3),
        3,
        showAnswer
        ? (answersArray[3] == minigameInfo.answer.right ? "green" : "red")
        : false
      )
      break;
  }
  if (showAnswer) {
    drawCard(lastReward, largCanvas / 2 - 100, altCanvas / 2 - 230);
  }
}

function handleReward(gameObject) {
  lastReward = gameObject;
  switch (gameObject.type) {
    case GAME_OBJECT_TYPES.HEAL:
      player.HP += gameObject.HP;
      break;
    case GAME_OBJECT_TYPES.POTION:
      player.potions += gameObject.HP;
      break;
    case GAME_OBJECT_TYPES.THEOREM:
      player.theorems += 1;
      break;
  }
  player.score++;
}

function handleAnswer(id) {
  if (!canAnswerChallenge){
    return;
  }
  showAnswer = true;
  handleReward(answersArray[id] == minigameInfo.answer.right ? spawnReward() : {});

  setTimeout(function(){
    showChallenge = false;
    showAnswer = false;
  }, 2000)
}

function useTheorem() {
  if (!usingTheorem) {
    usingTheorem = true;
    player.theorems -= 1;
  }
}

function usePotions() {
  if (!usingTheorem) {
    player.HP += player.potions;
    player.potions = 0;
  }
}

function drawHUD(){
  if (player.theorems > 0) {
    desenhaBotao(
      (largCanvas / 8),
      (altCanvas / 2),
      `Usar teorema (${player.theorems})`,
      () => useTheorem(),
      5,
      false,
      "Desenhe um triângulo para trocar a posição de 3 cartas."
    );
  }
  if (player.potions > 0) {
    desenhaBotao(
      (largCanvas / 1.4),
      (altCanvas / 2),
      `Curar (${player.potions}) de HP`,
      () => usePotions(),
      6
    );
  }
  if (player.score > 0) {
    let scoreText = `Movimentos: ${player.score}`;
    textSize(40)
    text(
      scoreText,
      (largCanvas / 2) - (textWidth(scoreText) / 2),
      (altCanvas / 2) - 380
    )
  }
  drawLines();
}

function drawLines() {
  push();
  stroke(ROXO);
  strokeWeight(10);
  if (usingTheorem === true) {
    // draw the lines between the points
    for (var i=0; i < theoremPoints.length-1; ++i) {
      line(theoremPoints[i][0], theoremPoints[i][1], theoremPoints[i+1][0], theoremPoints[i+1][1]);
    }

    var close = theoremPoints.length == 3;
    if (close) {
      // draw line from 1st point to at point
      line(theoremPoints[theoremPoints.length-1][0], theoremPoints[theoremPoints.length-1][1], theoremPoints[0][0], theoremPoints[0][1]); 
    } else if (theoremPoints.length > 0) {
      // draw a rubber line from last point to the mouse
      line(theoremPoints[theoremPoints.length-1][0], theoremPoints[theoremPoints.length-1][1], mouseX,mouseY); 
    }
  }
  pop();
}

function drawTooltips() {
  if (!showTooltip) {
    return
  }
  let x = mouseX + 20;
  let y = mouseY + 30;
  push()
  strokeWeight(3)
  stroke(ROXO)
  rect(x, y, 300, 100)
  pop()

  push()
  fill(ROXO)
  text(showTooltip, x + 5, y + 5, 295)
  pop()
}

function getClickedCard(){
  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      if (mouseX >= currentState[i][j].cardPosition.x &&
        mouseX <= currentState[i][j].cardPosition.x + currentState[i][j].cardPosition.w &&
        mouseY >= currentState[i][j].cardPosition.y &&
        mouseY <= currentState[i][j].cardPosition.y + currentState[i][j].cardPosition.h) {
        return currentState[i][j]
      }
    }
  }
  return undefined;
}

function swapCards(cards){
  return new Promise((resolve) =>{
    currentState[cards[2].position.i][cards[2].position.j] = cards[1];
    currentState[cards[1].position.i][cards[1].position.j] = cards[0];
    currentState[cards[0].position.i][cards[0].position.j] = cards[2];
    setTimeout(()=> {
      resolve();
    }, 50);
  })
}

function handleSwap(){
  let cards = Object.values(selectedGameObjects);
  if(Object.keys(selectedGameObjects).length !== 3){
    return;
  }
  swapCards(cards).then(() => {
    cards.forEach(card => {
      if (card.type == GAME_OBJECT_TYPES.PLAYER){
        for (let i = 0; i < matrixSize; i++) {
          for (let j = 0; j < matrixSize; j++) {
            if (currentState[i][j].type == GAME_OBJECT_TYPES.PLAYER){
              currentPosition = {
                x: currentState[i][j].position.i,
                y: currentState[i][j].position.j
              }
            }
          }
        }
      }
    });
  });
  selectedGameObjects = {};
}

function handleMovementAttempt(direction){
  let target = {};
  switch (direction){
    case DIRECTIONS.UP:
      target = currentState[currentPosition.x][currentPosition.y - 1];
      break;
    case DIRECTIONS.DOWN:
      target = currentState[currentPosition.x][currentPosition.y + 1];
      break;
    case DIRECTIONS.LEFT:
      target = currentState[currentPosition.x - 1][currentPosition.y];
      break;
    case DIRECTIONS.RIGHT:
      target = currentState[currentPosition.x + 1][currentPosition.y];
      break;
  }
  player.score++;
  if (handleInteraction(target)) {
    move(direction);
    updatePlayerPosition();
    console.log(currentPosition);
  } else {
    if (player.score > player.highscore) {
      player.highscore = player.score;
      localStorage.setItem(HIGHSCORE_KEY, player.score);
    }
    telaAtual = TELAS.TELADEMORTE
  }
}

const Jogo = {
  draw() {
    background(assets.imgFundoJogo);
    drawMatrix();
    drawHUD();
    drawChallenge();
    drawTooltips();
  },
  handleMouse() {
    if (usingTheorem === true && theoremPoints.length < 3) {
      let selectedCard = getClickedCard();
      if (selectedCard !== undefined && !Object.keys(selectedGameObjects).includes(selectedCard.id)) {
        selectedGameObjects[selectedCard.id] = selectedCard;
        theoremPoints.push([mouseX, mouseY])
        if(Object.keys(selectedGameObjects).length == 3){
          setTimeout(function(){
            usingTheorem = false;
            handleSwap();
            theoremPoints = [];
          }, 500);
        }
      }
    } else if (!showChallenge) {
      let selectedCard = getClickedCard();
      if (selectedCard !== undefined) {
        if (
          selectedCard.position.j < currentPosition.y && 
          selectedCard.position.j - currentPosition.y == -1 &&
          selectedCard.position.i == currentPosition.x
        ) {
          handleMovementAttempt(DIRECTIONS.UP);
        } else if (
          selectedCard.position.j > currentPosition.y && 
          selectedCard.position.j - currentPosition.y == 1 &&
          selectedCard.position.i == currentPosition.x
        ) {
          handleMovementAttempt(DIRECTIONS.DOWN);
        } else if (
          selectedCard.position.i < currentPosition.x && 
          selectedCard.position.i - currentPosition.x == -1 &&
          selectedCard.position.j == currentPosition.y
        ) {
          handleMovementAttempt(DIRECTIONS.LEFT);
        } else if (
          selectedCard.position.i > currentPosition.x && 
          selectedCard.position.i - currentPosition.x == 1 &&
          selectedCard.position.j == currentPosition.y
        ) {
          handleMovementAttempt(DIRECTIONS.RIGHT);
        }
      }
    }
  },
  handleInput() {
    if (usingTheorem) {
      return;
    }
    console.log(keyCode);
    switch (keyCode) {
      case UP_ARROW:
      case TECLAS.W:
        if (!showChallenge) {
          if (currentPosition.y > 0) {
            handleMovementAttempt(DIRECTIONS.UP);
          }
        }
        break;
      case DOWN_ARROW:
      case TECLAS.S:
        if (!showChallenge) {
          if (currentPosition.y < matrixSize - 1) {
            handleMovementAttempt(DIRECTIONS.DOWN);
          }
        }
        break;
      case LEFT_ARROW:
      case TECLAS.A:
        if (!showChallenge) {
          if (currentPosition.x > 0) {
            handleMovementAttempt(DIRECTIONS.LEFT);
          }
        }
        break;
      case RIGHT_ARROW:
      case TECLAS.D:
        if (!showChallenge) {
          if (currentPosition.x < matrixSize - 1) {
            handleMovementAttempt(DIRECTIONS.RIGHT);
          }
        }
        break;
      case ESCAPE:
        if (!showChallenge) {
          telaAtual = TELAS.MENU;
        } else {
          showChallenge = false;
        }
        break;
      default:
        console.log(keyCode);
        break;
    }
  }
}