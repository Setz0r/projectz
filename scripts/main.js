var zelda = zelda || {};

//Config Variables
zelda.canvasId = 'gameCanvas';

zelda.version = '0.1b';
zelda.socket = 3000;

var projectZ = projectZ || {};
projectZ.clientInfo = {};
projectZ.players = [];

projectZ.createPlayerSprite = function (player) {
	var circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	var text = new createjs.Text(player.cid, "bold 20px Arial", "#fff");
	text.x = -5;
	text.y = 8;
	text.textBaseline = "alphabetic";
	
	player.sprite = new createjs.Container();
	player.sprite.x = player.pos.x;
	player.sprite.y = player.pos.y;
	player.sprite.addChild(circle);
	player.sprite.addChild(text);
	//projectZ.stage.addChildAt(player.sprite, Math.max(0, projectZ.stage.numChildren - 1));
	
	//projectZ.stage.update();
};
projectZ.getUserById = function (uuid) {
	var outUser = false;
	$.each(projectZ.players, function (k, obj) {
		if (uuid == obj.uuid) {
			outUser = obj;
			return false;
		}

	});
	return outUser;
};
$(function () {

	//socket shit
	var socket = io('http://localhost:'+zelda.socket, { reconnection: false });
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
	
	socket.on('addplayer', function (msg) {
		var player = JSON.parse(msg);
		projectZ.createPlayerSprite(player);
		projectZ.players.push(player);
	});
	
	socket.on('removeplayer', function (msg) {
		var player = JSON.parse(msg);
		var userObj = projectZ.getUserById(player.uuid);
		projectZ.stage.removeChild(userObj.sprite);
		projectZ.players.splice(projectZ.players.indexOf(player), 1);
	});
	
	socket.on('moveplayer', function (msg) {
		var player = JSON.parse(msg);
		var userObj = projectZ.getUserById(player.uuid);
		createjs.Tween.get(userObj.sprite, { override: true }).to({ x: player.pos.x, y: player.pos.y }, 500, createjs.Ease.getPowInOut(4));
	});
	
	//event handler shit
	//$('#gameCanvas').click(function (e) {
	//	createjs.Tween.get(projectZ.clientInfo.sprite, { override: true }).to({ x: e.clientX, y: e.clientY }, 500, createjs.Ease.getPowInOut(4));
	//	socket.emit('position', { x: e.clientX, y: e.clientY });
 //   });

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