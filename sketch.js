const TELAS = {
  MENU: 0,
  JOGO: 1,
  COMOJOGAR: 2,
  CREDITOS: 3,
  TELADEMORTE: 666
}

const MENU_OPTIONS = {
  FIRST: TELAS.JOGO,
  LAST: TELAS.CREDITOS
}

var canvas;

// Declaração de variáveis globais gerais
var telaAtual = debug ? TELAS.JOGO : TELAS.MENU;
var justClicked = false, isHoveringButton = false, showTooltip = false, lastBtnHovered = true;
const FULLSCREEN_KEY = "@PYTHAGORAS_ODYSSEY:fullscreen";
const IMAGES_KEY = "@PYTHAGORAS_ODYSSEY:assets";
const SETTINGS_KEY = "@PYTHAGORAS_ODYSSEY:settings";

let playerSettings = {
  music: {
    amp: 0.0625
  },
  sound: {
    amp: 0.125
  }
}

const SOUND_EFFECTS = {
  BACKGROUND_MUSIC: "backgroundMusic",
  BTN_HOVER: "btnHover",
  CONFIRMATION: "confirmation",
  CORRECT_ANSWER: "correctAnswer",
  WRONG_ANSWER: "wrongAnswer",
  MOVE_SOUND: "moveSound",
  GAME_OVER: "gameOver",
  LASER: "laser"
}

const FORMAS = {
  "cilindro": "Cilíndro",
  "circulo": "Círculo",
  "cone": "Cone",
  "cubo": "Cubo",
  "elipse": "Elipse",
  "hexagono": "Hexágono",
  "losango": "Losango",
  "paralelepipedo": "Paralelepípedo",
  "pentagono": "Pentágono",
  "prisma": "Prisma",
  "quadrado": "Quadrado",
  "retangulo": "Retângulo",
  "triangulo": "Triângulo"
};

//Declaração de variáveis globais de imagens
var assets = {};
const largCanvas = 1920, altCanvas = largCanvas * 9 / 16;
const ROXO = '#3d0055';

// Definições dos botões do menu principal
var largBtnMenu = 300, altBtnMenu = 40,
  xBtnMenu = largCanvas / 2 - largBtnMenu / 2,
  yBtnMenu = altCanvas / 2 + 190,
  focoBtnMenu = 0;

/*Essa variável vai determinar quando algumas funções, textos, imagens
ou que for devem aparecer no momento que estamos desenvolvendo o jogo*/
var debug = false;

function funcBtnMenu(){
  telaAtual = TELAS.MENU;
}

function funcBtnIniciarJogo() {
  telaAtual = TELAS.JOGO;
}

function funcBtnComoJogar() {
  telaAtual = TELAS.COMOJOGAR;
}

function funcBtnCreditos() {
  telaAtual = TELAS.CREDITOS;
}

function desenhaBotao(x, y, texto, func, foco, fillColor = false, tooltip = false) {
  push()
  stroke(ROXO)
  strokeWeight(3)
  if (focoBtnMenu == foco) {
    fill(fillColor ? fillColor : '#ffffff'); //Pinta o foco do botão
  } else {
    fill(fillColor ? fillColor : "#ffffff");
  }
  if (
    mouseX >= x &&
    mouseX <= x + largBtnMenu &&
    mouseY >= y &&
    mouseY <= y + altBtnMenu
  ) {
    if (lastBtnHovered && texto != lastBtnHovered) {
      lastBtnHovered = texto;
      if (!assets.btnHover.isPlaying()){
        assets.btnHover.play();
      }
    }
    isHoveringButton = true;
    cursor("pointer");
    focoBtnMenu = foco;
    if (tooltip){
      showTooltip = tooltip;
    }
    if (!justClicked && mouseIsPressed && mouseButton == LEFT) {
      justClicked = true;
      //Se o mouse estiver pressionado
      handleSoundEffect(SOUND_EFFECTS.CONFIRMATION);
      func();
      setTimeout(function(){
        justClicked = false;
      }, 1000);
    }
  } else if (!isHoveringButton) {
    cursor(CROSS);
    showTooltip = false; 
  }
  rectMode(CORNER)
  rect(x, y, largBtnMenu, altBtnMenu);
  pop()

  push()
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(61, 0 , 85);
  if (Object.keys(FORMAS).includes(texto)) {
    texto = FORMAS[texto]
  }
  text(texto, x + (largBtnMenu / 2), y + (altBtnMenu / 2) + 2);
  pop()
}

