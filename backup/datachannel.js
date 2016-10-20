/**
 * Created by qfau on 13/10/2016.
 */
//Signaling Code Setup
var SIGNAL_ROOM = "signaling";
var configuration = {
    'iceServers': [{
        'url': 'stun:stun.l.google.com:19302'
    }]
};

var rtcPeerConn;

var dataChannelOptions = {
    ordered: false, //no guaranteed delivery, unreliable but faster
    maxRetransmitTime: 1000, //milliseconds
};

var dataChannel;

io = io.connect();

io.emit('ready', {"signal_room": SIGNAL_ROOM});

//Send a first signaling message to anyone listening

//In other apps this would be on a button click, we are just doing it on page load

io.emit('signal',{"type":"user_here", "message":"Would you like to play a game?", "room":SIGNAL_ROOM});

io.on('signaling_message', function(data) {
    //Setup the RTC Peer Connection object
    if (!rtcPeerConn)
        startSignaling();
    if (data.type != "user_here") {

        var message = JSON.parse(data.message);
        if (message.sdp) {
            rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {

                // if we received an offer, we need to answer
                if (rtcPeerConn.remoteDescription.type == 'offer') {

                    rtcPeerConn.createAnswer(sendLocalDesc, logError);
                }
            }, logError);
        }
        else {
            rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    }

});

function startSignaling() {
    rtcPeerConn = new webkitRTCPeerConnection(configuration, null);
    dataChannel = rtcPeerConn.createDataChannel('textMessages', dataChannelOptions);
    dataChannel.onopen = dataChannelStateChanged;
    rtcPeerConn.ondatachannel = receiveDataChannel;

    // send any ice candidates to the other peer
    rtcPeerConn.onicecandidate = function (evt) {
        if (evt.candidate)
            io.emit('signal',{"type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate }), "room":SIGNAL_ROOM});

    };

    // let the 'negotiationneeded' event trigger offer generation
    rtcPeerConn.onnegotiationneeded = function () {
        rtcPeerConn.createOffer(sendLocalDesc, logError);
    }
}


function sendLocalDesc(desc) {
    rtcPeerConn.setLocalDescription(desc, function () {
        io.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription }), "room":SIGNAL_ROOM});

    }, logError);
}

rtcPeerConn = new webkitRTCPeerConnection(configuration, null);
dataChannel = rtcPeerConn.createDataChannel('textMessages', dataChannelOptions);

dataChannel.onopen = dataChannelStateChanged;
rtcPeerConn.ondatachannel = receiveDataChannel;

function dataChannelStateChanged() {
    if (dataChannel.readyState === 'open') {
        dataChannel.onmessage = receiveDataChannelMessage;
    }
}

function receiveDataChannel(event) {
    dataChannel = event.channel;
    dataChannel.onmessage = receiveDataChannelMessage;
}

function receiveDataChannelMessage(event) {
    if (event.data.split(" ")[0] == "memoryFlipTile") {
        var tileToFlip = event.data.split(" ")[1];
        displayMessage("Flipping tile " + tileToFlip);
        var tile = document.querySelector("#" + tileToFlip);
        var index = tileToFlip.split("_")[1];
        var tile_value = memory_array[index];
        flipTheTile(tile,tile_value);
    } else if (event.data.split(" ")[0] == "newBoard") {
        displayMessage("Setting up new board");
        memory_array = event.data.split(" ")[1].split(",");
        newBoard();
    }
}