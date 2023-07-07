var zelda = zelda || {};

//Config Variables
zelda.canvasId = 'gameCanvas';

zelda.version = '0.1b';

//On Page Load
$(function () {
    console.log(zelda.version);

    //Setup GFX
    zelda.initializeGFX(zelda.canvasId);

    //Load sound/images/etc
    zelda.loadResources();

    //Assign our keyboard handlers
    $(document).keydown(function (event) {
        zelda.keyPressed(event);
    });
    $(document).keyup(function (event) {
        zelda.keyReleased(event);
    });

});