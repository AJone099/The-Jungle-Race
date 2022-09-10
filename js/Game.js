class Game {
  constructor() {}

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    animal1 = createSprite(width / 2 - 50, height - 100);
    animal1.addImage(" animal1",  animal1_img);
    animal1.scale = 0.07;

    animal2 = createSprite(width / 2 + 100, height - 100);
    animal2.addImage(" animal2",  animal2_img);
    animal2.scale = 0.07;

    animals = [ animal1,  animal2];

    // C38 TA
    bush = new Group();
    grass = new Group();

    // Adding fuel sprite in the game
    this.addSprites(bush, 4, bushImage, 0.02);

    // Adding coin sprite in the game
    this.addSprites(grass, 18, grassImage, 0.09);
  }

  // C38 TA
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      x = random(width / 2 + 150, width / 2 - 150);
      y = random(-height * 4.5, height - 400);

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
  }

  play() {
    this.handleElements();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        animals[index - 1].position.x = x;
        animals[index - 1].position.y = y;

        // C38  SA
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.handleBush(index);
          this.handleGrass(index);

          // Changing camera position in y direction
         }
      }

      // handling keyboard events
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }

      drawSprites();
    }
  }

  handleBush(index) {
    // Adding fuel
    animals[index - 1].overlap(bush, function(collector, collected) {
      player.bush = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handleGrass(index){

     animals[index - 1].overlap(grass, function(collector, collected) {
       player.score += 21;
       player.update();
       collected.remove();
     });


  //   animals[index - 1].overlap(grass, function(collected, collector) {
  //     player.score += 21;
  //     player.update();
  //     collector.remove();
  //   });


  //   animals[index].overlap(grass, function(collector, collected) {
  //     player.score += 21;
  //     player.update();
  //     collected.update();
  //   });

  }

    
}
