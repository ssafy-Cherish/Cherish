import { useState, useEffect } from "react";
import { useSpeechRecognition } from "react-speech-kit";

var changePeerConnectionConnected;

var localStream = new MediaStream();

var remoteStream = new MediaStream();

var mediaStream = new MediaStream();

var remoteMediaStream = new MediaStream();

var mediaRecorder;
var recordedChunks = [];

var peerConnection;
var dataChannel;

var camstate;
var changeChatting;

var canCheck = true;

////
/* 로컬 측 비디오를 업데이트, 로컬 측 미디어스트림트랙 초기화, 로컬 측 미디어스트림트랙을 미디어스트림 트랙과 동기화*/
const updateCam = function () {
  document.getElementById("camera").srcObject =
    localStream?.getTracks().length !== 0 ? localStream : null;
};

const initLocalStreamTracks = function () {
  localStream.getTracks().forEach((track) => {
    localStream.removeTrack(track);
  });
  updateCam();
};

const addLocalStreamTracks = function () {
  mediaStream.getTracks().forEach((track) => {
    localStream.addTrack(track);
  });
  updateCam();
};
////

////
/* 미디어 권한설정, 미디어 스트림을 받고, 녹화 설정*/
const getMediaStream = function () {
  const constraints = {
    video: {
      frameRate: {
        ideal: 60,
        max: 80,
      },
      width: 300,
      height: 300,
      facingMode: "user",
    },
    audio: {
      echoCancellation: true, // 에코 캔슬레이션 활성화
      noiseSuppression: true, // 잡음 억제 활성화
      sampleRate: 44100, // 샘플레이트 설정 (예: 44100Hz)
    },
  };
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    stream.getTracks().forEach((track) => {
      mediaStream.addTrack(track);
    });
    console.log("get Media");
    console.log(mediaStream.getTracks());
    setMediaRecorder();
  });
};

const setMediaRecorder = function () {
  mediaRecorder = new MediaRecorder(mediaStream);
  mediaRecorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      console.log("mediaRecorder.ondataavailable");
      console.log(mediaRecorder.ondataavailable);
      recordedChunks.push(event.data);
    }
  };
  mediaRecorder.onstop = function () {
    console.log(recordedChunks);
    let blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    let url = URL.createObjectURL(blob);
    let video = document.getElementById("record");
    video.src = url;
    video.play();
  };
};
////

////
/* 시그널링 서버와 연결하고, 관련된 세팅 및 관련 함수들 */
//connecting to our signaling server
// 서버 주소로 변경해야 됨
var conn = new WebSocket("ws://192.168.100.58:8080/socket");

conn.onopen = function () {
  console.log("Connected to the signaling server");
  initialize();
};

conn.onmessage = function (msg) {
  console.log("Got message", msg.data);
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

function send(message) {
  conn.send(JSON.stringify(message));
}

function initialize() {
  var configuration = null;

  peerConnection = new RTCPeerConnection(configuration);

  // Setup ice handling
  peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      send({
        event: "candidate",
        data: event.candidate,
      });
    }
  };

  // creating data channel
  dataChannel = peerConnection.createDataChannel("dataChannel", {
    reliable: true,
  });

  dataChannel.onerror = function (error) {
    console.log("Error occured on datachannel:", error);
  };

  // when we receive a message from the other peer, printing it on the console
  dataChannel.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    console.log(msg);
    switch (msg.cmd) {
      case "request peer cam state":
        sendMessage(
          JSON.stringify({
            cmd: "responce peer cam state",
            data: camstate,
          })
        );
        break;

      case "responce peer cam state":
        remoteStream = msg.data ? remoteMediaStream : null;
        document.getElementById("peer").srcObject = remoteStream;
        break;

      case "send chatting massage":
        changeChatting((prev) => {
          return [msg.data, ...prev];
        });
        break;
      default:
        break;
    }
  };

  dataChannel.onclose = function () {
    peerConnection.close();
    changePeerConnectionConnected(false);
    initialize();
    console.log("data channel is closed");
  };

  peerConnection.ondatachannel = function (event) {
    dataChannel = event.channel;
    // changePeerConnectionConnected(peerConnection.connectionState === 'connected');
  };

  peerConnection.ontrack = function (event) {
    console.log("ontrack");

    remoteMediaStream.getTracks().forEach((track) => {
      remoteMediaStream.removeTrack(track);
    });
    remoteMediaStream.addTrack(event.track);
    sendMessage(
      JSON.stringify({
        cmd: "request peer cam state",
      })
    );
  };
}

function createOffer() {
  peerConnection.createOffer(
    function (offer) {
      peerConnection.setLocalDescription(offer);

      send({
        event: "offer",
        data: offer,
      });
    },
    function () {
      alert("Error creating an offer");
    }
  );
  if (peerConnection.getSenders().length === 0) {
    mediaStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track);
    });
  }
}

