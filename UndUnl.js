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
let gameState='game';
const VERSION_NUM = '0.1.0'
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
    controlsForPlayer ();
    if (playerWeapon.vel.x > 3||playerWeapon.vel.y > 3||playerWeapon.vel.x < -3||playerWeapon.vel.y < -3) console.log('moving speed ' +(playerWeapon.vel.y+playerWeapon.vel.x));
    //playerWeapon.pos.y = (player.pos.y + 10);
    //playerWeapon.pos.x = (player.pos.x + 10);
    j = new WheelJoint(player, playerWeapon);
    playerWeapon.rotateMinTo(mouse, 6, 90);
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
}
//movement code
function controlsForPlayer () {
    //movment controls (WASD)
    if (kb.pressing('a')){
        player.vel.x=-PLAYER_SPEED;
    }
    if (kb.released('a')){
        player.vel.x=0;
    }
    if (kb.pressing('d')){
        player.vel.x=+PLAYER_SPEED;
    }
    if (kb.released('d')){
        player.vel.x=0;
    }
    if (kb.pressing('w')){
        player.vel.y=-PLAYER_SPEED;
    }
    if (kb.released('w')){
        player.vel.y=0;
    }
    if (kb.pressing('s')){
        player.vel.y=+PLAYER_SPEED; 
    }
    if (kb.released('s')){
        player.vel.y=0;
    }
}
/*******************************************************/
//  END OF GAME
/*******************************************************/
