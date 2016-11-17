/*
var express = require('express'),
const server = express()
		.use((req, res) => res.sendFile('/index.html') )
.listen(PORT, () => console.log(`Listening on ${ PORT }`));
var http = require('http').Server(app);
//var server = http.createServer(main)
var io  = require('socket.io')(http);
//io.set('log level', 2);
server.set('port', (process.env.PORT || 5000));
server.get('/', function(req, res){ res.sendFile(__dirname + '/index.html'); });
http.listen(server.get('port'), function () {
	console.log('Node app is running on port', server.get('port'));
});
*/
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
		.use((req, res) => res.sendFile(INDEX) )
.listen(PORT, () => console.log(`Listening on ${ PORT }`));

/*const wss = new SocketServer({ server });

var WebSocket = require("ws");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({app});*/
/*
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
*/

var io = require('socket.io').listen(server);
var socketList = [];

// Quand un client se connecte, on le note dans la console

io.sockets.on('connection', function (socket) {
	console.log('Un client est connecté !');
	socketList.push(socket);
	socket.emit('simplemessage', 'Vous êtes bien connecté !');

	socket.on('nouveau_client', function(pseudo) {
		console.log('nouveau client');
		socket.user = pseudo;
		socket.broadcast.emit('nouveau_client', pseudo);
	});

	socket.on('message', function (data) {
		console.log('Got socket message: '+data);
		var msg = JSON.parse(data);
		switch(msg.type) {
			case "username":
				console.log('Got socket username message: ');
				socket.user=msg.data;
				break;
			default:
				console.log('Got socket default message: ');
				for (var i = 0; i < socketList.length; i++) {
					// send to everybody on the site
					if (socketList[i].user == msg.to) {
						socketList[i].emit('message', data);
						return;
					}
				}
		}
	});

	socket.on('disconnect', function (e) {
		//wsList.splice(wsList.indexOf(ws),1);
		socketList.splice(socketList.indexOf(this),1);
		console.log('Client disconnected')
	});
});
