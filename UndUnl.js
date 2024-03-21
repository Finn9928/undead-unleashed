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
var gameDifficulty = 'Normal';
var startButton;
var difficultyButton;
let gameState='startScreen';
const VERSION_NUM = '0.3.0'
const PLAYER_SCALE = 30;
const PLAYER_SPEED = 4;
const GAME_WIDTH = 3000;
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
    startSetup();
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
    if (gameState == 'death') {
        deathScreen ();
    }
}

/*******************************************************/
// functions
/*******************************************************/
/*******************************************************/
// Start Screen and settings
/*******************************************************/
//startscreenfunction
function startScreen () {
    background('blue');
    controlsForPlayer ()
    player.rotateMinTo(mouse, 9, 90);//speed 9 found from testing and 90 is to point the sprite the correct ways
    playerWeapon.rotateMinTo(mouse, swingSpeed, 90);
    startButton.collides(playerWeapon, swordHitPlayButton);
    difficultyButton.collides(playerWeapon, toggleDifficulty);
    difficultyButton.text = gameDifficulty;
}
//tempwalls for menus
function startSetup() {
    tempWallBot = new Sprite(windowWidth/2, windowHeight, windowWidth, 0, 'k');
    tempWallBot.color = 'black';
    tempWallRH  = new Sprite(windowWidth, windowHeight/2, 0, windowHeight, 'k');
    tempWallRH.color = "black";
    //start menu buttons
    startButton = new Sprite(windowWidth/4, windowHeight/3, 80, 'k');
    startButton.textSize = 30;
    startButton.text = "Play";
    startButton.health = 25;
    //dificaulty button
    difficultyButton = new Sprite(windowWidth/4*3, windowHeight/3, 80, 'k');
    difficultyButton.textSize = 17;
    difficultyButton.health = 20;
}
//remove temp walls
function noTempSprites(){
    tempWallBot.remove();
    tempWallRH.remove();
    player.remove();
    playerWeapon.remove();
    startButton.remove();
    difficultyButton.remove();
}
//this is the player attacking the play button
function swordHitPlayButton(_button, _player) {
    _button.health--;
    _button.text = (_button.health);
    // play game if hit
    if (_button.health <= 0){
        noTempSprites();
        resetGame();
        gameState='game';
    }
}
//toggle the game difficulty
function toggleDifficulty(_button, _player) {
    _button.health--;
    if (difficultyButton.health <= 0){
        if (gameDifficulty == 'Normal') {
        gameDifficulty = 'Hard/Fast';
        difficultyButton.health = 20;
        console.log(gameDifficulty);
    } else if (gameDifficulty == 'Easy') {
        gameDifficulty = 'Normal';
        difficultyButton.health = 20;
        console.log(gameDifficulty);
    } else if (gameDifficulty == 'Hard/Fast') {
        gameDifficulty = 'Easy';
        difficultyButton.health = 20;
        console.log(gameDifficulty);
    }
    }
}
/*******************************************************/
// The game its self
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
    //kill the player
    player.collides(horedGroup, zombieHitPlayer);
}
//movement code
function controlsForPlayer () {
    //movment controls (WASD)
    if (kb.pressing('a')){
        player.vel.x=-PLAYER_SPEED;
        speedUp();
    }
    if (kb.released('a')){
        player.vel.x=0;
        playerWeapon.vel.x=0;
        speedDown();
    }
    if (kb.pressing('d')){
        player.vel.x=+PLAYER_SPEED;
        speedUp();
    }
    if (kb.released('d')){
        player.vel.x=0;
        playerWeapon.vel.x=0;
        speedDown();
    }
    if (kb.pressing('w')){
        player.vel.y=-PLAYER_SPEED;
        speedUp();
    }
    if (kb.released('w')){
        player.vel.y=0;
        playerWeapon.vel.y=0;
        speedDown();
    }
    if (kb.pressing('s')){
        player.vel.y=+PLAYER_SPEED; 
        speedUp();
    }
    if (kb.released('s')){
        player.vel.y=0;
        playerWeapon.vel.y=0;
        speedDown();
    }
    //this keeps the player from gliding
    if (player.vel.y <= (PLAYER_SPEED - 1)) {
        if (player.vel.y >= (-PLAYER_SPEED + 1))
            player.vel.y = 0;
    }
    if (player.vel.x <= (PLAYER_SPEED - 1)) {
        if (player.vel.x >= (-PLAYER_SPEED + 1))
            player.vel.x = 0;
    }
    if (player.vel.y > PLAYER_SPEED) player.vel.y = 0;
    if (player.vel.x > PLAYER_SPEED) player.vel.x = 0;
    if (player.vel.y < -PLAYER_SPEED) player.vel.y = 0;
    if (player.vel.x < -PLAYER_SPEED) player.vel.x = 0;
    //Weapon controls
    if (mouse.pressing()) swingSpeed = 20;
    if (mouse.released()) swingSpeed = 6;
    //testing button
    if (kb.presses('1')) spawnZombiesQueue(1);
    if (kb.presses('2')) spawnZombiesQueue(5);
    if (kb.presses('3')) spawnZombiesQueue(20);
    if (kb.presses('4')) console.log(horedGroup.amount);
    //speed zoom
    function speedUp (){
        camera.zoomTo(0.95, 0.001);
    }
    function speedDown () {
        camera.zoomTo(1, 0.01);
    }
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
        var zSpawnY = random(0, GAME_HEIGHT);
        var zSpawnX = random(0, GAME_WIDTH);
        var zSpawnSize = random(14, 24);
        var zSpawnHealth = floor(random(defaultZHealthMin, defaultZHealthMax));
        if (validateSpawnLocation(zSpawnX, zSpawnY)){
            zombie = new Sprite(zSpawnX, zSpawnY, zSpawnSize, "d");
            zombie.color= "darkGreen";
            zombie.health = zSpawnHealth;
            zombie.friction = 1.5;
            horedGroup.add(zombie);
            spawnZombiesQueue (0);
        }
        else {
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
    console.log(_xPos, _yPos, player.pos.x, player.pos.y, dist(_xPos, _yPos, player.pos.x, player.pos.y));
    if (dist(_xPos, _yPos, player.pos.x, player.pos.y)> windowHeight){
        console.log('true');
        return(true);
    }
    else {
        console.log('false');
        return(false);
    }
}
//player being hit by zombie
function zombieHitPlayer() {
    noTempSprites();
    console.log('player death L BOZO');
    gameState='death'
}

function deathScreen() {
    background('Red');
    camera.pos.y = 0;
    camera.pos.x = 0;
    textSize(30);
    text(("you died your score was: " + score), 200, 200);
}
/*******************************************************/
//  END OF GAME
/*******************************************************/
