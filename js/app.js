var worldBoundX = 394;
var worldBoundY = 394;
var player = {};
var allEnemies = [];
var characterSelection = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
]

// Enemies our player must avoid
var Enemy = function(y, speed) {
    this.x = -200;
    this.y = y;
    this.movementSpeed = speed
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.movementSpeed * dt;
    this.x = this.x > worldBoundX + 100 ? -100 : this.x;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// kill player on collision
Enemy.prototype.collision = function(player) {
    var collisionDetectionLowerBound = this.x - 70;
    var collisionDetectionUpperBound = this.x + 70;
    if(player.x <= collisionDetectionUpperBound
        && player.x >= collisionDetectionLowerBound
        && player.y == this.y ) {
            player.alive = false;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite) {
    this.alive = true;
    this.characterSelected = false;
    this.characterIndexSelected = 0;
    this.selectetorPosition = 0;
    this.respawn = function () {
        this.x = 101;
        this.y = 390;
        this.alive = true;
    }
    this.respawn();
};

Player.prototype.update = function(dt) {
    if(!this.alive) {
        start();
    }
    if(this.y < 0) {
        this.respawn();
        console.log("You Win!")
    }
}

Player.prototype.render = function() {
    if(this.characterSelected) {
        ctx.drawImage(Resources.get(characterSelection[this.characterIndexSelected]), this.x, this.y);
    }
    else {

        ctx.drawImage(Resources.get('images/Selector.png'), this.selectetorPosition, this.y);
        for(var characterindex in characterSelection) {
            ctx.drawImage(Resources.get(characterSelection[characterindex]), characterindex * 100, this.y);
        }
    }
};

Player.prototype.handleInput = function(move) {
    if(this.characterSelected)
    {
        if (move === 'left' && this.x > 0) {
            this.x -= 101;
        }
        if (move === 'right' && this.x < worldBoundX) {
            this.x += 101;
        }
        if (move === 'up' && this.y > 0) {
            this.y -= 80;
        }
        if (move === 'down' && this.y < worldBoundY) {
            this.y += 80;
        }
    }
    else if(move === 'enter') {
        this.characterSelected = true;
    }
    else {
        if (move === 'left' && this.selectetorPosition > 0) {
            this.selectetorPosition -= 100;
            this.characterIndexSelected = this.selectetorPosition / 100;
        }
        var upperBound = (characterSelection.length-1) * 100
        if (move === 'right' && this.selectetorPosition < upperBound) {
            this.selectetorPosition += 100;
            this.characterIndexSelected = this.selectetorPosition / 100;
        }
    }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
start = function () {
    allEnemies = [];
    allEnemies.push(new Enemy(70, 220),
    new Enemy(150, 160),
    new Enemy(230, 101));

    player = new Player();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});



start();