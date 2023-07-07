var zelda = zelda || {};

//Config Variables
zelda.canvasId = 'gameCanvas';

zelda.version = '0.1b';
zelda.socket = 3000;

var projectZ = projectZ || {};
projectZ.clientInfo = {};
projectZ.players = [];

zelda.submitMap = function () {
    $.ajax({
        url: "/",
        method: 'POST',
        data: {
            mapData:JSON.stringify(zelda.worldMapData)
        },
        success: function (data) {
            console.log(data);
        }
    });
}

$(function () {
    
    //socket shit
    var socket = io('http://localhost:' + zelda.socket, { reconnection: false });
    socket.on('serverinfo', function (msg) {
        var serverInfo = JSON.parse(msg);
        projectZ.clientInfo = serverInfo;
		//var circle = new createjs.Shape();
		//circle.graphics.beginFill("Red").drawCircle(0, 0, 50);
		//var text = new createjs.Text("You", "bold 20px Arial", "#fff");
		//text.x = -18;
		//text.y = 8;
		//text.textBaseline = "alphabetic";
		
		//projectZ.clientInfo.sprite = new createjs.Container();
		//projectZ.clientInfo.sprite.x = serverInfo.pos.x;
		//projectZ.clientInfo.sprite.y = serverInfo.pos.y;
		//projectZ.clientInfo.sprite.addChild(circle);
		//projectZ.clientInfo.sprite.addChild(text);
		//projectZ.stage.addChild(projectZ.clientInfo.sprite);
		//projectZ.stage.update();
    });
    
    
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

    $('#gameCanvas').on('click',function (e) {
        console.log('click');
        console.log(e);
    });

    $('#mapTiles').on('click', function (e) {
        console.log('tile click');
        zelda.tileX = Math.floor(e.offsetX / 34);
        zelda.tileY = Math.floor(e.offsetY / 34);
        zelda.tileNum = zelda.tileX + (zelda.tileY * 18);
        $('#tileNum').html(zelda.tileNum);
    })
});