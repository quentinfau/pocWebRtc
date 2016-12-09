const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
		.use((req, res) => res.sendFile(INDEX) )
.listen(PORT, () => console.log(`Listening on ${ PORT }`));


var io = require('socket.io').listen(server);
var socketList = [];

// Quand un client se connecte, on le note dans la console
console.log('init');
io.sockets.on('connection', function (socket) {
	console.log('Un client est connecté !');
	socketList.push(socket);
	var welcomeMessage = {
		'message' : 'Vous êtes bien connecté !',
		'user' : socket.user
	}
	socket.emit('welcomeMessage', welcomeMessage);

	socket.on('nouveau_client', function(pseudo) {
		console.log('nouveau client');
		socket.user = pseudo;
	});

	socket.on('listOfClient', function (pseudo) {
		console.log('ask for list of client: ' + pseudo);
		socket.emit('listOfClient', socketList)
	});
	socket.on('negotiationMessage', function (data) {
		console.log('Got socket message: ' + data);
		var msg = JSON.parse(data);
		for (var i = 0; i < socketList.length; i++) {
			// send to everybody on the site
			if (socketList[i].user == msg.to) {
				msg.id = socket.id;
				socketList[i].emit('negotiationMessage', msg);
				return;
			}
		}
	});
	socket.on('disconnect', function (e) {
		socketList.splice(socketList.indexOf(this),1);
		console.log('Client disconnected')
	});
});
