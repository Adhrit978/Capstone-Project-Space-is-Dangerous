//Creating sprite and sprite image variables
var rocketimg;
var rocket;
var meteorimg;
var meteor1;
var meteor2;
var asteroidimg;
var asteroid;
var blackholeimg;
var blackhole;
var endblackhole;
var starimg;
var star;
var fuelcanimg;
var fuelcan;
var fuelgaugeimg;
var fuelgauge;
var backgroundimg;
var wallpaper;


//Creating group variables
var asteroidgroup;
var meteorgroup1;
var meteorgroup2;
var stargroup;
var fuelcangroup;
var stargroup;
var blackholegroup;

//Creating a variable for gamestate and for fuel.
var fuel=100;
var gamestate="start";

//Creating a variable for score
var score=0;

function preload() {
  //Loading sprite images
  rocketimg = loadImage("rocket.png");
  meteorimg = loadImage("meteor.png");
  asteroidimg = loadImage("asteroid.png");
  fuelcanimg = loadImage("fuelcan.png");
  blackholeimg = loadImage("blackhole.png");
  backgroundimg = loadImage("background.png");
  fuelgaugeimg = loadImage("fuelgauge.png");
}
function setup() {
  //Setting the canvas width and height to the window's width and height
  createCanvas(windowWidth, windowHeight);
  
  //creating a wallpaper sprite for the background
  wallpaper = createSprite(width / 2, height / 2, 1500, 800);
  
  //Adding the image and setting scale
  wallpaper.addImage("wallpaper", backgroundimg);
  wallpaper.scale = 0.5;
  
  
  //creating a rocket sprite
  rocket = createSprite(width/2, height-150);
  //Adding the image and setting scale
  
  rocket.addImage("rocket", rocketimg);
  rocket.scale = 0.18;
  
  //Setting the collider
  rocket.setCollider("rectangle", 0, -20, 222, 400);
  
  
  //Creating a fuelguage sprite that shows the fuel as empty (To be shown when the shp runs out of fuel)
  fuelgauge = createSprite(width/2, height/2-80, 10, 10);
  
  //Adding the image and setting scale
  fuelgauge.addImage("fuelgauge", fuelgaugeimg);
  fuelgauge.scale=0.6;
  
  //Making it invisible
  fuelgauge.visible=false;
  
  //Creating an end black hole sprite to be shown if the rokcet touches a black hole
  endblackhole = createSprite(width/2, height/2-121, 10, 10);
  
  //Adding the image and setting scale
  endblackhole.addImage("endblackhole", blackholeimg);
  endblackhole.scale=0.44;
  
  //Making it invisible
  endblackhole.visible=false;
  
  //Creating groups
  asteroidgroup=createGroup();
  meteorgroup1=createGroup();
  meteorgroup2=createGroup();
  stargroup=createGroup();
  fuelcangroup=createGroup();
  stargroup=createGroup();
  blackholegroup=createGroup();
  
  /*
  //Creating a star sprite
  star = createSprite(380, 490);
  star.addImage("star", starimg);
  star.scale = 0.1;
  */
}
function draw() {
  background("black");
  
  if (gamestate==="start") {
   
    //Increasing the wallpaper's (background's) speed over time
    wallpaper.velocityY=3+frameCount/300;
    //Resetting the wallpaper/background
    if (wallpaper.y>height-300) {
      wallpaper.y=height/2;
    }
    
    //Moving the rocket left and right with the arrow keys, only if it's within the screen
    if (keyDown(RIGHT_ARROW)&&rocket.x<width-20) {
      rocket.x+=5;
    }
    if (keyDown(LEFT_ARROW)&&rocket.x>20) {
      rocket.x-=5;
    }
    
    //Calling the spawn functions
    spawnasteroids();
    spawnmeteors1();
    spawnmeteors2();
    spawnblackholes();
    spawnfuelcans();
    
    //Losing fuel if an asteroid or meteor hits the rocket (and destorying the meteor/asteroid) and if the fuel is greater than 0%
    if (rocket.isTouching(asteroidgroup)) {
      asteroidgroup.destroyEach();
      fuel-=15;
    }
    if(rocket.isTouching(meteorgroup1)) {
      meteorgroup1.destroyEach();
      fuel-=10;
    }
    if(rocket.isTouching(meteorgroup2)) {
      meteorgroup2.destroyEach();
      fuel-=10;
    }
    
    //Adding fuel if the rocket touches a fuel can (and destroying the fuel can)
    if (rocket.isTouching(fuelcangroup)) {
      fuelcangroup.destroyEach();
      //Only adding 8% to the fuel if the fuel is less than or equal to 92% (Otherwise it could be greater than 100% which isn't allowed)
      if (fuel<=92){
        fuel+=5;
      }
      //Setting the fuel's value to full if it's greater than 90%
      else {
        fuel=100;
      }
    }
    
    //Losing fuel constantly to fly
    if (frameCount%30===0) {
      fuel-=1
    }
    
    //Constantly incrementing the score
    score+=1;
    
    //Ending the game if the rocket is out of fuel and setting the gamestate to end1(out of fuel)
    if(fuel<=0) {
      gamestate="end1";
    }
    
    //Ending the game is the rocket is touches a black hole and setting the gamestate to end2(sucked into a black hole)
    if (rocket.isTouching(blackholegroup)){
      gamestate="end2";
    }

    //I have to put drawSprites before the text to display the fuel, otherwise the background will be on top of the text and will hide it. I can't put the text outside because the fuel should only be visbible when gamestate is start
    drawSprites();
    
    //Displaying the fuel
    if(fuel>20) {
      fill("white");
    }
    else if(fuel>10) {
      fill("orange");
    }
    else if(fuel>0) {
      fill("red");
    }
    textSize(20);
    text("Fuel: "+fuel+"%", 8, 20);
    fill("white");
    text("Score: "+score, 8, 44)
    
  }
  
  if (gamestate==="end1") {
    //Destroying all groups that could be on the screen
    asteroidgroup.destroyEach();
    meteorgroup1.destroyEach();
    meteorgroup2.destroyEach();
    fuelcangroup.destroyEach();
    blackholegroup.destroyEach();
    
    //Hiding the rocket and background instead of destroying, because I would have to srate then again in the click space to restart part
    rocket.visible=false;
    wallpaper.visible=false;
    
    fuelgauge.visible=true;
    
    drawSprites();
    
    //Writing your ship ran out of fuel
    fill("white");
    textSize(30);
    text("Your ship ran out of fuel", width/2-156, height/2+80);
    text("Your score is "+score, width/2-95, height/2+110)
    
    fill("grey");
    text("Press space to restart", width/2-144, height/2+170);
  }
  
  if(gamestate==="end2") {
    //Destroying all groups that could be on the screen
    asteroidgroup.destroyEach();
    meteorgroup1.destroyEach();
    meteorgroup2.destroyEach();
    fuelcangroup.destroyEach();
    blackholegroup.destroyEach();
    
    //Hiding the rocket and background instead of destroying, because I would have to srate then again in the click space to restart part
    rocket.visible=false;
    wallpaper.visible=false;
    
    drawSprites();
    
    endblackhole.visible=true;
    
    //Writing your ship was sucked into a black hole
    fill("white");
    textSize(30);
    text("Your ship was sucked into", width/2-156, height/2+90);
    text("a black hole", width/2-70, height/2+121);
    text("Your score is "+score, width/2-91, height/2+155)
    
    //Writing press space to restart
    fill("grey")
    text("Press space to restart", width/2-140, height/2+222);
  }
  
  //Restarting the game if space is pressed and the gamestate is not equal to start
    if (keyDown("space") && gamestate!=="start") {
      //Resetting the gamestate, score and fuel
      gamestate="start";
      fuel=100;
      score=0;
      
      //Showing the rocket and wallpaper
      rocket.visible=true;
      wallpaper.visible=true;
      
      //Hiding the fuel gauge and the end black hole
      fuelgauge.visible=false;
      endblackhole.visible=false;
      
      //Setting the framecount to 0
      frameCount=0;
    }
}


