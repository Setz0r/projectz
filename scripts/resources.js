var zelda = zelda || {};

zelda.loadResources = function () {
    console.log('loading resources');
    this.queue = new createjs.LoadQueue();
    this.queue.installPlugin(createjs.Sound);
    this.queue.on('complete', zelda.onResourcesLoaded, this);
    this.queue.loadFile({ id: 'overworld_music', src: 'sound/overworld.ogg' });
    this.queue.loadFile({ id: 'sword_fx', src: 'sound/sword.ogg' });
    this.queue.loadFile({ id: 'swordshoot_fx', src: 'sound/swordshoot.ogg' });
    this.queue.loadManifest([
        { id: 'overworld', src: 'images/overworldtiles.png' },
        { id: 'greenlink', src: 'images/greenlink.png' },
        { id: 'octoroc_red', src: 'images/octoroc_red.png' },
        { id: 'tektite_red', src: 'images/tektite_red.png' },
        { id: 'woodsword', src: 'images/woodsword.png' },
        { id: 'redfire', src: 'images/redfire.png' }
    ]);
    this.stabSFX = createjs.Sound.createInstance('sword_fx');
    this.shootSFX = createjs.Sound.createInstance('swordshoot_fx');
};

zelda.preloadMap = function (mapId) {
    this.mapMonsters = [];
    var masterContainer = new createjs.Container();
    var tempContainer = new createjs.Container(this.mapSprites);
    for (i = 0; i < 16; i++)
        for (j = 0; j < 11; j++) {
            var tile = new createjs.Sprite(this.mapSprites);
            tile.gotoAndStop(this.worldMapData[mapId].tiles[j][i]);
            tile.x = i * 32;
            tile.y = (j * 32) + 128;
            tempContainer.addChild(tile);
        }
    tempContainer.cache(0, 0, 512, 480);
    masterContainer.addChild(tempContainer);
    if (typeof this.worldMapData[mapId].objects == 'object' && this.worldMapData[mapId].objects.length > 0) {
        $.each(this.worldMapData[mapId].objects, function (i, obj) {
            var mapObject = new createjs.Sprite(zelda.mapObjects[obj.object], obj.action);
            mapObject.x = obj.x;
            mapObject.y = obj.y;
            masterContainer.addChild(mapObject);
        });
    }
    if (typeof this.worldMapData[mapId].monsters == 'object' && this.worldMapData[mapId].monsters.length > 0) {
        $.each(this.worldMapData[mapId].monsters, function (i, monster) {
            var newMonster = new Enemy({
                x: monster.x,
                y: monster.y,
                speed: 16,
                sprite: new createjs.Sprite(zelda.monsters[monster.id], monster.facing)
            });
            zelda.mapMonsters.push(newMonster);
            newMonster.roam(newMonster.speed*200);
            newMonster.update();
            masterContainer.addChild(newMonster.sprite);
        });
    }

    //this.red_octoroc = new Enemy({
    //    x: 224,
    //    y: 288,
    //    speed:16,
    //    sprite: new createjs.Sprite(this.redOctorocSprites, 'down')
    //});
    //tempContainer.cache(512,480);
    return masterContainer;
};

zelda.loadMap = function (mapId, options) {
    var options = options || {};
    zelda.map = mapId;
    this.mapImage = this.queue.getResult('overworld');

    this.mapSprites = new createjs.SpriteSheet({
        images: [this.mapImage],
        frames: { width: 32, height: 32, regX: 0, regY: 0, spacing: 2, margin: 2 }
    });
    if ((typeof options.transition != 'undefined') && this.mapContainer) {

        zelda.link.state = STATE_SCREENSWITCHING;
        zelda.mapSwitching = true;
        var scrollComplete = function () {
            zelda.stage.removeChild(zelda.mapContainer);
            zelda.mapContainer = zelda.newMap;
            zelda.link.setPosition(newX, newY, newFacing);
            zelda.mapSwitching = false;
            zelda.link.state = STATE_IDLE;
        };
        var newX = (typeof options.x == 'number') ? options.x : this.link.x;
        var newY = (typeof options.y == 'number') ? options.y : this.link.y;
        var newFacing = (options.facing || this.link.facing);
        var newMapX = 0;
        var newMapY = 0;
        switch (options.transition) {
            case 'west':
                newMapX = -512;
                createjs.Tween.get(this.mapContainer).to({ x: 512 }, 1000).call(scrollComplete);
                createjs.Tween.get(zelda.link.sprite).to({ x: 480 }, 1000);
                break;
            case 'east':
                newMapX = 512;
                createjs.Tween.get(this.mapContainer).to({ x: -512 }, 1000).call(scrollComplete);
                createjs.Tween.get(zelda.link.sprite).to({ x: 0 }, 1000);
                break;
            case 'north':
                newMapY = -352;
                createjs.Tween.get(this.mapContainer).to({ y: 352 }, 1000).call(scrollComplete);
                createjs.Tween.get(zelda.link.sprite).to({ y: 448 }, 1000);
                break;
            case 'south':
                newMapY = 352;
                createjs.Tween.get(this.mapContainer).to({ y: -352 }, 1000).call(scrollComplete);
                createjs.Tween.get(zelda.link.sprite).to({ y: 128 }, 1000);
                break;
        }
        zelda.newMap = this.preloadMap(zelda.map);
        zelda.newMap.x = newMapX;
        zelda.newMap.y = newMapY;

        zelda.stage.addChild(zelda.newMap);
        zelda.stage.setChildIndex(this.newMap, 0);
        createjs.Tween.get(zelda.newMap).to({ x: 0, y:0 }, 1000);
    } else
        if (this.mapContainer) {
        zelda.mapSwitching = true;
        this.stage.removeChild(this.mapContainer);
        this.mapContainer = this.preloadMap(zelda.map);
        this.stage.addChild(this.mapContainer);
        this.stage.setChildIndex(this.mapContainer, 0);
        var newX = (typeof options.x == 'number') ? options.x : this.link.x;
        var newY = (typeof options.y == 'number') ? options.y : this.link.y;
        var newFacing = (options.facing || this.link.facing);
        this.link.setPosition(newX, newY, newFacing);
        zelda.mapSwitching = false;
    } else {
        this.mapContainer = this.preloadMap(zelda.map);
        this.stage.addChild(this.mapContainer);
        this.stage.setChildIndex(this.mapContainer, 0);
    }

};