function mostraCoordenadas() {
  push()
  textSize(25)
  text('(mouseX,mouseY) = (' + mouseX.toFixed(1) + ',' + mouseY.toFixed(1) + ')', 5, 130);
  pop()
}

function imagem(img, x, y, escala) {
  if(img == undefined) {
     return;
  }
  let larg = img.width;
  let alt = img.height;
  image(img, x, y, larg * escala, alt * escala);
}

function preload() {
  soundFormats('mp3', 'ogg');
  if (!localStorage.getItem(IMAGES_KEY)) {
    
    // Imgs
    assets["imgFundoMenu"] = loadImage('assets/background-menu.png');
    assets["imgFundoJogo"] = loadImage('assets/background.png');
    assets["imgComoJogar"] = loadImage('assets/comojogar.png');
    assets["imgCreditos"] = loadImage('assets/creditos.png');
    assets["imgPlayer"] = loadImage('assets/player.png');
    assets["imgHollow"] = loadImage('assets/hollowzin.png');
    assets["imgChest"] = loadImage('assets/bauzinho.png');
    assets["imgHeal"] = loadImage('assets/heal.png');
    assets["imgPotion"] = loadImage('assets/potion.png');
    assets["imgTheorem"] = loadImage('assets/teorema.png');
    assets["cardPlayer"] = loadImage('assets/card-player.png');
    assets["cardHollow"] = loadImage('assets/card-hollows.png');
    assets["cardItem"] = loadImage('assets/card-itens.png');
    assets["cardChest"] = loadImage('assets/card-bau.png');
    assets["heartHealthy"] = loadImage('assets/coracao-player.png');
    assets["heartHollow"] = loadImage('assets/coracao-hollow.png');
    
    // Audio
    assets[SOUND_EFFECTS.BACKGROUND_MUSIC] = loadSound('assets/audio/groovySaturday.ogg');
    assets[SOUND_EFFECTS.BTN_HOVER] = loadSound('assets/audio/btnHover.ogg');
    assets[SOUND_EFFECTS.CONFIRMATION] = loadSound('assets/audio/confirmation.ogg');
    assets[SOUND_EFFECTS.LASER] = loadSound('assets/audio/laser.ogg');
    assets[SOUND_EFFECTS.CORRECT_ANSWER] = loadSound('assets/audio/correctAnswer.ogg');
    assets[SOUND_EFFECTS.WRONG_ANSWER] = loadSound('assets/audio/wrongAnswer.ogg');
    assets[SOUND_EFFECTS.MOVE_SOUND] = loadSound('assets/audio/move.ogg');
    assets[SOUND_EFFECTS.GAME_OVER] = loadSound('assets/audio/gameOver.ogg');
    
    // Formas
    assets["imgFormas"] = [];
    for (let i = 0; i < Object.keys(FORMAS).length; i++) {
      const forma = Object.keys(FORMAS)[i];
      assets["imgFormas"][forma] = loadImage(`assets/challenge/${forma}.png`)
    }
    // localStorage.setItem(IMAGES_KEY, JSON.stringify(assets));
  } else {
    assets = JSON.parse(localStorage.getItem(IMAGES_KEY));
  }
}

