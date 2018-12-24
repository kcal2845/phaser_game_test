function Boot(){
  this.preload = function(){
    var text = game.add.text(game.scale.width/2,game.scale.height/2,"Loading ...",{font : '30px Courier', fill: '#ffffff'});
    text.anchor.set(0.5);
    // background
    game.load.image('background','./game/images/background.jpg');

    // 총알
    game.load.image('bullet_handgun','./game/images/bullets/bullet_handgun.png');
    game.load.image('bullet_rifle','./game/images/bullets/bullet_rifle.png');
    game.load.image('bullet_shotgun','./game/images/bullets/bullet_shotgun.png');

    // 플레이어 스프라이트
    // feet
    game.load.spritesheet('survivor-feet','./game/images/player/survivor-feet.png',172,124);
    game.load.spritesheet('survivor-feet-run','./game/images/player/survivor-feet-run.png',204,124);
    // knife
    game.load.spritesheet('survivor-idle_knife'        ,'./game/images/player/survivor-idle_knife.png',289,224);
    game.load.spritesheet('survivor-meleeattack_knife' ,'./game/images/player/survivor-meleeattack_knife.png',328,300);
    game.load.spritesheet('survivor-move_knife'        ,'./game/images/player/survivor-move_knife.png',279,219);
    // handgun
    game.load.spritesheet('survivor-idle_handgun'      ,'./game/images/player/survivor-idle_handgun.png',253,216);
    game.load.spritesheet('survivor-move_handgun'      ,'./game/images/player/survivor-move_handgun.png',258,220);
    game.load.spritesheet('survivor-reload_handgun'    ,'./game/images/player/survivor-reload_handgun.png',260,230);
    game.load.spritesheet('survivor-shoot_handgun'     ,'./game/images/player/survivor-shoot_handgun.png',255,207);
    // rifle
    game.load.spritesheet('survivor-idle_rifle'        ,'./game/images/player/survivor-idle_rifle.png',313,207);
    game.load.spritesheet('survivor-move_rifle'        ,'./game/images/player/survivor-move_rifle.png',313,206);
    game.load.spritesheet('survivor-reload_rifle'      ,'./game/images/player/survivor-reload_rifle.png',322,217);
    game.load.spritesheet('survivor-shoot_rifle'       ,'./game/images/player/survivor-shoot_rifle.png',312,206);
    // shotgun
    game.load.spritesheet('survivor-idle_shotgun'      ,'./game/images/player/survivor-idle_shotgun.png',313,207);
    game.load.spritesheet('survivor-move_shotgun'      ,'./game/images/player/survivor-move_shotgun.png',313,206);
    game.load.spritesheet('survivor-reload_shotgun'    ,'./game/images/player/survivor-reload_shotgun.png',322,217);
    game.load.spritesheet('survivor-shoot_shotgun'     ,'./game/images/player/survivor-shoot_shotgun.png',312,206);

    // 좀비
    game.load.spritesheet('zombie-idle','./game/images/zombie/zombie-idle.png',242,222);
    game.load.spritesheet('zombie-move','./game/images/zombie/zombie-move.png',288,311);
    game.load.spritesheet('zombie-attack','./game/images/zombie/zombie-attack.png',318,294);

    // 타이틀 리소스
    game.load.spritesheet('title_button','./game/images/title_button.png',80,20);
    game.load.image('title_screen','./game/images/title_screen.png');
    // 사운드 로딩
  }

  this.create = function(){
    // 게임 세팅
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.state.start('StartPage');

    // 입력
    key_w = game.input.keyboard.addKey(Phaser.KeyCode.W);
    key_a = game.input.keyboard.addKey(Phaser.KeyCode.A);
    key_s = game.input.keyboard.addKey(Phaser.KeyCode.S);
    key_d = game.input.keyboard.addKey(Phaser.KeyCode.D);
    key_r = game.input.keyboard.addKey(Phaser.KeyCode.R);
    key_1 = game.input.keyboard.addKey(Phaser.KeyCode.ONE);
    key_2 = game.input.keyboard.addKey(Phaser.KeyCode.TWO);
    key_3 = game.input.keyboard.addKey(Phaser.KeyCode.THREE);
    key_4 = game.input.keyboard.addKey(Phaser.KeyCode.FOUR);
    key_shift = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);
  }
}
