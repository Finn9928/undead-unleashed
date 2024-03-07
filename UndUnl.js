/*******************************************************/
// Game Name: Undead Unleashed
// 
// Written by Cliff Harfield
/*******************************************************/
console.log('Boot UndUnl');
// Seting up the variable and constants etc
var player;
let gameState='game';
const VERSION_NUM = '0.0.1'
const PLAYER_SCALE = 30;
/*******************************************************/
// setup()
/*******************************************************/
function setup() {
    console.log(" setup: Undead Unleashed");
    new Canvas(windowWidth, windowHeight);
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
}
//startscreenfunction
function startScreen () {
    background('blue');
}
//this is the reset game function
function resetGame() {
    player = new Sprite(windowWidth/2, windowHeight/2, PLAYER_SCALE, PLAYER_SCALE, 'k')
    
}
/*******************************************************/
//  END OF GAME
/*******************************************************/
