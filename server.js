/*var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(http); //(http);
*/

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var app_port = process.env.app_port || 8080;
var app_host = process.env.app_host || '127.0.0.1';

console.log( "Server on", app_host, ":", app_port);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat', function(msg){
        console.log('message: ' + msg);
    });
});

http.listen(app_port, app_host);

