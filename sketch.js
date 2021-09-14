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

//Declaração de variáveis globais gerais
var telaAtual = TELAS.MENU;
var justClicked = false;
var isHoveringButton = false;
const FULLSCREEN_KEY = "@PYTHAGORAS_ODYSSEY:fullscreen";

//Declaração de variáveis globais de imagens
var imgFundoMenu, imgFundoJogo, imgCreditos, imgComoJogar, imgPlayer, imgHollow, 
    cardPlayer, cardHollow, cardItem, cardChest, imgFormas = {};
const largCanvas = 1920, altCanvas = largCanvas * 9 / 16;

// Definições dos botões do menu principal
var largBtnMenu = 300, altBtnMenu = 40,
  xBtnMenu = largCanvas / 2 - largBtnMenu / 2,
  yBtnMenu = altCanvas / 2 + 190,
  focoBtnMenu = 0;

//Variáveis do avião
xAviao = 238, yAviao = 130;

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

function desenhaBotao(x, y, texto, func, foco, fillColor = false) {
  push()
  stroke('#3d0055')
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
    isHoveringButton = true;
    cursor("pointer");
    focoBtnMenu = foco;
    if (!justClicked && mouseIsPressed && mouseButton == LEFT) {
      justClicked = true;
      //Se o mouse estiver pressionado
      func();
      setTimeout(function(){
        justClicked = false;
      }, 3000);
    }
  } else {
    if (!isHoveringButton) {
      cursor(CROSS);
    }
  }
  rectMode(CORNER)
  rect(x, y, largBtnMenu, altBtnMenu);
  pop()

  push()
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(61, 0 , 85);
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

const FORMAS = [
  "cilindro",
  "circulo",
  "cone",
  "cubo",
  "elipse",
  "hexagono",
  "losango",
  "paralelepipedo",
  "pentagono",
  "prisma",
  "quadrado",
  "retangulo",
  "triangulo"
];

function preload() {
  imgFundoMenu = loadImage('assets/background-menu.png');
  imgFundoJogo = loadImage('assets/background.png');
  imgComoJogar = loadImage('assets/comojogar.png');
  imgCreditos = loadImage('assets/creditos.png');
  imgPlayer = loadImage('assets/player.png');
  imgHollow = loadImage('assets/hollowzin.png');
  cardPlayer = loadImage('assets/card-player.png');
  cardHollow = loadImage('assets/card-hollows.png');
  cardItem = loadImage('assets/card-itens.png');
  cardChest = loadImage('assets/card-bau.png');
  heartHealthy = loadImage('assets/coracao-player.png');
  heartHollow = loadImage('assets/coracao-hollow.png');
  for (let i = 0; i < FORMAS.length; i++) {
    const forma = FORMAS[i];
    imgFormas[forma] = loadImage(`assets/challenge/${forma}.png`)
  }
}

function setup() {
  createCanvas(largCanvas, altCanvas);
  //   vdFundoInicial.loop();
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
  date.setTime(date.getTime()+(daysToExpire*60*1000));
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

document.addEventListener("DOMContentLoaded", function() {
  if (!debug && getCookie(FULLSCREEN_KEY) !== 'true'){
    setTimeout(() => {
      createCookie(FULLSCREEN_KEY, true, 1);
      alert("Esse jogo será melhor experienciado em tela cheia. Aperte F11 para abrir em tela cheia.")
    }, 100);
  }
});