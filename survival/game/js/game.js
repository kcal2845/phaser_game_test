var Game = function(){
  var GameSettings = function(){
    // 설정
    Map_Width           = 2000;
    Map_Height          = 1200;
    Player_Walk_Speed   = 200;
    Player_Run_Speed    = 400;
    Player_HP           = 100;
    Bullet_PerSeconds_handgun = 5;
    Bullet_PerSeconds_rifle   = 15;
    Bullet_PerSeconds_shotgun = 1.3;
    ReloadTime_handgun = 2000;
    ReloadTime_rifle   = 500;
    ReloadTime_shotgun = 1000;
    MagazineRounds_handgun = 15;
    MagazineRounds_rifle = 30;
    MagazineRounds_shotgun = 6;
    BulletDamage_handgun  = 1;
    BulletDamage_rifle    = 2;
    BulletDamage_shotgun  = 10;
    BulletSpeed           = 3000;
    ZombieSpeed           = 50;
    ZombieAttackDamage = 10;
  }

  GameSettings(); //게임 설정 상수

  this.create = function(){
    CreateMap();
    CreatePlayer();
    CreateZombies();
    for(var i=0;i<20;i++){
      SpawnZombie();
    }
  }
  this.update = function(){
    PlayerUpdate();
    ZombieUpdate();
    CollideUpdate();
    GameUI();
  }
  this.render = function(){

    game.debug.text(player.U_currentweaponname,32,32);
    game.debug.text('HP : ' + player.U_hp,80+32,32);
    game.debug.text('총알 :' + player.U_magazine[player.U_currentweapon],160+32,32);
    game.debug.text('WASD 키로 움직임,shift 키로 달리기, 마우스 클릭으로 쏘기, 1,2,3,4 키로 무기 변경, R 버튼으로 재장전',32,64);

    /*
    game.debug.body(player);
    game.debug.physicsGroup(zombies);
    game.debug.physicsGroup(bullets[shotgun]);
    game.debug.physicsGroup(bullets[handgun]);
    game.debug.physicsGroup(bullets[rifle]);
    game.debug.physicsGroup(zombiesattack);
    */
  };

  var CreateMap = function(){
    game.add.tileSprite(0,0,Map_Width,Map_Height,'background');
    game.world.setBounds(0,0,Map_Width,Map_Height);
  }
  var CreatePlayer = function(){
    // 플레이어 스프라이트
    player = game.add.sprite(game.world.centerX,game.world.centerY,'survivor-idle_handgun');
    player.animations.add('survivor-idle_handgun',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],15,true);
    player.animations.play('survivor-idle_handgun');
    player.scale.set(0.5);
    player.anchor.set(0.3,0.6);

    // 플레이어 다리 스프라이트
    playerfeet = game.add.sprite(player.x,player.y,'survivor-feet');
    playerfeet.animations.add('survivor-feet',[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,0,1,2,3,4],15,true);
    playerfeet.anchor.set(0.4,0.6);
    playerfeet.scale.set(0.5);

    //플레이어 물리
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.setSize(150,150,40,40);

    // 플레이어 세팅
    player.U_hp = Player_HP;
    player.U_speed = 0;
    CreatePlayerWeapons();

    player.U_invincibletime = 0;

    game.camera.follow(player);
  }
  var CreatePlayerWeapons = function(){
    // 무기 생성
    knife   = 0;
    handgun = 1;
    rifle   = 2;
    shotgun = 3;

    //무기 설정
    Bullet_PerSeconds = []
    Bullet_PerSeconds[handgun] = Bullet_PerSeconds_handgun;
    Bullet_PerSeconds[rifle] = Bullet_PerSeconds_rifle;
    Bullet_PerSeconds[shotgun] = Bullet_PerSeconds_shotgun;

    ReloadTime = []
    ReloadTime[handgun] = ReloadTime_handgun
    ReloadTime[rifle] = ReloadTime_rifle
    ReloadTime[shotgun] = ReloadTime_shotgun

    MagazineRounds = []
    MagazineRounds[handgun] = MagazineRounds_handgun
    MagazineRounds[rifle] = MagazineRounds_rifle
    MagazineRounds[shotgun] = MagazineRounds_shotgun

    BulletDamage = []
    BulletDamage[handgun] = BulletDamage_handgun
    BulletDamage[rifle] = BulletDamage_rifle
    BulletDamage[shotgun] = BulletDamage_shotgun

    // 총알 생성
    bullets = [];
    bullets[handgun] = game.add.group();
    bullets[handgun].enableBody = true;
    bullets[handgun].physicsBodyType = Phaser.Physics.ARCADE;
    for(var i = 0; i < 50; i++){
      var b = bullets[handgun].create(0,0,'bullet_handgun');
      b.U_damage = BulletDamage[handgun];
      b.exists = false;
      b.visible = false;
      b.checkWorldBounds = true;
      b.events.onOutOfBounds.add(Kill_Bullet,this);
      b.body.setSize(0,0,0,0);
    }
    bullets[rifle] = game.add.group();
    bullets[rifle].enableBody = true;
    bullets[rifle].physicsBodyType = Phaser.Physics.ARCADE;
    for(var i = 0; i < 50; i++){
      var b = bullets[rifle].create(0,0,'bullet_rifle');
      b.U_damage = BulletDamage[rifle];
      b.exists = false;
      b.visible = false;
      b.checkWorldBounds = true;
      b.events.onOutOfBounds.add(Kill_Bullet,this);
      b.body.setSize(0,0,0,0);
    }

    bullets[shotgun] = game.add.group();
    bullets[shotgun].enableBody = true;
    bullets[shotgun].physicsBodyType = Phaser.Physics.ARCADE;
    for(var i = 0; i < 50; i++){
      var b = bullets[shotgun].create(0,0,'bullet_shotgun');
      b.U_damage = BulletDamage[shotgun];
      b.exists = false;
      b.visible = false;
      b.checkWorldBounds = true;
      b.events.onOutOfBounds.add(Kill_Bullet,this);
      b.body.setSize(0,0,0,0);
    }

    player.U_currentweapon = handgun;
    player.U_currentweaponname = 'handgun';

    // 무기 초기화
    player.U_weaponinven = []
    player.U_weaponinven[knife]   = true;
    player.U_weaponinven[handgun] = true;
    player.U_weaponinven[rifle]   = true;
    player.U_weaponinven[shotgun] = true;
    // 장전
    player.U_magazine=[]
    player.U_magazine[handgun] = MagazineRounds[handgun];
    player.U_magazine[rifle] = MagazineRounds[rifle];
    player.U_magazine[shotgun] = MagazineRounds[shotgun];
    // 무기 재장전 시간 타이머
    player.U_gunreadytime = [];
    player.U_gunreadytime[handgun] = 0;
    player.U_gunreadytime[rifle] = 0;
    player.U_gunreadytime[shotgun] = 0;

    player.U_gunstate = [];
    player.U_gunstate[handgun] = 'ready'
    player.U_gunstate[rifle]   = 'ready'
    player.U_gunstate[shotgun] = 'ready'
  }

  var PlayerUpdate = function(){
    if(player.exists){
      PlayerInput();
      PlayerShoot();
      PlayerState();
      PlayerAnimations();
    }
  }
  var PlayerInput = function(){
    player.rotation = game.physics.arcade.angleToPointer(player);
    player.body.setSize(180,180,-5+40*Math.cos(player.rotation),20+40*Math.sin(player.rotation));

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    if(key_shift.isDown){
      player.U_speed = Player_Run_Speed;
    }else{
      player.U_speed = Player_Walk_Speed;
    }
    if(key_a.isDown){
        player.body.velocity.x = -player.U_speed;
    }else if(key_d.isDown){
      player.body.velocity.x = player.U_speed;
    }
    if(key_w.isDown){
      player.body.velocity.y = -player.U_speed;
    }else if(key_s.isDown){
      player.body.velocity.y = player.U_speed;
    }

    // 무기
    if(key_1.isDown){
      ChangeWeapon(knife);
    }else if(key_2.isDown){
      ChangeWeapon(handgun);
    }else if(key_3.isDown){
      ChangeWeapon(rifle);
    }else if(key_4.isDown){
      ChangeWeapon(shotgun);
    }
    switch (player.U_currentweapon){
      case knife:player.U_currentweaponname = 'knife';break;
      case rifle:player.U_currentweaponname = 'rifle';break;
      case handgun:player.U_currentweaponname = 'handgun';break;
      case shotgun:player.U_currentweaponname = 'shotgun';break;
    }
  }
  var PlayerShoot = function(){
    // 사격 준비
    if(game.time.now >= player.U_gunreadytime[player.U_currentweapon]){
      player.U_gunstate[player.U_currentweapon] = 'ready';
    }

    // 재장전
    if(key_r.isDown&&player.U_gunstate[player.U_currentweapon]!='reload'){
      player.U_gunstate[player.U_currentweapon] = 'reload'
      player.U_magazine[player.U_currentweapon] = MagazineRounds[player.U_currentweapon];
      player.U_gunreadytime[player.U_currentweapon] = game.time.now + ReloadTime[player.U_currentweapon];
    }

    if(game.input.activePointer.leftButton.isDown && player.U_gunstate[player.U_currentweapon] == 'ready' && player.U_magazine[player.U_currentweapon] > 0){
      switch(player.U_currentweapon){
        case handgun :
          var b = bullets[player.U_currentweapon].getFirstExists(false);
          if (b)
          {
            b.rotation = player.rotation;
            b.reset(player.x+130*Math.cos(b.rotation), player.y+130*Math.sin(b.rotation));
            b.body.setSize(15,15,-7,-7);
            b.body.velocity.x = 3000*Math.cos(b.rotation);
            b.body.velocity.y = 3000*Math.sin(b.rotation);

            player.U_gunreadytime[player.U_currentweapon] = game.time.now + 1/Bullet_PerSeconds[handgun]*1000;
            player.U_gunstate[player.U_currentweapon] = "fire";
            player.U_magazine[player.U_currentweapon] -= 1;
          };
          break;

        case rifle :
          var b = bullets[player.U_currentweapon].getFirstExists(false);
          if (b)
          {
            b.rotation = player.rotation;
            b.reset(player.x+130*Math.cos(b.rotation), player.y+130*Math.sin(b.rotation));
            b.body.setSize(15,15,-7,-7);
            b.body.velocity.x = 3000*Math.cos(b.rotation);
            b.body.velocity.y = 3000*Math.sin(b.rotation);

            player.U_gunreadytime[player.U_currentweapon] = game.time.now + 1/Bullet_PerSeconds[rifle]*1000;
            player.U_gunstate[player.U_currentweapon] = "fire";
            player.U_magazine[player.U_currentweapon] -= 1;
          };
          break;

        case shotgun :
        var b = bullets[player.U_currentweapon].getFirstExists(false);
        if (b)
        {
          b.rotation = player.rotation;
          b.reset(player.x+130*Math.cos(b.rotation), player.y+130*Math.sin(b.rotation));
          b.body.setSize(15,15,-7,-7);
          b.body.velocity.x = 3000*Math.cos(b.rotation);
          b.body.velocity.y = 3000*Math.sin(b.rotation);
        };
        var b = bullets[player.U_currentweapon].getFirstExists(false);
        if (b)
        {
          b.rotation = player.rotation;
          b.angle -=2;
          b.reset(player.x+130*Math.cos(b.rotation), player.y+130*Math.sin(b.rotation));
          b.body.setSize(15,15,-7,-7);
          b.body.velocity.x = 3000*Math.cos(b.rotation);
          b.body.velocity.y = 3000*Math.sin(b.rotation);
        };
        var b = bullets[player.U_currentweapon].getFirstExists(false);
        if (b)
        {
          b.rotation = player.rotation;
          b.angle +=2;
          b.reset(player.x+130*Math.cos(b.rotation), player.y+130*Math.sin(b.rotation));
          b.body.setSize(15,15,-7,-7);
          b.body.velocity.x = 3000*Math.cos(b.rotation);
          b.body.velocity.y = 3000*Math.sin(b.rotation);
        };

        player.U_gunreadytime[player.U_currentweapon] = game.time.now + 1/Bullet_PerSeconds[shotgun]*1000;
        player.U_gunstate[player.U_currentweapon] = "fire";
        player.U_magazine[player.U_currentweapon] -= 1;
        break;

      }
    }
  }
  var PlayerAnimations = function(){
    player.bringToTop();

    if(player.U_gunstate[player.U_currentweapon] == 'fire'){
      if(player.key !== 'survivor-shoot_'+player.U_currentweaponname){
          player.loadTexture('survivor-shoot_'+player.U_currentweaponname,0,false);
          player.animations.add('survivor-shoot_'+player.U_currentweaponname,[1,2,0],30,false);
      }
      if(game.time.now > player.U_gunreadytime[player.U_currentweapon]-1/Bullet_PerSeconds[player.U_currentweapon]*1000 && game.time.now < player.U_gunreadytime[player.U_currentweapon]-1/Bullet_PerSeconds[player.U_currentweapon]*1000+100){
          player.animations.play('survivor-shoot_'+player.U_currentweaponname);
      }
    }else if(player.U_currentweapon == knife && game.input.activePointer.leftButton.isDown){
      if(player.key !== 'survivor-meleeattack_knife'){
        player.loadTexture('survivor-meleeattack_knife',0,false);
        player.animations.add('survivor-meleeattack_knife',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],30,false);
        player.animations.play('survivor-meleeattack_knife');
      }
    }else if(player.U_gunstate[player.U_currentweapon] == 'reload'&& player.U_currentweapon != knife){
      if(player.key !== 'survivor-reload_'+player.U_currentweaponname){
        player.loadTexture('survivor-reload_'+player.U_currentweaponname,0,false);
        switch(player.U_currentweapon){
          case handgun: var reloadframe = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];break;
          case rifle:   var reloadframe = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];break;
          case shotgun: var reloadframe = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];break;
        }
        player.animations.add('survivor-reload_'+player.U_currentweaponname,reloadframe,reloadframe.length/(ReloadTime[player.U_currentweapon]/1000)*(10/6),false);
        player.animations.play('survivor-reload_'+player.U_currentweaponname);
      }
    }else if(player.body.velocity.x != 0 || player.body.velocity.y != 0 ){
      if(player.key !== 'survivor-move_'+player.U_currentweaponname){
        player.loadTexture('survivor-move_'+player.U_currentweaponname,0,false);
        player.animations.add('survivor-move_'+player.U_currentweaponname,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],30,true);
        player.animations.play('survivor-move_'+player.U_currentweaponname);
      }
    }else{
      if(player.key !== 'survivor-idle_'+player.U_currentweaponname){ //idle
        player.loadTexture('survivor-idle_'+player.U_currentweaponname,0,false);
        player.animations.add('survivor-idle_'+player.U_currentweaponname,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],15,true);
        player.animations.play('survivor-idle_'+player.U_currentweaponname);
      }
    }

    // 스프라이트 중심 조정
    if(player.key == 'survivor-meleeattack_knife'){
      player.anchor.set(0.27,0.45)
    }else if(player.key == 'survivor-shoot_handgun'){
      player.anchor.set(0.3,0.62)
    }else {
      player.anchor.set(0.3,0.6)
    }

    // 다리 스프라이트
    playerfeet.x = player.x;
    playerfeet.y = player.y;
    playerfeet.rotation = game.physics.arcade.angleToPointer(playerfeet);
    if(player.body.velocity.x != 0 || player.body.velocity.y != 0 ){
      playerfeet.animations.play('survivor-feet');
    }else{
      playerfeet.animations.stop();
      playerfeet.frame = 5;
    }
  }
  var PlayerState = function(){
    if(player.U_hp <= 0){
      player.U_hp = 0;
      player.kill();
      playerfeet.kill();
    }
    if(player.U_invincibletime > game.time.now){
      player.alpha = 0.5;
      playerfeet.alpha = 0.5;
    }else{
      player.alpha = 1;
      playerfeet.alpha = 1;
    }
  }

  var CreateZombies = function(){
    zombies = game.add.group();
    zombies.enableBody = true;
    zombies.physicsBodyType = Phaser.Physics.ARCADE;

    zombiesattack = game.add.group();
    zombiesattack.enableBody = true;
    zombies.physicsBodyType = Phaser.Physics.ARCADE;
  }
  var SpawnZombie = function(){
    var z = zombies.create(game.world.randomX, game.world.randomY, 'zombie-move');
    z.animations.add('zombie-move',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],30,true);
    z.animations.play('zombie-move');
    z.anchor.set(0.5);
    z.scale.set(0.5);
    z.angle = Math.random()*360-180;
    z.body.immovable = true;
    z.body.setSize(200,200,40,50);

    z.U_hp = 10;
    z.U_attack = zombiesattack.create(0,0,'');
    z.U_attack.body.setSize(0,0,0,0);
    z.U_attackreadytime = 0;
    z.U_state = 'move';
  }

  var ZombieUpdate = function(){
    zombies.forEachAlive(ZombieBehave,this);
    zombies.forEachAlive(ZombieState,this);
    zombies.forEachAlive(ZombieAnimations,this);
  }

  var ZombieState = function(z){
    if(z.U_hp<=0){
      z.U_hp =0;
      z.U_attack.destroy();
      z.destroy();
    }
  }

  var ZombieBehave = function(z){
    if(z.exists){
      z.rotation = game.physics.arcade.angleBetween(z,player);
      if(player.exists){
        if(Phaser.Math.distance(z.x,z.y,player.x,player.y) < 100){
          z.U_state = 'idle';
          z.body.velocity.x = 0;
          z.body.velocity.y = 0;
          if(game.time.now > z.U_attackreadytime){
            z.U_state = 'attack';
          }
        }else{
          z.U_state = 'move';
          var speed = ZombieSpeed;
          z.body.velocity.x = speed*Math.cos(z.rotation);
          z.body.velocity.y = speed*Math.sin(z.rotation);
        }

        if(z.U_state == 'attack'){
          z.U_attack.reset(z.x+30*Math.cos(z.rotation),z.y+30*Math.sin(z.rotation));
          z.U_attack.body.setSize(100,100,-50,-50);
        }else{
          z.U_attack.reset(0,0);
          z.U_attack.body.setSize(0,0,0,0);
        }
      }else{
        z.U_state = 'idle'
        z.body.velocity.x = 0;
        z.body.velocity.y = 0;
      }
    }
  }

  var ZombieAnimations = function(z){
    if(z.U_state == 'idle'){
      if(z.key !== 'zombie-idle'){
        z.loadTexture('zombie-idle',0,false);
        z.animations.add('zombie-idle',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],30,true);
        z.animations.play('zombie-idle');
      }
    }else if(z.U_state == 'move'){
      if(z.key !== 'zombie-move'){
        z.loadTexture('zombie-move',0,false);
        z.animations.add('zombie-move',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],30,true);
        z.animations.play('zombie-move');
      }
    }else if(z.U_state == 'attack'){
      if(z.key !== 'zombie-attack'){
        z.loadTexture('zombie-attack',0,false);
        z.animations.add('zombie-attack',[0,1,2,3,4,5,6,7,8],30,true);
        z.animations.play('zombie-attack');
      }
    }
  }

  var CollideUpdate = function(){
    game.physics.arcade.overlap(player, zombiesattack, ZombiesAttackCollisionHandler, null, this);
    game.physics.arcade.overlap(bullets[handgun], zombies, BulletsCollisionHandler, null, this);
    game.physics.arcade.overlap(bullets[rifle], zombies, BulletsCollisionHandler, null, this);
    game.physics.arcade.overlap(bullets[shotgun], zombies, BulletsCollisionHandler, null, this);
  }
  var ZombiesAttackCollisionHandler = function(p,z){
    if(p.exists && z.exists){
      if(game.time.now>=p.U_invincibletime){
        p.U_hp -= ZombieAttackDamage;
        p.U_invincibletime = game.time.now + 500;
      }
    }
  }
  var BulletsCollisionHandler = function(b,e){
    if(b.exists && e.exists){
      e.U_hp -= b.U_damage;
      e.x += 5*Math.cos(b.rotation);
      e.y += 5*Math.sin(b.rotation);
      Kill_Bullet(b);
    }
  }

  var EnemySpawn = function(){

  }
  var GameUI = function(){

  }

  // 기타 함수들
  var ChangeWeapon = function(weapon){
    if(player.U_currentweapon != weapon && player.U_weaponinven[player.U_currentweapon]){
      player.U_currentweapon = weapon;
    }
  }
  var Kill_Bullet = function(bullet){
    bullet.x = 0;
    bullet.y = 0;
    bullet.kill();
  }
}
