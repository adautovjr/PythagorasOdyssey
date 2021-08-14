const TELAS = {
  MENU: 0,
  JOGO: 1,
  COMOJOGAR: 2,
  CREDITOS: 3
}

const MENU_OPTIONS = {
  FIRST: TELAS.JOGO,
  LAST: TELAS.CREDITOS
}

//Declaração de variáveis globais gerais
var telaAtual = TELAS.JOGO;

//Declaração de variáveis globais de imagens
var vdFundoInicial, imgFundoJogo, imgAviao, imgLogo, imgCreditos;
var largCanvas = 1000, altCanvas = largCanvas * 9 / 16;

// Definições dos botões do menu principal
var largBtnMenu = 300, altBtnMenu = 40,
  xBtnMenu = largCanvas / 2 - largBtnMenu / 2,
  yBtnMenu = altCanvas / 2 + 40,
  focoBtnMenu = 0;

//Variáveis do avião
xAviao = 238, yAviao = 130;

/*Essa variável vai determinar quando algumas funções, textos, imagens
ou que for devem aparecer no momento que estamos desenvolvendo o jogo*/
var debug = true;

function desenhaAviao() {
  imagem(imgAviao, xAviao, yAviao, 0.25);

  //Verificação de movimentação do avião
  if (keyIsPressed) {
    if (keyCode == UP_ARROW) {
      //Tecla para cima
      yAviao -= 1;
    }
    if (keyCode == DOWN_ARROW) {
      //Tecla para baixo
      yAviao += 1;
    }
    if (keyCode == LEFT_ARROW) {
      //Tecla para esquerda
      xAviao -= 1;
    }
    if (keyCode == RIGHT_ARROW) {
      //Tecla para direita
      xAviao += 1;
    }
  }
}

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

function desenhaBotao(x, y, texto, func, foco) {
  push()
  stroke('#c83737')
  strokeWeight(3)
  if (focoBtnMenu == foco) {
    fill(61, 112, 201, 100); //Pinta o foco do botão
    yAviao = y - 20;
  } else {
    fill(255, 255, 255, 100);
  }
  if (mouseX >= x &&
    mouseX <= x + largBtnMenu &&
    mouseY >= y &&
    mouseY <= y + altBtnMenu) {
    focoBtnMenu = foco;
    if (mouseIsPressed && mouseButton == LEFT) {
      //Se o mouse estiver pressionado
      func();
    }
  } else {

  }
  rect(x, y, largBtnMenu, altBtnMenu);
  pop()

  push()
  textAlign(CENTER);
  textSize(32);
  text(texto, largCanvas / 2, y + 30);
  pop()
}

function mostraCoordenadas() {
  push()
  textSize(25)
  text('(mouseX,mouseY) = (' + mouseX.toFixed(1) + ',' + mouseY.toFixed(1) + ')', 5, 25);
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
  //   vdFundoInicial = createVideo(['imagens/bgtelaAtualInicial.mp4']);
  //   vdFundoInicial.hide();
  imgFundoJogo = loadImage('assets/background.png');
  //   imgAviao = loadImage('imagens/Fly (1).png');
  imgLogo = loadImage('assets/logoJogo.png');
  //   imgCreditos = loadImage('imagens/telaAtualCreditos.svg');
}

function setup() {
  createCanvas(largCanvas, altCanvas);
  //   vdFundoInicial.loop();
}

function draw() {
  background(127)

  switch (telaAtual) {
    //telaAtual do Menu
    case 0:
      Menu.draw();
      break;
    case 1:
      Jogo.draw();
      break;
    case 2:
      ComoJogar.draw();
      break;
    case 3:
      Creditos.draw();
      break;
    default:
      Menu.draw();
      break;
  }

  if (debug) {
    mostraCoordenadas();
    textSize(32);
    text(focoBtnMenu, 9, 55);
  }

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
    default:
      Menu.handleInput();
      break;
  }
}