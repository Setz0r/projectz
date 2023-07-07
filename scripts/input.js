var zelda = zelda || {};

var KEYCODE_LEFT = 37,
    KEYCODE_RIGHT = 39,
    KEYCODE_UP = 38,
    KEYCODE_DOWN = 40,
    KEYCODE_D = 68,
    KEYCODE_F = 70,
    KEYCODE_M = 77;

zelda.key_left = false;
zelda.key_right = false;
zelda.key_up = false;
zelda.key_down = false;

zelda.attacking = false;

zelda.keyPressed = function (event) {
    if (!event) { var event = window.event; }
    switch (event.keyCode) {
        case KEYCODE_LEFT:
            this.key_left = true;
            break;
        case KEYCODE_RIGHT:
            this.key_right = true;
            break;
        case KEYCODE_UP:
            this.key_up = true;
            break;
        case KEYCODE_DOWN:
            this.key_down = true;
            break;
        case KEYCODE_F:
            this.key_f = true;
            break;
        case KEYCODE_M:
            console.log(zelda.link.x);
            console.log(zelda.link.y);
            console.log(zelda.link.tileX);
            console.log(zelda.link.tileY);
            createjs.Tween.get(zelda.link.sprite).to({ x: 480 }, 1000);

//            zelda.loadMap(1);
//            zelda.link.checkWarp(zelda.worldMapData[1]);
            if (this.playMusic) {
                //createjs.Sound.stop();
                this.playMusic = false;
            } else {
                //createjs.Sound.play('overworld_music');
                this.playMusic = true;
            }
            break;
    }
};

zelda.keyReleased = function (event) {
    if (!event) { var event = window.event; }
    switch (event.keyCode) {
        case KEYCODE_LEFT:
            this.key_left = false;
            break;
        case KEYCODE_RIGHT:
            this.key_right = false;
            break;
        case KEYCODE_UP:
            this.key_up = false;
            break;
        case KEYCODE_DOWN:
            this.key_down = false;
            break;
        case KEYCODE_F:
            this.key_f = false;
            break;
    }
};
