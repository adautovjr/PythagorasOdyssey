const DEATH_SENTENCE = 'Pitágoras falhou miseralmente';

const TelaDeMorte = {
  draw(){
    image(imgFundoJogo, 0, 0, largCanvas, altCanvas);
    push();
    textSize(25);
    text(DEATH_SENTENCE, (largCanvas / 2) - (textWidth(DEATH_SENTENCE) / 2), (altCanvas / 2) - 200);
    pop();
    desenhaBotao(xBtnMenu, yBtnMenu + 150, 'Reiniciar', reloadGame, 1);
  }
}

function reloadGame() {
  window.location.reload();
}