//Creating a function to spawn asteroids
function spawnasteroids() {
  //Doing things only if the framecount is a multiple of 180
  if (frameCount%180===0) {
    
    //Creating an asteroid sprite
    asteroid = createSprite(Math.round(random(20, width-20)), -50);
    
    //Adding the image and setting scale
    asteroid.addImage("asteroid", asteroidimg);
    asteroid.scale = 0.15;
    
    //Setting the collider
    asteroid.setCollider("rectangle", 0, 0, 600, 900);
    
    //Setting the velocity a little above the wallpaper/background's (Because the asteroids will have their own velocity as well, they're not stationary);
    asteroid.velocityY=wallpaper.velocityY+1
    
    //Setting a lifetime
    asteroid.lifetime=height/3+80;
    
    //Adding asteroid to the asteroidgroup
    asteroidgroup.add(asteroid);
  }
}

//Creating a spawn meteors function

function spawnmeteors1() {
  //Doing things only if the framecount is a multiple of 100
    if (frameCount%160===0) {
       //Creating a meteor sprite
       meteor1 = createSprite(Math.round(random(30, width-30)), -50);
    
       //Adding the image and setting scale
       meteor1.addImage("meteor", meteorimg);
       meteor1.scale = 0.4;
      
       //Setting the collider
       meteor1.setCollider("rectangle", 0, 0, 190, 190);
    
       //Setting the velocity a little above the wallpaper/background's (Because the meteors aren;t static either)
       meteor1.velocityY=wallpaper.velocityY+1.5;
    
       //Setting a lifetime
       meteor1.lifetime=height/3+80;
    
       //Adding meteor to the meteorgroup
       meteorgroup1.add(meteor1);
    }
}



