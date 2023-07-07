var zelda = zelda || {};

function Enemy(options) {
    this.roam_x = 0;
    this.roam_y = 0;
    this.roaming = false;
    this.roam_speed = 10;
    this.roam_delay = 1000;
    this.roam_timer = 0;
    this.type = 'enemy';
    if (options) {
        $.extend(this, options);
    }

}

Enemy.inheritsFrom(Entity);

Enemy.prototype.update = function () {
    switch (this.state) {
        case STATE_IDLE:

            this.frameCount++;
            if (this.frameCount > 100000) this.frameCount = 5;
            this.sprite.stop();
            break;
        case STATE_MOVING:

            if (this.sprite.currentAnimation != this.facing) {
                this.sprite.gotoAndStop(this.facing);
                this.sprite.currentAnimationFrame = (this.sprite.currentAnimationFrame == 0) ? 1 : 0;
            }
            if (this.frameCount++ >= 5) {
                this.sprite.currentAnimationFrame = (this.sprite.currentAnimationFrame == 0) ? 1 : 0;
                this.frameCount = 0;
            }

            //this.sprite.gotoAndPlay(this.facing);
            break;
        case STATE_ATTACKING:
            if (this.sprite.currentAnimation != 'stab' + this.facing) {
                this.sprite.gotoAndPlay('stab' + this.facing);
            }
            break;
    }
    this.sprite.x = this.x;
    this.sprite.y = this.y;
};

Enemy.prototype.roam = function (delay_time) {
    var delay = delay_time || this.roam_delay;
    var $this = this;
    var $delay_time = delay_time || 1000;
    var createTimer = function () {
        var direction = Math.floor(Math.random() * 4) + 1

        if (!$this.checkCollision(direction, zelda.worldMapData[zelda.map].tiles, zelda.tileData))
            $this.move(direction, $this.speed+Math.floor(Math.random()*($this.speed*2)), 1);

        $this.sprite.gotoAndPlay($this.facing);
        clearInterval($this.roam_timer);
        var newTimer = Math.ceil(Math.random() * $delay_time + 1000);
        $this.roam(newTimer);
    }

    this.roam_timer = window.setInterval(createTimer, delay);
};

Enemy.prototype.stopRoam = function () {

};