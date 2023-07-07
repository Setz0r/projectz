var zelda = zelda || {};


zelda.facing = 'up';
zelda.posY = 256;
zelda.moveInc = 1;

zelda.map = $.urlParam('map') || 0;
zelda.prevMap = zelda.map;

zelda.playMusic = true;
zelda.mapSwitching = false;

//main Game Logic loop

zelda.gameLoop = function (event) {
    var $this = zelda;
    if ($this.key_f && !(zelda.link.state == STATE_ATTACKING)) {
        $this.link.attack();
    } else
        if (!(zelda.link.state == STATE_ATTACKING) && !(zelda.link.state == STATE_SCREENSWITCHING) && !zelda.mapSwitching) {
            if ($this.key_up) {
                if (!$this.link.checkCollision(MOVEMENT_NORTH, zelda.worldMapData[$this.map].tiles, zelda.tileData))
                    $this.link.move(MOVEMENT_NORTH);
            } else
                if ($this.key_down) {
                    if (!$this.link.checkCollision(MOVEMENT_SOUTH, zelda.worldMapData[$this.map].tiles, zelda.tileData))
                        $this.link.move(MOVEMENT_SOUTH);
                } else
                    if ($this.key_left) {
                        if (!$this.link.checkCollision(MOVEMENT_WEST, zelda.worldMapData[$this.map].tiles, zelda.tileData))
                            $this.link.move(MOVEMENT_WEST);
                    } else
                        if ($this.key_right) {
                            if (!$this.link.checkCollision(MOVEMENT_EAST, zelda.worldMapData[$this.map].tiles, zelda.tileData))
                                $this.link.move(MOVEMENT_EAST);
                        } else {
                            $this.link.idle();
                        }
        } 
    //$this.red_octoroc.update();
    //$this.otherlink.update();
    $this.link.checkWarp($this.worldMapData[zelda.map]);
    $this.link.update();
    $this.stage.update();
    //console.log('test');
};