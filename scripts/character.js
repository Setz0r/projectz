var zelda = zelda || {};

function Character(options) {
    this.inventory = {};
    this.map = 0;
    this.state = STATE_IDLE;
    this.type = 'character';
    if (options) {
        $.extend(this, options);
    }
};

Character.inheritsFrom(Entity);

Character.prototype.attack = function () {
    if (!(this.state == STATE_ATTACKING)) {
        this.state = STATE_ATTACKING;
        zelda.woodSwordSprite.x = this.x;
        zelda.woodSwordSprite.y = this.y;
        zelda.stage.addChild(zelda.woodSwordSprite);
        zelda.stage.setChildIndex(zelda.woodSwordSprite, zelda.stage.getChildIndex(this.sprite));
        zelda.woodSwordSprite.gotoAndStop(this.facing);
        var $me = this;
        var newX = this.x;
        var newY = this.y;
        switch (this.facing) {
            case 'down':
                newY = this.y + 24;
                break;
            case 'up':
                newY = this.y - 24;
                break;
            case 'left':
                newX = this.x - 24;
                break;
            case 'right':
                newX = this.x + 24;
                break;
        }
        function tweenComplete(obj) {
            function stabComplete(obj) {
                zelda.stage.removeChild(zelda.woodSwordSprite);
                $me.sprite.gotoAndStop(zelda.link.facing, 0);
                $me.state = STATE_IDLE;
            }
            createjs.Tween.get(zelda.woodSwordSprite).to({ x: $me.x, y: $me.y }, 150).call(stabComplete);
            $me.sprite.gotoAndPlay(obj.facing);
        }
        createjs.Tween.get(zelda.woodSwordSprite).to({ x: newX, y: newY }, 150).call(tweenComplete);
        //    createjs.Sound.play('swordshoot_fx', {interrupt:createjs.Sound.INTERRUPT_ANY});
        zelda.stabSFX.play({ pan: ($me.x/256)-1 });
    }

};

Character.prototype.die = function () {

};

Character.prototype.useItem = function () {

};

Character.prototype.checkWarp = function (map) {
    var $this = this;
    if (map.warps && map.warps.length > 0) {
        $.each(map.warps, function (i, warp) {
            if (warp.x == $this.tileX && warp.y == $this.tileY) {
                zelda.loadMap(warp.map, { x: warp.destX * 32, y: (warp.destY * 32) + 128, facing: warp.facing });
            }
        });
    }
};

Character.prototype.update = function () {
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
        case STATE_SCREENSWITCHING:

            break;
        case STATE_ATTACKING:
            if (this.sprite.currentAnimation != 'stab' + this.facing) {
                this.sprite.gotoAndPlay('stab' + this.facing);
            }
            break;
    }

};