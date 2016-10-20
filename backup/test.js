/**
 * Created by qfau on 17/10/2016.
 */




var config = {"iceServers":[{"url":"stun:stun.l.google.com:19302"}]};
var connection = {
    'optional':
        [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }]
};
var peerConnection = new webkitRTCPeerConnection(config, connection);

peerConnection.onicecandidate = function(e){
    if (!peerConnection || !e || !e.candidate) return;
    sendNegotiation("candidate", event.candidate);
}

var dataChannel = peerConnection.createDataChannel("datachannel", {reliable: false});

dataChannel.onmessage = function(e){console.log("DC message:" +e.data);};
dataChannel.onopen = function(){console.log("------ DATACHANNEL OPENED ------");};
dataChannel.onclose = function(){console.log("------- DC closed! -------")};
dataChannel.onerror = function(){console.log("DC ERROR!!!")};

var sdpConstraints = {'mandatory':
{
    'OfferToReceiveAudio': false,
    'OfferToReceiveVideo': false
}
};

peerConnection.createOffer(function (sdp) {
    peerConnection.setLocalDescription(sdp);
    sendNegotiation("offer", sdp);
    console.log("------ SEND OFFER ------");
}, null, sdpConstraints);

function processIce(iceCandidate){
    peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
}

function processAnswer(answer){
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("------ PROCESSED ANSWER ------");
};


function openDataChannel (){
    var config = {"iceServers":[{"url":"stun:stun.l.google.com:19302"}]};
    var connection = { 'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] };

    peerConnection = new RTCPeerConnection(config, connection);
    peerConnection.onicecandidate = function(e){
        if (!peerConnection || !e || !e.candidate) return;
        var candidate = event.candidate;
        sendNegotiation("candidate", candidate);
    }

    dataChannel = peerConnection.createDataChannel(
        "datachannel", {reliable: false});

    dataChannel.onmessage = function(e){
        console.log("DC from ["+user2+"]:" +e.data);
    }
    dataChannel.onopen = function(){
        console.log("------ DATACHANNEL OPENED ------")
        $("#sendform").show();
    };
    dataChannel.onclose = function(){console.log("------ DC closed! ------")};
    dataChannel.onerror = function(){console.log("DC ERROR!!!")};

    peerConnection.ondatachannel = function () {
        console.log('peerConnection.ondatachannel event fired.');
    };
}