var WebSocket = require("ws");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8088});
var username;
var wsList = [];
wss.on('connection', function(ws){
	console.log('WS connection established!')
	wsList.push(ws);
	ws.on('close', function(){
		wsList.splice(wsList.indexOf(ws),1);
		console.log('WS closed!')
	});

	ws.on('message', function(message){
		console.log('Got ws message: '+message);
		var msg = JSON.parse(message);
		switch(msg.type) {
			case "username":
				ws.user=msg.data;
				break;
			case "addPeers":
				for (var i = 0; i < wsList.length; i++) {
					// send to everybody on the site
					if (wsList[i].user == msg.data) {
						wsList[i].send(message);
						return;
					}
				}
				break;
			default:
				for (var i = 0; i < wsList.length; i++) {
					// send to everybody on the site
					if (wsList[i].user == msg.to) {
						wsList[i].send(message);
						return;
					}
				}
				console.log("l'utilisateur " + msg.to + " n'existe pas ou n'est pas connecté au serveur");
				return;
		}
	});
});

var express = require('express'),
    app = express();

app.get('/', function(req, res){ res.sendFile(__dirname + '/index.html'); });
app.listen(8888);
