/*******************************************************/
// Game Name: Undead Unleashed
const VERSION_NUM = '2.1.0'
// Written by Cliff Harfield
/*******************************************************/
console.log('Boot UndUnl');
// Seting up the variable and constants etc
var score = 0;
var player;
var playerColour = 'red';
var playerWeapon;
var swingSpeed = 6;
var defaultZHealthMin = 20;
var defaultZHealthMax = 100;
var swordKnockBack = 3;
var playerMaxHealth = 80; // temporary health value
var playerDamage = 10; // temporary damage value
var playerSpeed = 4; // temporary speed for home screen
var queueNum = 0;
var gameDifficulty = 'Normal';
var startButton;
var difficultyButton;
var zombieSpeed = 1;
var zombieSpawnOffSet = 100;
var zombieSpawnRate = 6;
var speedSlider;
var speedIcon;
var healthSlider;
var healthIcon;
var damageSlider;
var damageIcon;
var continueButton;
var behindHealthBar;
var behindStaminaBar;
var totalSkill;
var speedBackup = 4;
var maxStamina = 1000;
var levelUpNum = 100;
let gameState = 'startScreen'; // starts the game in the start menu state
const PLAYER_SCALE = 36;
const GAME_WIDTH = 3000;
const GAME_HEIGHT = 3000;