function handleSoundEffect(tag) {
  switch (tag) {
    case SOUND_EFFECTS.BACKGROUND_MUSIC:
      if (!assets[tag].isLooping()) {
        assets[tag].loop(0, 1, playerSettings.music.amp);
      } else {
        assets[tag].stop();
      }
      break;
    case SOUND_EFFECTS.GAME_OVER:
      assets[tag].play(0, 1, playerSettings.music.amp);
      break;
    default:
      assets[tag].play(0, 1, playerSettings.sound.amp);
      break;
  }
}

function loadSettings() {
  let savedSettings = localStorage.getItem(SETTINGS_KEY);
  if (savedSettings) {
    playerSettings = JSON.parse(savedSettings);
  }
}

function saveSettings(obj = {}) {
  playerSettings = {
    ...playerSettings,
    ...obj
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(playerSettings));
}

function setup() {
  loadSettings();
  createCanvas(largCanvas, altCanvas);
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    handleSoundEffect(SOUND_EFFECTS.BACKGROUND_MUSIC);
  }, 10);
}

function draw() {
  background(127)

  switch (telaAtual) {
    //telaAtual do Menu
    case TELAS.MENU:
      Menu.draw();
      break;
    case TELAS.JOGO:
      Jogo.draw();
      break;
    case TELAS.COMOJOGAR:
      ComoJogar.draw();
      break;
    case TELAS.CREDITOS:
      Creditos.draw();
      break;
    case TELAS.TELADEMORTE:
      TelaDeMorte.draw();
      break;
    default:
      Menu.draw();
      break;
  }

  if (debug) {
    mostraCoordenadas();
    textSize(32);
    text(focoBtnMenu, 9, 170);
  }

  isHoveringButton = false;
}

function keyPressed() {
  switch (telaAtual) {
    //telaAtual do Menu
    case TELAS.MENU:
      Menu.handleInput();
      break;
    case TELAS.JOGO:
      // Do something
      break;
    case TELAS.COMOJOGAR:
      // Do something
      break;
    case TELAS.CREDITOS:
      // Do something
      break;
    case TELAS.TELADEMORTE:
      reloadGame();
      break;
    default:
      Menu.handleInput();
      break;
  }
}

function keyReleased() {
  switch (telaAtual) {
    //telaAtual do Menu
    case TELAS.MENU:
      // Do something
      break;
    case TELAS.JOGO:
      Jogo.handleInput();
      break;
    case TELAS.COMOJOGAR:
      // Do something
      break;
    case TELAS.CREDITOS:
      // Do something
      break;
    case TELAS.TELADEMORTE:
      reloadGame();
      break;
    default:
      Menu.handleInput();
      break;
  }
}

function mousePressed() {
  switch (telaAtual) {
    //telaAtual do Menu
    case TELAS.MENU:
      // Do something
      break;
    case TELAS.JOGO:
      Jogo.handleMouse();
      break;
    case TELAS.COMOJOGAR:
      // Do something
      break;
    case TELAS.CREDITOS:
      // Do something
      break;
    case TELAS.TELADEMORTE:
      // reloadGame();
      break;
    default:
      break;
  }
}

function createCookie(cookieName,cookieValue,daysToExpire){
  var date = new Date();
  date.setTime(date.getTime()+(daysToExpire*60*60*24*1000));
  document.cookie = cookieName + "=" + cookieValue + ";path=/; expires=" + date.toGMTString();
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name+'=; path=/; Max-Age=-99999999;';
}

function windowResized() {
  document.getElementById("defaultCanvas0").style.width  = `${windowWidth}px`;
  document.getElementById("defaultCanvas0").style.height = `${windowWidth * 9 / 16}px`;
}

document.addEventListener("DOMContentLoaded", function() {
  if (!debug && getCookie(FULLSCREEN_KEY) !== 'true'){
    setTimeout(() => {
      createCookie(FULLSCREEN_KEY, true, 1);
      alert("Esse jogo será melhor experienciado em tela cheia. Aperte F11 para abrir em tela cheia.");
    }, 100);
  }
});