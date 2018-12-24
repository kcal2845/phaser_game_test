function Credit(){
  var BacktoMenuClicked = function(){
    game.state.start('StartPage');
  }
  this.create = function(){
    // 배경
    background = game.add.sprite(0,0,'credit_screen');
    background.width = game.scale.width;
    background.height =game.scale.height;

    var BacktoMenuButton = game.add.button(game.world.centerX,700,
      'title_button',BacktoMenuClicked,this,1,2,0);
    BacktoMenuButton.anchor.set(0.5);
    BacktoMenuButton.scale.setTo(5);
    var BacktoMenuButtonText = game.add.text(BacktoMenuButton.centerX,BacktoMenuButton.centerY+5,'메뉴로 돌아가기',
    {font:"40px Ariel", fill:"#ffffff",align:"center"});
    BacktoMenuButtonText.stroke = '#4C4C4C';
    BacktoMenuButtonText.strokeThickness = 10;
    BacktoMenuButtonText.anchor.set(0.5);
  }
}