function handleOffer(offer) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  // create and send an answer to an offer
  peerConnection.createAnswer(
    function (answer) {
      peerConnection.setLocalDescription(answer);
      send({
        event: "answer",
        data: answer,
      });
    },
    function () {
      alert("Error creating an answer");
    }
  );
  if (peerConnection.getSenders().length === 0) {
    mediaStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track);
    });
  }
  //   peerConnection.addStream(mediaStream);
}

function handleCandidate(candidate) {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

function handleAnswer(answer) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  console.log("connection established successfully!!");
  changePeerConnectionConnected(true);
}
////

function sendMessage(msg) {
  dataChannel.send(msg);
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

function stopCamera() {
  initLocalStreamTracks();
  if (dataChannel.readyState === "open") {
    giveCameraState();
  }
}

function startCamera() {
  addLocalStreamTracks();
  if (dataChannel.readyState === "open") {
    giveCameraState();
  }
}

function giveCameraState() {
  sendMessage(
    JSON.stringify({
      cmd: "responce peer cam state",
      data: camstate,
    })
  );
}

window.onbeforeunload = () => {
  peerConnection.getSenders().forEach((sender) => {
    peerConnection.removeTrack(sender);
  });
  peerConnection.close();
};

//test

////////

function Meeting2() {
  const [captureList, setCaptureList] = useState([]);

  const [peerConnectionConnected, setPeerConnectionConnected] = useState(false);
  changePeerConnectionConnected = setPeerConnectionConnected;

  const [cameraState, setCameraState] = useState(false);
  camstate = cameraState;

  const [chatting, setChatting] = useState([]);
  changeChatting = setChatting;
  const [message, setMessage] = useState("");

  const [recogString, setRecogString] = useState("");

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);
      if (recogString != result) {
        const arr = result.split(" ");
        if (canCheck && arr[arr.length - 1] === "안녕") {
          const today = new Date();
          setCaptureList((prev) => {
            return [today.toLocaleString(), ...prev];
          });
          canCheck = false
          setTimeout(() => {
            canCheck = true
          }, 1500);
        }
      }
      setRecogString(result);
    },
  });

  useEffect(() => {
    getMediaStream();
    // document.getElementById("offerbutton").onclick = () => {
    //   createOffer();
    // };
    document.getElementById("recordbutton").onclick = () => {
      record();
    };
    document.getElementById("recordstopbutton").onclick = () => {
      recordStop();
    };

    document.getElementById("camerabutton").onclick = () => {
      setCameraState((prev) => {
        camstate = !prev;
        if (prev) {
          stopCamera();
        } else {
          startCamera();
        }

        return !prev;
      });
    };
  }, []);

  return (
    <div className="container">
      <h1>WebRTC 테스트</h1>
      {peerConnectionConnected !== true && (
        <button
          id="offerbutton"
          type="button"
          className="btn btn-primary"
          onClick={createOffer}
        >
          Offer 생성
        </button>
      )}
      <button id="camerabutton" type="button">
        {cameraState ? "stop camera" : "start camera"}
      </button>
      <p>{recogString}</p>
      {listening && <div>음성인식 활성화 중</div>}
      <button onMouseDown={listen} onMouseUp={stop}>
        🎤
      </button>
      <div>
        {captureList.map((elem, i) => {
          return <p key={i}>{elem}</p>;
        })}
      </div>

      <h1>offer 생성시 반대쪽 peer에 비디오 출력</h1>
      <video
        id="camera"
        width="300px"
        height="300px"
        muted
        autoPlay
        playsInline
        controls
      ></video>
      <div></div>
      <video
        id="peer"
        width="300px"
        height="300px"
        muted
        autoPlay
        playsInline
        controls
      ></video>
      <button type="button" id="recordbutton" className="btn btn-primary">
        녹화
      </button>
      <button type="button" id="recordstopbutton" className="btn btn-primary">
        중지
      </button>
      <video
        id="record"
        autoPlay
        playsInline
        controls
        width="300px"
        height="300px"
      ></video>
      <div>
        <div>
          <p>{message}</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (dataChannel.readyState === "open") {
                sendMessage(
                  JSON.stringify({
                    cmd: "send chatting massage",
                    data: message,
                  })
                );
                setChatting((prev) => {
                  return [message, ...prev];
                });
              }
              setMessage("");
            }}
          >
            <input
              id="message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            />
            <button type="submit" htmlFor="message">
              send
            </button>
          </form>
        </div>
        <div>
          {chatting.map((para) => {
            return <p key={para}>{para}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

export default Meeting2;
