const ComoJogar = {
  draw(){
    image(assets.imgComoJogar, 0, 0, largCanvas, altCanvas);
    desenhaBotao(xBtnMenu, yBtnMenu + 150, 'Voltar', funcBtnMenu, 1);
  }
}