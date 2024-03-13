/*******************************************************/
// Game Name: Undead Unleashed
// 
// Written by Cliff Harfield
/*******************************************************/
console.log('Boot UndUnl');
// Seting up the variable and constants etc
var player;
var playerColour = '#7922E9';
var playerWeapon;
var swingSpeed = 6;
let gameState='game';
const VERSION_NUM = '0.1.1'
const PLAYER_SCALE = 30;
const PLAYER_SPEED = 4;

//funcpreload
function preload() {
    playerTexure = loadImage('/texures/playertemp.png');
    playerSwordTexure = loadImage('/texures/playerweapon1texure.png')
}
/*******************************************************/
// setup()
/*******************************************************/
function setup() {
    console.log(" setup: Undead Unleashed");
    new Canvas(windowWidth, windowHeight);
    //walls
    wallLH  = new Sprite(0, height/2, 0, height, 'k');
    wallLH.color = 'black';
    wallRH  = new Sprite(width, height/2, 0, height, 'k');
    wallRH.color = "black";
    wallTop = new Sprite(width/2, 0, width, 0, 'k');
    wallTop.color = 'black';
    wallBot = new Sprite(width/2, height, width, 0, 'k');
    wallBot.color = 'black';
    horedGroup = new Group();
    //reseting the game to start
    resetGame();
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {
    if (gameState == 'startScreen') {
        startScreen ();
    }
    if (gameState == 'game') {
        game ();
    }
}

/*******************************************************/
// functions
/*******************************************************/

//game function
function game() {
    background('green');
    camera.pos = player.pos;
    player.rotateMinTo(mouse, 9, 90);//speed 8 found from testing and 90 is to point the sprite the correct ways
    playerWeapon.rotateMinTo(mouse, swingSpeed, 90);
    controlsForPlayer ();
}
//startscreenfunction
function startScreen () {
    background('blue');
}
//this is the reset game function
function resetGame() {
    //getting the player ready
    player = new Sprite(windowWidth/2, windowHeight/2, PLAYER_SCALE, 'd')
    player.color = playerColour;
    player.stroke = 'white';
    player.addImage(playerTexure);
    playerTexure.resize(PLAYER_SCALE, PLAYER_SCALE);
    //getting the players wepon ready
    playerWeapon = new Sprite(windowWidth/2, windowHeight/2, PLAYER_SCALE, PLAYER_SCALE*2, 'd')
    playerWeapon.stroke = 'white';
    playerWeapon.drag = 1;
    playerWeapon.offset.y = -50;
    playerWeapon.addImage(playerSwordTexure);
    playerSwordTexure.resize(PLAYER_SCALE, PLAYER_SCALE*2);
    //the connection point between the player and its sword
    playerHands = new WheelJoint(playerWeapon, player);
    playerHands.visible = 'false';
    playerHands.springiness = 0.01;
    //kill zombie detection
    horedGroup.collides(playerWeapon, swordHitZombie);
}
//movement code
function controlsForPlayer () {
    //movment controls (WASD)
    if (kb.pressing('a')){
        player.vel.x=-PLAYER_SPEED;
    }
    if (kb.released('a')){
        player.vel.x=0;
        playerWeapon.vel.x=0;
    }
    if (kb.pressing('d')){
        player.vel.x=+PLAYER_SPEED;
    }
    if (kb.released('d')){
        player.vel.x=0;
        playerWeapon.vel.x=0;
    }
    if (kb.pressing('w')){
        player.vel.y=-PLAYER_SPEED;
    }
    if (kb.released('w')){
        player.vel.y=0;
        playerWeapon.vel.y=0;
    }
    if (kb.pressing('s')){
        player.vel.y=+PLAYER_SPEED; 
    }
    if (kb.released('s')){
        player.vel.y=0;
        playerWeapon.vel.y=0;
    }
    //Weapon controls
    if (mouse.pressing()) swingSpeed = 20;
    if (mouse.released()) swingSpeed = 6;
    
    //texting button
    if (kb.presses('1')) spawnZombies(1);
    if (kb.presses('2')) spawnZombies(5);
}
function spawnZombies (_amount){
    for (i = 0; i < _amount; i++) {
        var randNum1 = random(6, 200);
        var randNum2 = random(60, 80);
        var randNum3 = random(14, 24);
        zombie = new Sprite(randNum1, randNum2, randNum3, "d");
        zombie.color= "darkGreen";
        horedGroup.add(zombie);
    }
}
function swordHitZombie(_zombie, _player) {
        console.log("test");
        // Delete the zombieh was hit
        _zombie.remove();
    }
/*******************************************************/
//  END OF GAME
/*******************************************************/
