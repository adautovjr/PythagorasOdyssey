const DEATH_SENTENCE = 'Pitágoras falhou miseralmente';
let scoreText = "Sua pontuação: ";
let highscoreText = "Melhor pontuação: ";
const TelaDeMorte = {
  draw(){
    scoreText = `Sua pontuação: ${player.score}`;
    highscoreText = `Melhor pontuação: ${player.highscore}`;
    image(imgFundoJogo, 0, 0, largCanvas, altCanvas);
    push();
    textSize(40);
    text(DEATH_SENTENCE, (largCanvas / 2) - (textWidth(DEATH_SENTENCE) / 2), (altCanvas / 2) - 200);
    textSize(32);
    text(scoreText, (largCanvas / 2) - (textWidth(scoreText) / 2), (altCanvas / 2) - 100);
    text(highscoreText, (largCanvas / 2) - (textWidth(highscoreText) / 2), (altCanvas / 2) - 0);
    pop();
    desenhaBotao(xBtnMenu, yBtnMenu + 150, 'Reiniciar', reloadGame, 1);
  }
}

function reloadGame() {
  window.location.reload();
}