zelda.onResourcesLoaded = function () {
    this.greenLink = this.queue.getResult('greenlink');
    this.woodSword = this.queue.getResult('woodsword');

    this.monsters = [];
    this.monsters.redOctoroc = this.queue.getResult('octoroc_red');
    this.monsters.redTektite = this.queue.getResult('tektite_red');

    this.mapObjects = [];
    this.mapObjects.redFire = this.queue.getResult('redfire');

    this.linkSprites = new createjs.SpriteSheet({
        images: [this.greenLink],
        frames: { width: 32, height: 32, regX: 0, regY: 0, spacing: 0, margin: 0 },
        animations: {
            down: { frames: [0, 1], speed:0.1 },
            stabdown: 2,
            up: { frames: [3, 4], speed: 0.1 },
            stabup: 5,
            left: { frames: [6, 7], speed: 0.1 },
            stableft: 8,
            right: { frames: [9, 10], speed:0.1 },
            stabright: 11
        }
    });

    this.monsters.red_octoroc = new createjs.SpriteSheet({
        images: [this.monsters.redOctoroc],
        frames: { width: 32, height: 32, regX: 0, regY: 0, spacing: 0, margin: 0 },
        animations: {
            down: { frames: [0, 1], speed: 0.1 },
            up: { frames: [2, 3], speed: 0.1 },
            left: { frames: [4, 5], speed: 0.1 },
            right: { frames: [6, 7], speed: 0.1 }
        }
    });
    this.monsters.redTektiteSprites = new createjs.SpriteSheet({
        images: [this.monsters.redTektite],
        frames: { width: 32, height: 32, regX: 0, regY: 0, spacing: 0, margin: 0 },
        animations: {
            down: { frames: [0, 1], speed: 0.1 }
        }
    });

    this.woodSwordSprites = new createjs.SpriteSheet({
        images: [this.woodSword],
        frames: { width: 32, height: 32, regX: 0, regY: 0, spacing: 0, margin: 0 },
        animations: {
            down: { frames: [0] },
            up: { frames: [1] },
            left: { frames: [2] },
            right: { frames: [3] }
        }
    });

    this.mapObjects.redfireSprites = new createjs.SpriteSheet({
        images: [this.mapObjects.redFire],
        frames: { width: 32, height: 32, regX: 0, regY: 0, spacing: 0, margin: 0 },
        animations: {
            burn: { frames: [0,1], speed: 0.2 }
        }
    });


    //this.red_tektite = new createjs.Sprite(this.monsters.redTektiteSprites, 'down');
    //this.red_tektite.x = 128;
    //this.red_tektite.y = 288;

    //this.red_octoroc = new Enemy({
    //    x: 224,
    //    y: 288,
    //    speed:16,
    //    sprite: new createjs.Sprite(this.redOctorocSprites, 'down')
    //});

    //this.otherlink = new Character({
    //    x: 256,
    //    y: 256,
    //    facing: 'left',
    //    state: STATE_IDLE,
    //    sprite: new createjs.Sprite(this.linkSprites, 'left')
    //});

    this.link = new Character({
        x: 224,
        y: 310,
        facing: 'down',
        speed: 4,
        state: STATE_IDLE,
        type:'player',
        sprite: new createjs.Sprite(this.linkSprites, 'down')
    });

    this.loadMap(zelda.map);

  //  this.stage.addChild(this.red_tektite);
  //  this.stage.addChild(this.red_octoroc.sprite);
  //  this.stage.addChild(this.otherlink.sprite);
  //  this.red_octoroc.roam(1000);

    this.woodSwordSprite = new createjs.Sprite(this.woodSwordSprites, 'left');
    this.woodSwordSprite.x = 224;
    this.woodSwordSprite.y = 256;

    this.stage.addChild(this.link.sprite);
    this.link.setPosition(this.x, this.y);


    //create black overlay
    this.gfx = new createjs.Graphics();
    this.gfx.beginFill(createjs.Graphics.getRGB(0, 0, 0)).drawRect(0, 0, 512, 128);
    this.hud = new createjs.Shape(this.gfx);
    this.stage.addChild(this.hud);
    //this.stage.addChild(this.gfx);

    createjs.Ticker.addEventListener('tick', zelda.gameLoop);
    createjs.Ticker.setFPS(60);
    zelda.bgm = createjs.Sound.play('overworld_music');
    zelda.bgm.volume = 0.5;
}