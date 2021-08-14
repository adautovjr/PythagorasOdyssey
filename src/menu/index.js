const Menu = {
  draw(){
    image(imgFundoJogo, 0, 0, largCanvas, altCanvas);
    imagem(imgLogo, largCanvas / 2 - imgLogo.width * 0.35 / 2, 25, 0.35);

    desenhaBotao(xBtnMenu, yBtnMenu, 'Iniciar Jogo', funcBtnIniciarJogo, 1);
    desenhaBotao(xBtnMenu, yBtnMenu + 50, 'Como Jogar', funcBtnComoJogar, 2);
    desenhaBotao(xBtnMenu, yBtnMenu + 100, 'Créditos', funcBtnIniciarJogo, 3);

    // imagem(imgAviao, xAviao, yAviao, 0.25);
  },
  handleInput(){
    if (keyCode == DOWN_ARROW) {
      focoBtnMenu++;
    } else if (keyCode == UP_ARROW) {
      focoBtnMenu--;
    }
    if (focoBtnMenu < MENU_OPTIONS.FIRST) {
      focoBtnMenu = MENU_OPTIONS.LAST;
    } else if (focoBtnMenu > MENU_OPTIONS.LAST) {
      focoBtnMenu = MENU_OPTIONS.FIRST;
    }

    if (keyCode == ENTER) {
      switch (focoBtnMenu) {
        case TELAS.JOGO:
          funcBtnIniciarJogo();
          break;
        case TELAS.COMOJOGAR:
          funcBtnComoJogar();
          break;
        case TELAS.CREDITOS:
          funcBtnCreditos();
          break;
        default:
          alert("Error code: 0x0fd973hgd");
      }
    }
  }
}