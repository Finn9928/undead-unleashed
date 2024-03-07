/*******************************************************/
// Game Name: Undead Unleashed
// 
// Written by Cliff Harfield
/*******************************************************/
console.log('Boot UndUnl');
// Seting up the variable and constants etc
var player;
var playerColour = '#7922E9';
let gameState='game';
const VERSION_NUM = '0.0.1'
const PLAYER_SCALE = 30;
const PLAYER_SPEED = 4;
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
    controlsForPlayer ();
}
//startscreenfunction
function startScreen () {
    background('blue');
}
//this is the reset game function
function resetGame() {
    player = new Sprite(windowWidth/2, windowHeight/2, PLAYER_SCALE, 'd')
    player.color = playerColour;
}
//movement code
function controlsForPlayer () {
    if (kb.pressing('a')){
        console.log("a");
        player.vel.x=-PLAYER_SPEED;
    }
    if (kb.released('a')){
        player.vel.x=0;
    }
    if (kb.pressing('d')){
        console.log("d");
        player.vel.x=+PLAYER_SPEED;
    }
    if (kb.released('d')){
        player.vel.x=0;
    }
    if (kb.pressing('w')){
        console.log("w");
        player.vel.y=-PLAYER_SPEED;
    }
    if (kb.released('w')){
        player.vel.y=0;
    }
    if (kb.pressing('s')){
        console.log("s");
        player.vel.y=+PLAYER_SPEED; 
    }
    if (kb.released('s')){
        player.vel.y=0;
    }
}
/*******************************************************/
//  END OF GAME
/*******************************************************/
