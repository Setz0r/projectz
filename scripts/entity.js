var zelda = zelda || {};

var MOVEMENT_NORTH = 1,
    MOVEMENT_EAST = 2,
    MOVEMENT_SOUTH = 3,
    MOVEMENT_WEST = 4;

var STATE_IDLE = 0,
    STATE_MOVING = 1,
    STATE_ATTACKING = 2,
    STATE_HOLD_ONEHAND = 3,
    STATE_HOLD_TWOHAND = 4,
    STATE_DYING = 5,
    STATE_SCREENSWITCHING = 6;


function Entity(options) {
    this.x = 0;
    this.y = 0;
    this.tileX = 0;
    this.tileY = 0;
    this.facing = 'up';
    this.speed = 2;
    this.animation = 0;
    this.frame = 0;
    this.state = STATE_IDLE;
    this.health = 10;
    this.inventory = {};
    this.sprite = { x:0, y:0 };
    this.frameCount = 0;
    this.type = 'entity';
    if (options) {
        $.extend(this, options);
    }
    this.sprite.x = this.x;
    this.sprite.y = this.y;
};


Entity.prototype.setPosition = function (x, y, facing, frame) {
    if (typeof x=='number') this.x = x;
    if (typeof y=='number') this.y = y;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    if (facing) this.facing = facing;
    if (frame) this.frame = frame;
    this.tileX = Math.floor((this.x + 16) / 32);
    this.tileY = Math.floor((this.y - 128 + 24) / 32);
};

Entity.prototype.setPositionTween = function (x, y, facing, frame) {

    var distance = zelda.pointDistance(this.sprite.x, this.sprite.y, x, y);
    //console.log(distance);
    if (typeof x == 'number') this.x = x;
    if (typeof y == 'number') this.y = y;
    createjs.Tween.get(this.sprite).to({ x: this.x, y: this.y }, (8*distance)+100);
    if (facing) this.facing = facing;
    if (frame) this.frame = frame;
    this.tileX = Math.floor((this.x + 16) / 32);
    this.tileY = Math.floor((this.y - 128 + 24) / 32);
};

Entity.prototype.checkCollision = function (dir, map, tile_data, spd) {
    var speed = spd || this.speed;
    switch (dir) {
        case MOVEMENT_NORTH:
            var goTileX = Math.floor((this.x + 16) / 32);
            var goTileY = Math.floor((this.y - 128 - speed) / 32);
            break;
        case MOVEMENT_SOUTH:
            var goTileX = Math.floor((this.x + 16) / 32);
            var goTileY = Math.floor((this.y - 128 + 32 + speed) / 32);
            break;
        case MOVEMENT_EAST:
            var goTileX = Math.floor((this.x + 32 + speed) / 32);
            var goTileY = Math.floor((this.y - 128 + 16) / 32);
            break;
        case MOVEMENT_WEST:
            var goTileX = Math.floor((this.x - speed) / 32);
            var goTileY = Math.floor((this.y - 128 + 16) / 32);
            break;
    }
    //General tests for leaving the screen
    if (zelda.worldMapData[zelda.map].exits) {
        var $exitData = zelda.worldMapData[zelda.map].exits;

        if (goTileX < 0) {
            //going west  
            if (this.type == 'player') {
                if (typeof $exitData.west == 'number' && $exitData.west >= 0) {
                    zelda.loadMap($exitData.west, { x: 15 * 32, y: (zelda.link.tileY * 32) + 128, transition: 'west' });
                } else if (typeof $exitData.west == 'object' && $exitData.west.map >= 0) {
                    zelda.loadMap($exitData.west.map, { x: $exitData.west.tileX * 32, y: ($exitData.west.tileY * 32) + 128, facing: $exitData.west.facing });
                }
            }
            return false;
        } else if (goTileX > 15) {
            //going east
            if (this.type == 'player') {
                if (typeof $exitData.east == 'number' && $exitData.east >= 0) {
                    zelda.loadMap($exitData.east, { x: 0, y: (zelda.link.tileY * 32) + 128, transition: 'east' });
                } else if (typeof $exitData.east == 'object' && $exitData.east.map >= 0) {
                    zelda.loadMap($exitData.east.map, { x: $exitData.east.tileX * 32, y: ($exitData.east.tileY * 32) + 128, facing: $exitData.east.facing });
                }
            }
            return false;
        } else if (goTileY < 0) {
            //going north
            if (this.type == 'player') {
                if (typeof $exitData.north == 'number' && $exitData.north >= 0) {
                    zelda.loadMap($exitData.north, { x: zelda.link.tileX * 32, y: (10 * 32) + 128, transition: 'north' });
                } else if (typeof $exitData.north == 'object' && $exitData.north.map >= 0) {
                    zelda.loadMap($exitData.north.map, { x: $exitData.north.tileX * 32, y: ($exitData.north.tileY * 32) + 128, facing: $exitData.north.facing });
                }
            }
            return false;
        } else if (goTileY > 10) {
            //going south
            if (this.type == 'player') {
                if (typeof $exitData.south == 'number' && $exitData.south >= 0) {
                    zelda.loadMap($exitData.south, { x: zelda.link.tileX * 32, y: 128, transition: 'south' });
                } else if (typeof $exitData.south == 'object' && $exitData.south.map >= 0) {
                    zelda.loadMap($exitData.south.map, { x: $exitData.south.tileX * 32, y: ($exitData.south.tileY * 32) + 128, facing: $exitData.south.facing });
                }
            }
            return false;
        } 
    }
    if (tile_data[map[goTileY][goTileX]])
        return (!tile_data[map[goTileY][goTileX]].passable);
    return true;
};

Entity.prototype.move = function (dir, spd, tween) {
    speed = (spd) || this.speed;
    this.state = STATE_MOVING;
    switch (dir) {
        case MOVEMENT_NORTH:
            this.y -= speed;
            this.facing = 'up';
            break;
        case MOVEMENT_SOUTH:
            this.y += speed;
            this.facing = 'down';
            break;
        case MOVEMENT_EAST:
            this.x += speed;
            this.facing = 'right';
            break;
        case MOVEMENT_WEST:
            this.x -= speed;
            this.facing = 'left';
            break;
    }
    if (tween) {
        this.setPositionTween(this.x, this.y);
    } else
    this.setPosition(this.x, this.y);
};

Entity.prototype.idle = function () {
    this.state = STATE_IDLE;
};

Entity.prototype.attack = function () {
    this.state = STATE_ATTACKING;
};

Entity.prototype.die = function () {
    return true;
};

Entity.prototype.update = function () {
    //this.setPosition(this.x, this.y);
};