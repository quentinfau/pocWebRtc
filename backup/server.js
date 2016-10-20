/*var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(http); //(http);
*/
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rtc = require('./rtcServer');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'RTCDataChannel.html'));
});
io.on('connection', function(socket){
    socket.on('chat', function(msg){
        console.log('message: ' + msg);
    });
});

http.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

