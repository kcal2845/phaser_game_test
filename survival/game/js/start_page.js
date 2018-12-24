function StartPage(){
  var background;
  var StartButton;
  var StartButtonText;
  var CreditButton;
  var CreditButtonText

  var StartButtonOnClicked = function(){
    game.state.start('Game');
  }
  var CreditButtonOnClicked = function(){
    
  }
  this.create = function(){
    // 배경
    background = game.add.sprite(0,0,'title_screen');
    background.width = game.scale.width;
    background.height =game.scale.height;

    //버튼
    StartButton = game.add.button(game.world.centerX,game.world.centerY-52+140,
      'title_button',StartButtonOnClicked,this,1,2,0);
    StartButton.anchor.set(0.5);
    StartButton.scale.setTo(5);
    StartButtonText = game.add.text(StartButton.centerX,StartButton.centerY+5,'게임 시작',
    {font:"40px Ariel", fill:"#ffffff",align:"center"});
    StartButtonText.stroke = '#4C4C4C';
    StartButtonText.strokeThickness = 10;
    StartButtonText.anchor.set(0.5);

    CreditButton = game.add.button(game.world.centerX,game.world.centerY+52+140,
      'title_button',CreditButtonOnClicked,this,1,2,0)
    CreditButton.anchor.set(0.5);
    CreditButton.scale.setTo(5);
    CreditButtonText = game.add.text(CreditButton.centerX,CreditButton.centerY+5,'크레딧',
    {font:"40px Ariel", fill:"#ffffff",align:"center"});
    CreditButtonText.stroke = '#4C4C4C';
    CreditButtonText.strokeThickness = 10;
    CreditButtonText.anchor.set(0.5);
  }
}