//Creating a second function to spawn meteors (This is because there can be 2 meteors on the screen at one time, and if the spaceship hits one the destroyEach() function will destroy both)

function spawnmeteors2() {
    //Doing things only if the framecount+80 is a multiple of 160, or creating a meteor evey eighty frames with no 2 consecutive meteors belonging to the same group
    if ((frameCount+80)%160===0) {
       //Creating a meteor sprite
       meteor2 = createSprite(Math.round(random(30, width-30)), -50);
    
       //Adding the image and setting scale
       meteor2.addImage("meteor", meteorimg);
       meteor2.scale = 0.4;
      
       //Setting the collider
       meteor2.setCollider("rectangle", 0, 0, 190, 190);
    
       //Setting the velocity a little above the wallpaper/background's (Because the meteors aren;t static either)
       meteor2.velocityY=wallpaper.velocityY+1.5;
    
       //Setting a lifetime
       meteor2.lifetime=height/3+80;
    
       //Adding meteor to the meteorgroup
       meteorgroup2.add(meteor2);
   }
}

//Creating a function to spawn black holes
function spawnblackholes() {
  //Doing things only if the framecount is a multiple of 300
  if (frameCount%300===0) {
    //Creating a black hole sprite
    blackhole = createSprite(Math.round(random(80, width-80)), -80);
    
    //Adding the image and setting the scale
    blackhole.addImage("blackhole", blackholeimg);
    blackhole.scale = 0.18;
    
    //Setting the collider
    blackhole.setCollider("circle", 0, 0,  333);
    
    //Setting the velocity to the wallpaper/background's velocity
    blackhole.velocityY=wallpaper.velocityY;
    
    //Setting the lifetime
    blackhole.lifetime=height/3+80;
    
    //Adding the blackhole to the blackhole group
    blackholegroup.add(blackhole);
  }
}


//Creating a function to spawn fuel cans
function spawnfuelcans() {
  //Doing things only if the framecount is a multiple of 180
  if (frameCount%222===0) {
    //Creating a fuelcan sprite
    fuelcan = createSprite(Math.round(random(30, width-30)), -80, 10, 10);
    
    //Adding the image and setting scale
    fuelcan.addImage("fuelcan", fuelcanimg);
    fuelcan.scale = 0.025;
    
    //Setting the collider
    fuelcan.setCollider("rectangle", 0, 80, 1800, 2100)
    
    //Setting the velocity to the wallpaper/background's velocity
    fuelcan.velocityY=wallpaper.velocityY;
    
    //Setting the lifetime
    fuelcan.lifetime=height/3+80;
    
    //Adding the fuelcans to the fuelcan group
    fuelcangroup.add(fuelcan);
  }
}