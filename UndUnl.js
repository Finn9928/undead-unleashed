/*******************************************************/
// Game Name: Undead Unleashed
const VERSION_NUM = '1.0.2'
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
var playerMaxHealth = 80; //temporary health value
var queueNum = 0;
var gameDifficulty = 'Normal';
var startButton;
var difficultyButton;
var zombieSpeed = 1;
var zombieSpawnOffSet = 0;
var zombieSpawnRate = 5;
var speedSlider;
var healthSlider;
var damageSlider;
var continueButton;
var behindHealthBar;
let gameState='startScreen';
const PLAYER_SCALE = 30;
const PLAYER_SPEED = 4;
const GAME_WIDTH = 3000;
const GAME_HEIGHT = 3000;

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
    cnv= new Canvas(windowWidth, windowHeight);
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
    bushesGroup = new Group();
    //reseting the game to start
    resetGame();
    startSetup();
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {
    if (gameState == 'startScreen') {
        startScreen ();
    }
    if (gameState == 'preGame') {
        preGameScreen();
    }
    if (gameState == 'game') {
        game ();
    }
    if (gameState == 'death') {
        deathScreen ();
    }
}
/*********************************************************/
// functions
/*********************************************************/
/*******************************************************/
// Start Screen and settings
/*******************************************************/
//startscreenfunction
function startScreen () {
    background('#674C85');
    textSize(60);
    text(("Use wasd to move \nUse the mouse to aim your sword"), 50, 100);
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
    startButton.color = '#C998D7';
    //dificaulty button
    difficultyButton = new Sprite(windowWidth/4*3, windowHeight/3, 80, 'k');
    difficultyButton.textSize = 17;
    difficultyButton.health = 20;
    difficultyButton.color = '#C998D7';
    //moving the player in veiw
    player.pos.x = windowWidth/2;
    player.pos.y = windowHeight/2;
    playerWeapon.pos.x = windowWidth/2;
    playerWeapon.pos.y = windowHeight/2;
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
        spawnZombiesQueue(1);
        gameState='preGame';
        resetGame();
        steupPreGame();
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
// Stat selection Screen
/*******************************************************/
function preGameScreen(){
    background('#674C85');
    textSize(30);
    text('Allocate your stats:', 50, 100);
}
function steupPreGame(){
    speedSlider = createSlider(0, 100, 50);
    speedSlider.position(windowWidth/4, 150);
    speedSlider.size(windowWidth/2);
    healthSlider = createSlider(0, 100, 50);
    healthSlider.position(windowWidth/4, 200);
    healthSlider.size(windowWidth/2);
    damageSlider = createSlider(0, 100, 50);
    damageSlider.position(windowWidth/4, 250);
    damageSlider.size(windowWidth/2);
    continueButton = createButton('Continue');
    continueButton.position(windowWidth/2-continueButton.width/2, 300);
    continueButton.mousePressed(startGame);
}
function startGame() {
    speedSlider.remove();
    healthSlider.remove();
    damageSlider.remove();
    continueButton.remove();
    noTempSprites();
    spawnZombiesQueue(1);
    gameState='game';
    resetGame();
}
/*******************************************************/
// The game its self
/*******************************************************/
//game function
function game() {
    background('#36BF28FF');
    camera.pos = player.pos;
    textSize(30);
    text(("Score: " +score), 200, 200);
    textSize(16);
    player.rotateMinTo(mouse, 9, 90);//speed 8 found from testing and 90 is to point the sprite the correct ways
    playerWeapon.rotateMinTo(mouse, swingSpeed, 90);
    controlsForPlayer ();
    centerGUI();
    moveZombiesTowardsPlayer();
    zombieSpeed = zombieSpeed + 0.001
    zombieSpawnTimer();
}
//this is the reset game function
function resetGame() {
    //getting the player ready
    player = new Sprite(GAME_WIDTH/2, GAME_HEIGHT/2, PLAYER_SCALE, 'd')
    player.color = playerColour;
    player.stroke = 'white';
    player.addImage(playerTexure);
    player.health = playerMaxHealth;
    playerTexure.resize(PLAYER_SCALE, PLAYER_SCALE);
    //getting the players wepon ready
    playerWeapon = new Sprite(GAME_WIDTH/2, GAME_HEIGHT/2, PLAYER_SCALE, PLAYER_SCALE*2, 'd')
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
    //healthbar setup but only if in the game
    if (gameState == 'game') {
        spawnBushes(random(25,60));
        makeHeathBar();
    }
}
//center GUI function
function centerGUI() {
    behindHealthBar.pos.x = (player.pos.x);
    behindHealthBar.pos.y = (player.pos.y+windowHeight/2-90);
    healthBar.pos.x = (player.pos.x);
    healthBar.pos.y = (player.pos.y+windowHeight/2-90);
}
//movement code, called in game function and start screen function in the draw loop.
function controlsForPlayer () {
    //movment controls (WASD)
    if (kb.pressing('a')){
        player.vel.x=-PLAYER_SPEED;
        //speedUp();
    }
    if (kb.released('a')){
        player.vel.x=0;
        playerWeapon.vel.x=0;
        //speedDown();
    }
    if (kb.pressing('d')){
        player.vel.x=+PLAYER_SPEED;
        //speedUp();
    }
    if (kb.released('d')){
        player.vel.x=0;
        playerWeapon.vel.x=0;
        //speedDown();
    }
    if (kb.pressing('w')){
        player.vel.y=-PLAYER_SPEED;
        //speedUp();
    }
    if (kb.released('w')){
        player.vel.y=0;
        playerWeapon.vel.y=0;
        //speedDown();
    }
    if (kb.pressing('s')){
        player.vel.y=+PLAYER_SPEED; 
        //speedUp();
    }
    if (kb.released('s')){
        player.vel.y=0;
        playerWeapon.vel.y=0;
        //speedDown();
    }
    //this keeps the player from gliding
    if (player.vel.y <= (PLAYER_SPEED - 1)) {
        if (player.vel.y >= (-PLAYER_SPEED + 1)) player.vel.y = 0;
    }
    if (player.vel.x <= (PLAYER_SPEED - 1)) {
        if (player.vel.x >= (-PLAYER_SPEED + 1)) player.vel.x = 0;
    }
    if (player.vel.y > PLAYER_SPEED) player.vel.y = 0;
    if (player.vel.x > PLAYER_SPEED) player.vel.x = 0;
    if (player.vel.y < -PLAYER_SPEED) player.vel.y = 0;
    if (player.vel.x < -PLAYER_SPEED) player.vel.x = 0;
    //Weapon controls
    if (mouse.pressing()) swingSpeed = 20;
    if (mouse.released()) swingSpeed = 6;
    //testing buttons
    //if (kb.presses('1')) spawnZombiesQueue(1);
    //if (kb.presses('2')) spawnZombiesQueue(5);
    //if (kb.presses('3')) spawnZombiesQueue(20);
    //if (kb.presses('4')) console.log(horedGroup.amount);
    if (kb.presses('e')) allSprites.debug = true;
    if (kb.released('e')) allSprites.debug = false;
    //speed zoom broken
    //function speedUp (){
    //    if (gameState == 'game') {
    //        camera.zoomTo(0.95, 0.001,);
    //        camera.pos = player.pos;
    //    }
    //}
    //function speedDown () {
    //    if (gameState == 'game') {
    //        camera.zoomTo(1, 0.01);
    //        camera.pos = player.pos;
    //    }
    //}
}
//this spawns the zombies
function zombieSpawnTimer () {
    zombieSpawnOffSet++;
    if (zombieSpawnOffSet == zombieSpawnRate*30) {
        zombieSpawnOffSet = 0;
        spawnZombiesQueue(1);
    }
}
function spawnZombiesQueue (_amountToQueue){
    queueNum = queueNum + _amountToQueue;
    if (queueNum >= 1){
        queueNum = queueNum - 1;
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
// Function to handle zombie movement towards the player
// With help from chat gpt
function moveZombiesTowardsPlayer() {
    horedGroup.forEach(zombie => {
        // Calculate direction vector from zombie to player
        const directionX = player.pos.x - zombie.pos.x;
        const directionY = player.pos.y - zombie.pos.y;
        // Normalize direction vector
        const magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);
        const normalizedDirectionX = directionX / magnitude;
        const normalizedDirectionY = directionY / magnitude;
        // Apply velocity towards the player
        const speed = zombieSpeed; // Adjust this value as needed
        zombie.vel.x = normalizedDirectionX * speed;
        zombie.vel.y = normalizedDirectionY * speed;
    });
}
//chatgpt help ends
//spawn outside of player veiw code
function validateSpawnLocation(_xPos, _yPos){
    var valid
    if (dist(_xPos, _yPos, player.pos.x, player.pos.y)> windowHeight){
        return(true);
    }
    else {
        return(false);
    }
}
//player healbar display
function makeHeathBar() {
    var barWidth = windowWidth-55;
    var barHeight = windowHeight/8-15;
    var barX = windowWidth/2-barWidth/2;
    var barY = windowHeight-90;
    behindHealthBar = new Sprite(barX, barY, barWidth+20, barHeight+20, 'n');
    behindHealthBar.color = 'black';
    behindHealthBar.stroke = 'black';
    healthBar = new Sprite(barX, barY, barWidth, barHeight, 'n');
    healthBar.color = '#C22B19FF';
    healthBar.stroke = 'black';
}
//player being hit by zombie
function zombieHitPlayer(_zombie) {
    player.health--;
    healthBar.w = (healthBarLength(player.health, windowWidth-55));
    console.log(player.health)
    if (player.health <= 0) {
        noTempSprites();
        console.log('player death');
        //camera.zoomTo(3, 0.0006);
        gameState='death';
    }
}
function healthBarLength (_currentHealth, _maxBarLength) {
    var barWidthMaybe = (_currentHealth / playerMaxHealth) * _maxBarLength;
    return(barWidthMaybe);
}
function spawnBushes(_amount){
    for (i = 0; i < _amount; i++) {
        bushesGroup.add
        var zSpawnY = random(0, GAME_HEIGHT);
        var zSpawnX = random(0, GAME_WIDTH);
        var zSpawnSize = random(64, 128);
        bush = new Sprite(zSpawnX, zSpawnY, zSpawnSize, "k");
        bush.color = ('#25960BFF');
        bush.stroke = ('#186307FF');
        bushesGroup.add(bush);
    }
}
/*******************************************************/
//  End screen
/*******************************************************/
function deathScreen() {
    background('#A10808FF');
    textSize(30);
    text(("you died your score was: " + score), 50, 50);
}
/*******************************************************/
//
//  END OF GAME
//
/*******************************************************/
