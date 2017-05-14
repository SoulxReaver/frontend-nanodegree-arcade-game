'use strict';

var WORLD_BOUND_X = 394;
var WORLD_BOUND_Y = 394;
var ENEMEIES_DEFAULT_POSITION_X = -200;
var player = {};
var allEnemies = [];
var CHAR_SELECTION = [
    {
        sprite: 'images/char-boy.png',
        x: 0,
        y: WORLD_BOUND_Y
    },
    {
        sprite: 'images/char-cat-girl.png',
        x: 101,
        y: WORLD_BOUND_Y
    },
    {
        sprite: 'images/char-horn-girl.png',
        x: 202,
        y: WORLD_BOUND_Y
    },
    {
        sprite: 'images/char-pink-girl.png',
        x: 303,
        y: WORLD_BOUND_Y
    },
    {
        sprite: 'images/char-princess-girl.png',
        x: 404,
        y: WORLD_BOUND_Y
    }
];

var CHAR_SELECTOR = {
    sprite: 'images/Selector.png',
    x: 0,
    y: WORLD_BOUND_Y
};

var Entity = function (x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

// Draw the entites on the screen
Entity.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function (y, speed) {
    this.x = ENEMEIES_DEFAULT_POSITION_X;
    this.y = y;
    this.size = 70;
    this.movementSpeed = speed;
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.movementSpeed * dt;
    this.x = this.x > WORLD_BOUND_X + 100 ? -100 : this.x;
};

/**
 * @description Represents a Player
 * @constructor
 */
var Player = function (x, y, sprite) {
    this.sprite = sprite;
    this.defaultPositionX = x;
    this.defaultPositionY = y;
    this.x = x;
    this.y = y;
    this.characterSelected = false;
    this.characterIndexSelected = 0;
    this.score = 0;
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

/**
 * @description if player reach the end of the board they win. if they are not alive then restart the game
 * @param {number} dt - a time delta between ticks
 */
Player.prototype.update = function (dt) {
    document.getElementsByClassName("score")[0].innerHTML = this.score;
    
};

/**
 * @description render player
 */
Player.prototype.render = function () {
    Object.getPrototypeOf(Player.prototype).render.call(this);
    if (!this.characterSelected) {
        CHAR_SELECTION.forEach(function (char) {
            ctx.drawImage(Resources.get(char.sprite), char.x, char.y);
        });
    }
    if (this.y < 0) {
        this.respawn();
        this.addScore(100);
    }
};

/**
 * @description update player postion
 * @param move - key pressed
 */
Player.prototype.handleInput = function (move) {
    if (!this.characterSelected) {
        this.handleInputForCharacterSelection(move);
    }
    else {
        this.handleInputForGamePlay(move);
    }
};

/**
 * @description player control on character selection
 */
Player.prototype.handleInputForCharacterSelection = function (move) {
    if (move === 'enter') {
        this.characterSelected = true;
        this.sprite = CHAR_SELECTION[this.characterIndexSelected].sprite;
    }
    if (move === 'left' && this.x > 0) {
        this.x -= 101;
        this.characterIndexSelected--;
    }

    if (move === 'right' && this.x < WORLD_BOUND_X) {
        this.x += 101;
        this.characterIndexSelected++;
    }
};

/**
 * @description player control after character selection
 */
Player.prototype.handleInputForGamePlay = function (move) {
    if (move === 'left' && this.x > 0) {
        this.x -= 101;
    }

    if (move === 'right' && this.x < WORLD_BOUND_X) {
        this.x += 101;
    }

    if (move === 'up' && this.y > 0) {
        this.y -= 80;
    }

    if (move === 'down' && this.y < WORLD_BOUND_Y) {
        this.y += 80;
    }
};

/**
 * @description update ScoreBoard
 * @param Score
 */
Player.prototype.addScore = function (score) {
    this.score += score;
};

/**
 * @description clear ScoreBoard
 */
Player.prototype.resetScore = function () {
    this.score = 0;
};

/**
 * @description set default player position
 */
Player.prototype.respawn = function () {
    this.x = this.defaultPositionX;
    this.y = this.defaultPositionY;
};


/**
 * @description create allEnemies and player
 */
var start = function () {
    allEnemies = [];
    allEnemies.push(
        new Enemy(74, 220),
        new Enemy(154, 160),
        new Enemy(234, 101)
    );

    player = new Player(CHAR_SELECTOR.x, CHAR_SELECTOR.y, CHAR_SELECTOR.sprite);
};

/**
 * @description This listens for key presses and sends the keys to your
 *  Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});