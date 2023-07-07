var zelda = zelda || {};

zelda.initializeGFX = function (stageId) {
    console.log('Initializing GFX');
    this.stage = new createjs.Stage(stageId);


    this.stage.update();

}