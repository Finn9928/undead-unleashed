/*******************************************************/
// Game Name: Undead Unleashed
// 
// Written by Cliff Harfield
/*******************************************************/
console.log('Boot UndUnl');
// Seting up the variable and constants etc
var score = 0;
var player;
var playerColour = '#7922E9';
var playerWeapon;
var swingSpeed = 6;
var defaultZHealthMin = 1;
var defaultZHealthMax = 6;
var swordKnockBack = 3;
var queueNum = 0;
let gameState='game';
const VERSION_NUM = '0.2'
const PLAYER_SCALE = 30;
const PLAYER_SPEED = 4;
const GAME_WIDTH = 2000;
const GAME_HEIGHT = 2000;

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
    wallLH  = new Sprite(0, GAME_HEIGHT/2, 0, GAME_HEIGHT, 'k');
    wallLH.color = 'black';
    wallRH  = new Sprite(GAME_WIDTH, GAME_HEIGHT/2, 0, GAME_HEIGHT, 'k');
    wallRH.color = "black";
    wallTop = new Sprite(GAME_WIDTH/2, 0, GAME_WIDTH, 0, 'k');
    wallTop.color = 'black';
    wallBot = new Sprite(GAME_WIDTH/2, GAME_HEIGHT, GAME_WIDTH, 0, 'k');
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
    background('lightBlue');
    camera.pos = player.pos;
    textSize(30);
    text(("Score: " +score), 200, 200);
    textSize(16);
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
    
    //testing button
    if (kb.presses('1')) spawnZombiesQueue(1);
    if (kb.presses('2')) spawnZombiesQueue(5);
    if (kb.presses('3')) spawnZombiesQueue(20);
    if (kb.presses('4')) console.log(horedGroup.amount);
}
//this spawns the zombies
function spawnZombiesQueue (_amountToQueue){
    queueNum = queueNum + _amountToQueue;
    if (queueNum >= 1){
        queueNum = queueNum - 1;
        console.log(queueNum);
        spawnZombies(1);
    }
}
function spawnZombies (_amount){
    for (i = 0; i < _amount; i++) {
        var zSpawnZ = random(0, GAME_HEIGHT);
        var zSpawnX = random(0, GAME_WIDTH);
        var zSpawnSize = random(14, 24);
        var zSpawnHealth = floor(random(defaultZHealthMin, defaultZHealthMax));
        if (validateSpawnLocation(zSpawnX, zSpawnZ) == true){
            zombie = new Sprite(zSpawnZ, zSpawnX, zSpawnSize, "d");
            zombie.color= "darkGreen";
            zombie.health = zSpawnHealth;
            zombie.friction = 1.5;
            horedGroup.add(zombie);
            spawnZombiesQueue (0);
        }
        else if (validateSpawnLocation(zSpawnX, zSpawnZ) == false) {
            spawnZombiesQueue (1);
        }
    }
}
//this is the player attacking zombie code
function swordHitZombie(_zombie, _player) {
    _zombie.health--;
    _zombie.text = (_zombie.health);
    _zombie.applyForce(swordKnockBack);
    // Remove zombie if health
    if (_zombie.health <= 0){
        _zombie.remove();
        score++;
    }
}
//spawn outside of player veiw code
function validateSpawnLocation(_xPos, _yPos){
    var valid
    if (dist(_xPos, _yPos, player.pos.x, player.pos.y)> windowHeight){
        console.log('true');
        return(true);
    }
    else {
        console.log('false');
        return(false);
    }
}
/*******************************************************/
//  END OF GAME
/*******************************************************/