// the preload function
function preload() {
    playerTexure = loadImage('texures/purplePlayer.png');
    playerSwordTexure = loadImage('texures/swordTexure.png')
}
/*******************************************************/
// setup()
/*******************************************************/
function setup() {
    console.log(" setup: Undead Unleashed");
    cnv= new Canvas(windowWidth, windowHeight);
    // creating the walls
    wallLH  = new Sprite(0, GAME_HEIGHT / 2, 0, GAME_HEIGHT, 'k');
    wallLH.color = 'black';
    wallRH  = new Sprite(GAME_WIDTH, GAME_HEIGHT / 2, 0, GAME_HEIGHT, 'k');
    wallRH.color = "black";
    wallTop = new Sprite(GAME_WIDTH / 2, 0, GAME_WIDTH, 0, 'k');
    wallTop.color = 'black';
    wallBot = new Sprite(GAME_WIDTH / 2, GAME_HEIGHT, GAME_WIDTH, 0, 'k');
    wallBot.color = 'black';
    horedGroup = new Group();
    bushesGroup = new Group();
    // reseting the game to start
    resetGame();
    startSetup();
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {
    // this tells the game what state it is in
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
// the start screen function
function startScreen () {
    background('#674C85');
    textSize(40);
    text(("Use wasd to move \nUse the mouse to aim your sword"), 50, 100);
    controlsForPlayer ()
    player.rotateMinTo(mouse, 9, 90);//speed 9 found from testing and 90 is to point the sprite the correct ways
    playerWeapon.rotateMinTo(mouse, swingSpeed, 90);
    startButton.collides(playerWeapon, swordHitPlayButton);
    difficultyButton.collides(playerWeapon, toggleDifficulty);
    difficultyButton.text = gameDifficulty;
}
// creating temporary walls for menus along side setting up everything into veiw
function startSetup() {
    tempWallBot = new Sprite(windowWidth / 2, windowHeight, windowWidth, 0, 'k');
    tempWallBot.color = 'black';
    tempWallRH = new Sprite(windowWidth, windowHeight / 2, 0, windowHeight, 'k');
    tempWallRH.color = "black";
    // start menu buttons
    startButton = new Sprite(windowWidth / 4, windowHeight / 3, 80, 'k');
    startButton.textSize = 30;
    startButton.text = "Play";
    startButton.health = 25;
    startButton.color = '#C998D7';
    // dificaulty button
    difficultyButton = new Sprite(windowWidth / 4 * 3, windowHeight / 3, 80, 'k');
    difficultyButton.textSize = 17;
    difficultyButton.health = 20;
    difficultyButton.color = '#C998D7';
    // moving the player in veiw
    player.pos.x = windowWidth / 2;
    player.pos.y = windowHeight / 2;
    playerWeapon.pos.x = windowWidth / 2;
    playerWeapon.pos.y = windowHeight / 2;
}
// removeing the temp walls
function noTempSprites(){
    tempWallBot.remove();
    tempWallRH.remove();
    player.remove();
    playerWeapon.remove();
    startButton.remove();
    difficultyButton.remove();
}
// this is the player attacking the play button
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
// toggle the game difficulty dosent do anything right now
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
// the stat selection screen
function preGameScreen(){
    background('#674C85');
    textSize(30);
    text('Allocate your stats:', 50, 100);
    text('Speed', windowWidth / 4, 150);
    text('Health', windowWidth / 4, 200);
    text('Damage', windowWidth / 4, 250);
    totalSkill = speedSlider.value() + healthSlider.value() + damageSlider.value();
    speedIcon.text = floor(speedSlider.value() / totalSkill * 100);
    healthIcon.text = floor(healthSlider.value() / totalSkill * 100);
    damageIcon.text = floor(damageSlider.value() / totalSkill * 100);
}
// setting up the stat selection screen
function steupPreGame(){
    // setting up the sliders and there displays
    speedSlider = createSlider(1, 101, 1, 1);
    speedSlider.position(windowWidth / 4, 150);
    speedSlider.size(windowWidth / 2);
    speedSlider.color = '#2E79FFFF';
    speedIcon = new Sprite(windowWidth-windowWidth / 4 + 26, 158, 40, 'k');
    speedIcon.color = '#2E79FFFF';
    speedIcon.textSize = 20;
    healthSlider = createSlider(1, 101, 1, 1);
    healthSlider.position(windowWidth / 4, 200);
    healthSlider.size(windowWidth / 2);
    healthIcon = new Sprite(windowWidth-windowWidth / 4 + 26, 208, 40, 'k');
    healthIcon.color = '#FF17BFFF';
    healthIcon.textSize = 20;
    damageSlider = createSlider(1, 101, 1, 1);
    damageSlider.position(windowWidth / 4, 250);
    damageSlider.size(windowWidth / 2);
    damageIcon = new Sprite(windowWidth-windowWidth / 4 + 26, 258, 40, 'k');
    damageIcon.color = '#FF0101FF';
    damageIcon.textSize = 20;
    // the button that take you to the game when pressed
    continueButton = createButton('Continue');
    continueButton.position(windowWidth / 2 - continueButton.width / 2, 300);
    continueButton.mousePressed(startGame);
    continueButton.style('background-color', "#553E6DFF");
    continueButton.style('color', '#E8E8E8FF');
    continueButton.style("font-family", 'Verdana');
    continueButton.style("font-size", '30px');
    continueButton.style("border-style", "outset");
    continueButton.style("border-radius", "20px");
    continueButton.style("border-width", "thick");
}
// starts the game
function startGame() {
    playerMaxHealth = healthSlider.value() / totalSkill * 120;
    playerDamage = damageSlider.value() / totalSkill * 100;
    playerSpeed = speedSlider.value() / totalSkill * 12 + 0.1;
    speedBackup = speedSlider.value() / totalSkill * 12 + 0.1;
    speedSlider.remove();
    speedIcon.remove();
    healthSlider.remove();
    healthIcon.remove();
    damageSlider.remove();
    damageIcon.remove();
    continueButton.remove();
    noTempSprites();
    spawnZombiesQueue(1);
    gameState='game';
    resetGame();
}
/*******************************************************/
// The game its self
/*******************************************************/
// game function
function game() {
    background('#36BF28FF');
    camera.pos = player.pos;
    textSize(30);
    text(("Score: " + score), 200, 200);
    textSize(16);
    player.rotateMinTo(mouse, 9, 90);//speed 8 found from testing and 90 is to point the sprite the correct ways
    playerWeapon.rotateMinTo(mouse, swingSpeed, 90);
    controlsForPlayer ();
    centerGUI();
    moveZombiesTowardsPlayer();
    zombieSpeed = zombieSpeed + 0.001;
    zombieSpawnTimer();
}
// this is the reset game function
function resetGame() {
    // getting the player ready
    player = new Sprite(GAME_WIDTH/2, GAME_HEIGHT/2, PLAYER_SCALE, 'd')
    player.stroke = 'white';
    player.addImage(playerTexure);
    //tint(playerColour);
    player.health = playerMaxHealth;
    playerTexure.resize(PLAYER_SCALE, PLAYER_SCALE);
    // getting the players wepon ready
    playerWeapon = new Sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, PLAYER_SCALE / 2, PLAYER_SCALE * 2, 'd')
    playerWeapon.stroke = 'white';
    playerWeapon.drag = 1;
    playerWeapon.offset.y = -50;
    playerWeapon.addImage(playerSwordTexure);
    playerSwordTexure.resize(PLAYER_SCALE, PLAYER_SCALE * 2);
    // the connection point between the player and its sword
    playerHands = new WheelJoint(playerWeapon, player);
    playerHands.visible = 'false';
    playerHands.springiness = 0.01;
    // damage a zombie detection
    horedGroup.collides(playerWeapon, swordHitZombie);
    // damage the player detecton
    player.collides(horedGroup, zombieHitPlayer);
    // healthbar setup but only if in the game
    if (gameState == 'game') {
        spawnBushes(random(25, 60));
        makeHeathBar();
        makeStaminaAndEpBars();
    }
}
// center GUI function
function centerGUI() {
    // Centering health bar
    behindHealthBar.pos.x = player.pos.x;
    behindHealthBar.pos.y = player.pos.y + (windowHeight / 2) - 140;
    healthBar.pos.x = behindHealthBar.pos.x;
    healthBar.pos.y = behindHealthBar.pos.y;

    // Centering stamina bar
    behindStaminaBar.pos.x = player.pos.x - windowWidth / 12 - 5;
    behindStaminaBar.pos.y = player.pos.y + (windowHeight / 2) - 50;
    staminaBar.pos.x = behindStaminaBar.pos.x;
    staminaBar.pos.y = behindStaminaBar.pos.y;
    
    // Centering xp bar
    behindXpBar.pos.x = player.pos.x + windowWidth / 12 + 5;
    behindXpBar.pos.y = player.pos.y + (windowHeight / 2) - 50;
    XpBarGoal.pos.x = behindXpBar.pos.x;
    XpBarGoal.pos.y = behindXpBar.pos.y;
    XpBar.pos.x = behindXpBar.pos.x;
    XpBar.pos.y = behindXpBar.pos.y;
}
// movement code, called in game function and start screen function in the draw loop.
function controlsForPlayer () {
    // movment controls (WASD)
    if (kb.pressing('a')){
        player.vel.x = -playerSpeed;
        //speedUp();
    }
    if (kb.released('a')){
        player.vel.x = 0;
        playerWeapon.vel.x = 0;
        //speedDown();
    }
    if (kb.pressing('d')){
        player.vel.x = +playerSpeed;
        //speedUp();
    }
    if (kb.released('d')){
        player.vel.x = 0;
        playerWeapon.vel.x = 0;
        //speedDown();
    }
    if (kb.pressing('w')){
        player.vel.y = -playerSpeed;
        //speedUp();
    }
    if (kb.released('w')){
        player.vel.y = 0;
        playerWeapon.vel.y = 0;
        //speedDown();
    }
    if (kb.pressing('s')){
        player.vel.y = +playerSpeed; 
        //speedUp();
    }
    if (kb.released('s')){
        player.vel.y = 0;
        playerWeapon.vel.y = 0;
        //speedDown();
    }
    // this keeps the player from gliding
    if (player.vel.y <= (playerSpeed - 1)) {
        if (player.vel.y >= (-playerSpeed + 1)) player.vel.y = 0;
    }
    if (player.vel.x <= (playerSpeed - 1)) {
        if (player.vel.x >= (-playerSpeed + 1)) player.vel.x = 0;
    }
    if (player.vel.y > playerSpeed) player.vel.y = 0;
    if (player.vel.x > playerSpeed) player.vel.x = 0;
    if (player.vel.y < -playerSpeed) player.vel.y = 0;
    if (player.vel.x < -playerSpeed) player.vel.x = 0;
    // Weapon controls
    if (mouse.pressing()){
        if (gameState == "game") {
            if (staminaBar.health <= 1){
                //tooLittleStamina();
                swingSpeed = 6;
            } else{
                StaminaUsed(0.5);
                swingSpeed = 20;
            }
        } else {
            swingSpeed = 20;
        }
    }
    if (mouse.released()) swingSpeed = 6;
    //sprint key
    if (kb.pressing('shift')){
        if (gameState == "game") {
            if (staminaBar.health <= 1){
                //tooLittleStamina();
                playerSpeed = (speedBackup / 1.5);
            } else{
                StaminaUsed(1);
                playerSpeed = (speedBackup * 1.5);
            }
        } else {
            playerSpeed = (speedBackup * 1.5);
        }
    }
    if (kb.released('shift')) playerSpeed = (speedBackup / 1.5);
    //testing buttons
    //if (kb.presses('1')) player.health = 100000;
    //if (kb.presses('2')) console.log(playerSpeed);
    //if (kb.presses('3')) XpBarGain(20);
    //if (kb.presses('4')) console.log(zombieSpawnRate);
    if (kb.presses('e')) allSprites.debug = true;
    if (kb.released('e')) allSprites.debug = false;
    // speed zoom broken
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
// this spawns the zombies
function zombieSpawnTimer () {
    zombieSpawnOffSet++;
    if (zombieSpawnOffSet > zombieSpawnRate * 80) {
        zombieSpawnOffSet = 0;
        if (zombieSpawnRate >= 0.1){
            zombieSpawnRate = zombieSpawnRate / 1.06;
            spawnZombiesQueue(random(1, 3));
        } else {
            spawnZombiesQueue(1);
        }
    }
}
// this is the spawn queue
function spawnZombiesQueue (_amountToQueue){
    queueNum = queueNum + _amountToQueue;
    if (queueNum >= 1){
        queueNum = queueNum - 1;
        spawnZombies(1);
    }
}
// this creates the zombies
function spawnZombies (_amount){
    for (i = 0; i < _amount; i++) {
        var zSpawnY = random(0, GAME_HEIGHT);
        var zSpawnX = random(0, GAME_WIDTH);
        var zSpawnSize = random(20, 34);
        var zSpawnHealth = floor(random(defaultZHealthMin, defaultZHealthMax));
        if (validateSpawnLocation(zSpawnX, zSpawnY)){
            zombie = new Sprite(zSpawnX, zSpawnY, zSpawnSize, "d");
            zombie.color= "darkGreen";
            zombie.health = zSpawnHealth;
            zombie.friction = 1.5;
            zombie.textSize = 15;
            horedGroup.add(zombie);
            spawnZombiesQueue (0);
        } else {
            spawnZombiesQueue (1);
        }
    }
}
// this is the player attacking zombie code
function swordHitZombie(_zombie, _player) {
    _zombie.health = _zombie.health - playerDamage;
    _zombie.text = floor(_zombie.health);
    _zombie.applyForce(swordKnockBack);
    // Remove zombie if health is zero of below
    if (_zombie.health <= 0){
        _zombie.remove();
        score++;
        XpBarGain(random(2,5));
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
// chatgpt help ends
// spawn outside of player veiw code
function validateSpawnLocation(_xPos, _yPos){
    var valid
    if (dist(_xPos, _yPos, player.pos.x, player.pos.y) > windowHeight){
        return(true);
    } else {
        return(false);
    }
}
// player being hit by zombie
function zombieHitPlayer(_zombie) {
    player.health--;
    healthBar.w = (healthBarLength(player.health, windowWidth - 55));
    if (player.health <= 0) {
        noTempSprites();
        console.log('player death');
        //camera.zoomTo(3, 0.0006);
        deathSetup();
        gameState='death';
    }
}
// player healbar display
function makeHeathBar() {
    var barWidth = windowWidth - 55;
    var barHeight = windowHeight / 8 - 15;
    var barX = windowWidth / 2 - barWidth / 2;
    var barY = windowHeight - 90;
    behindHealthBar = new Sprite(barX, barY, barWidth + 20, barHeight + 20, 'n');
    behindHealthBar.color = 'black';
    behindHealthBar.stroke = 'black';
    healthBar = new Sprite(barX, barY, barWidth, barHeight, 'n');
    healthBar.color = '#C22B19FF';
    healthBar.stroke = 'black';
}
// this sets the lenght of the healthbar 
function healthBarLength (_currentHealth, _maxBarLength) {
    var barWidthMaybe = (_currentHealth / playerMaxHealth) * _maxBarLength;
    return(barWidthMaybe);
}
//this makes the stamina bars etc
function makeStaminaAndEpBars() {
    var barsWidth = windowWidth / 6;
    var barsHeight = windowHeight / 12 - 15;
    var StaminaBarX = windowWidth / 2 - barsWidth / 2;
    var StaminaBarY = windowHeight - healthBar.y - 40;
    behindStaminaBar = new Sprite(StaminaBarX, StaminaBarY, barsWidth + 20, barsHeight + 20, 'n');
    behindStaminaBar.color = 'black';
    behindStaminaBar.stroke = 'black';
    staminaBar = new Sprite(StaminaBarX, StaminaBarY, barsWidth, barsHeight, 'n');
    staminaBar.color = '#13AEFF';
    staminaBar.stroke = '#13AEFF';
    staminaBar.health = maxStamina;
    // Xp bar
    var XpBarX = windowWidth / 2 - barsWidth / 2;
    var XpBarY = windowHeight - healthBar.y - 40;
    behindXpBar = new Sprite(XpBarX, XpBarY, barsWidth + 20, barsHeight + 20, 'n');
    behindXpBar.color = 'black';
    behindXpBar.stroke = 'black';
    XpBarGoal = new Sprite(XpBarX, XpBarY, barsWidth, barsHeight, 'n');
    XpBarGoal.color = '#7C8F06FF';
    XpBarGoal.stroke = '#7C8F06FF';
    XpBar = new Sprite(XpBarX, XpBarY, 0, barsHeight, 'n');
    XpBar.color = '#DDFF0AFF';
    XpBar.stroke = '#7C8F06FF';
    XpBar.health = 1;
}
// this make all the bushes and places them randomly
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
//use staminca code
function StaminaUsed(_amount){
    if(staminaBar.health - _amount <= 0){
        console.error("low stamina");
    } else {
        staminaBar.health = (staminaBar.health - _amount);
        staminaBar.w = (staminaBarLength(staminaBar.health, windowWidth / 6));
    }
}
function staminaBarLength(_currentAmount, _maxBarLength) {
    var barWidthMaybe = (_currentAmount / maxStamina) * _maxBarLength;
    return(barWidthMaybe);
}
// xp bar gain code
function XpBarGain(_amount) {
    XpBar.health = XpBar.health + _amount;
    if(XpBar.health > levelUpNum){
        console.log("Level Up");
        staminaBar.health = maxStamina;
        XpBar.health = 1;
        XpBar.w = (XpBarLength(XpBar.health, windowWidth / 6));
        //level up code gose here
    } else {
        XpBar.w = (XpBarLength(XpBar.health, windowWidth / 6));
    }
}
function XpBarLength(_currentAmount, _maxBarLength) {
    var barWidthMaybe = (_currentAmount / levelUpNum) * _maxBarLength;
    return(barWidthMaybe);
}
/*******************************************************/
//  End screen
/*******************************************************/
function deathScreen() {
    background('#A10808FF');
    textSize(30);
    text(("you died your score was: " + score), 50, 50);
}
//sets up the death screen
function deathSetup() {
    restartButton = createButton('Play Again?');
    restartButton.position(windowWidth / 2 - restartButton.width / 2, windowHeight/5);
    restartButton.mousePressed(restartGame);
    restartButton.style('background-color', "#720606FF");
    restartButton.style('color', '#E8E8E8FF');
    restartButton.style("font-family", 'Verdana');
    restartButton.style("font-size", '30px');
    restartButton.style("border-style", "outset");
    restartButton.style("border-radius", "20px");
    restartButton.style("border-width", "thick");
    //restartButton.style
}
//restets that game
function restartGame() {
    console.log("resetting")
    restartButton.remove();
    allSprites.removeAll();
    setup();
    resetVarables();
    gameState = 'startScreen';
}
// reset varables to there defaults
function resetVarables() {
    score = 0;
    player;
    swingSpeed = 6;
    defaultZHealthMin = 20;
    defaultZHealthMax = 100;
    swordKnockBack = 3;
    playerMaxHealth = 80; // temporary health value
    playerDamage = 10; // temporary damage value
    playerSpeed = 4; // temporary speed for home screen
    queueNum = 0;
    gameDifficulty = 'Normal';
    zombieSpeed = 1;
    zombieSpawnOffSet = 100;
    zombieSpawnRate = 6;
    speedBackup = 4;
    maxStamina = 1000;
    levelUpNum = 100;
}
/*******************************************************/
//
//  END OF GAME
//
/*******************************************************/
