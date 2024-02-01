var camera = document.getElementById("camera");
var peer = document.getElementById("peer");

var mediaRecorder;
var recordedChunks = [];

window.onload = function () {
    // 사용자 카메라 연결
    const constraints = {
        video : {
            frameRate : {
                ideal : 5,
                max : 10
            },
            width : 72,
            height : 72,
            facingMode : "user"
        },
        audio: {
            echoCancellation: true,  // 에코 캔슬레이션 활성화
            noiseSuppression: true,  // 잡음 억제 활성화
            sampleRate: 44100        // 샘플레이트 설정 (예: 44100Hz)
        }
    };
    navigator.mediaDevices.getUserMedia(constraints).
        then(function (stream) {
            camera.srcObject = stream;

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function (event) {
                if (event.data.size > 0) {
                    console.log("mediaRecorder.ondataavailable");
                    console.log(mediaRecorder.ondataavailable);
                    recordedChunks.push(event.data);
                }
            };
            mediaRecorder.onstop = function(event) {
                console.log(recordedChunks);
                recordedChunks.pop();
                recordedChunks.pop();
                recordedChunks.pop();
                recordedChunks.pop();
                recordedChunks.pop();
                console.log(recordedChunks);
                let blob = new Blob(recordedChunks, {
                  type: "video/webm"
                });
                let url = URL.createObjectURL(blob);
              
                // 예를 들어, 비디오를 <video> 엘리먼트에 로드할 수 있습니다.
                let video = document.getElementById("record");
                video.src = url;
                video.play();
            };
        })
        .catch(function (err) { /* handle the error */ });
}

//connecting to our signaling server
// 서버 주소로 변경해야 됨
var conn = new WebSocket('ws://localhost:8080/socket');

conn.onopen = function() {
    console.log("WebSocket Open");
    initialize();
};

conn.onmessage = function(msg) {
    console.log("receive message");
    console.log(msg);
    var content = JSON.parse(msg.data);
    var data = content.data;
    switch (content.event) {
    // when somebody wants to call us
    case "offer":
        handleOffer(data);
        break;
    case "answer":
        handleAnswer(data);
        break;
    // when a remote peer sends an ice candidate to us
    case "candidate":
        handleCandidate(data);
        break;
    default:
        break;
    }
};

var peerConnection;
var dataChannel;
var input = document.getElementById("messageInput");
var input2 = document.getElementById("messageInput2");

function sendMessageToServer() {
    var str = JSON.stringify({
        event : "access",
        data : JSON.stringify({
            coupleId : "3"
        })
    });
    console.log(str);
    conn.send(str);
    input2.value = "";
}
function send(message) {
    conn.send(JSON.stringify(message));
}


function initialize() {
    var configuration = null;

    peerConnection = new RTCPeerConnection(configuration);

    // Setup ice handling
    peerConnection.onicecandidate = function(event) {
        console.log("on ice candidate");
        if (event.candidate) {
            send({
                event : "candidate",
                data : event.candidate
            });
        }
    };

    // creating data channel
    dataChannel = peerConnection.createDataChannel("dataChannel", {
        reliable : true
    });

    dataChannel.onerror = function(error) {
        console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    dataChannel.onmessage = function(event) {
        console.log("dataChannel receive message");
        console.log(event);
    };

    dataChannel.onclose = function() {
        console.log("data channel is closed");
    };
  
  	peerConnection.ondatachannel = function (event) {
        console.log("on data channel");
        console.log(event);
        dataChannel = event.channel;
  	};

    peerConnection.onaddstream = function(event) {
        console.log("on add stream");
        console.log(event);
        peer.srcObject = event.stream;
    };
}

function createOffer() {
    peerConnection.createOffer(function(offer) {
        send({
            event : "offer",
            data : offer
        });
        peerConnection.setLocalDescription(offer);
    }, function(error) {
        alert("Error creating an offer");
    });
}

function handleOffer(offer) {
    console.log("handle offer");

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    peerConnection.createAnswer(function(answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event : "answer",
            data : answer
        });
    }, function(error) {
        alert("Error creating an answer");
    });

};

function handleCandidate(candidate) {
    console.log("handle candidate");
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

function handleAnswer(answer) {
    console.log("handle answer");
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    peerConnection.addStream(camera.srcObject);
};

function sendMessage() {
    console.log("dataChannel send message");
    dataChannel.send(input.value);
    input.value = "";
}

function record() {
    console.log("녹화 시작");
    // 녹화 시작
    mediaRecorder.start(1000);
}

function recordStop() {
    console.log("녹화 중지");
    mediaRecorder.stop();
}

//test