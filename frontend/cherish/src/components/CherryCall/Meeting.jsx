import { useRef, useState, useEffect } from "react";

var setStateGotMediaStream;
var localMediaStream = new MediaStream();
var remoteMediaStream = new MediaStream();
var localVideoObj = new MediaStream();
var remoteVideoObj = new MediaStream();

var myCamState;
var setMyCamState;
var myMicState;
var setMyMicState;


var conn;
var peerConnection;
var dataChannel;

const getLocalMediaStream = function () {
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
      localMediaStream.addTrack(track);
    });
    setStateGotMediaStream(true);
    console.log("get Media");
    console.log(localMediaStream.getTracks());
    localVideoObj.addTrack(localMediaStream.getAudioTracks()[0])
    setMyMic
    localVideoObj.addTrack(localMediaStream.getVideoTracks()[0])
    setMyCamState(true)
    document.getElementById("ready-cam").srcObject = localVideoObj;
  });
};

const setConn = function () {
  conn = new WebSocket("ws://192.168.100.58:8080/socket");

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
};

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
            data: myCamState,
          })
        );
        break;

      case "responce peer cam state":
        remoteVideoObj = msg.data ? remoteMediaStream : null;
        document.getElementById("peer").srcObject = remoteVideoObj;
        break;

      // case "send chatting massage":
      //   changeChatting((prev) => {
      //     return [msg.data, ...prev];
      //   });
      //   break;
      default:
        break;
    }
  };

  dataChannel.onclose = function () {
    peerConnection.close();
    // changePeerConnectionConnected(false);
    initialize();
    console.log("data channel is closed");
  };

  peerConnection.ondatachannel = function (event) {
    dataChannel = event.channel;
  };

  peerConnection.ontrack = function (event) {
    console.log("ontrack");
    remoteMediaStream.addTrack(event.track);

    if (remoteMediaStream.getTracks().length === 2) {
      // setMediaRecorder(0, mediaStream, remoteMediaStream);
      // setMediaRecorder(1, mediaStream, remoteMediaStream);
      // recordStart();
    }
    sendMessage(
      JSON.stringify({
        cmd: "request peer cam state",
      })
    );
  };
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
    localMediaStream.getTracks().forEach((track) => {
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
}
////

function sendMessage(msg) {
  dataChannel.send(msg);
}

function send(message) {
  conn.send(JSON.stringify(message));
}

////////

function Meeting() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [gotMediaStream, setGotMediaStream] = useState(false);
  
  const [myCam, setMyCam] = useState(false);
  const [myMic, setMyMic] = useState(false);

  const [message, setMessage] = useState("");

  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    myCamState = myCam;
    setMyCamState = setMyCam;

    myMicState = myMic;
    setMyMicState = setMyMic;

    getLocalMediaStream();
    setStateGotMediaStream = setGotMediaStream;
  }, []);

  return (
    <div className="h-full w-full flex flex-row contents-center">
      <div className="w-9/12 flex flex-col justify-center">
        <div className="h-3/4 m-2 rounded-2xl flex flex-col-reverse">
          <div className="h-14 bg-pink rounded-b-2xl flex flex-row justify-between">
            <div className="border-2 m-2 w-1/6"></div>
            <button className="border-2 m-2 w-14 rounded-2xl"></button>
          </div>
          {!isModalOpen && (
            <video src="" className="h-full bg-slate-700 rounded-t-2xl"></video>
          )}
          {isModalOpen && (
            <div className="h-full bg-slate-700 flex flex-col justify-center items-center rounded-t-2xl">
              <div className="h-5/6 w-1/2 mt-5 rounded-2xl bg-pink flex flex-col justify-center items-center">
                <div className="h-1/3 w-full flex flex-col justify-center text-center font-extrabold text-xl">
                  체리콜을 시작할까요?
                </div>
                <div className="h-full w-5/6  flex flex-col-reverse justify-center">
                  <div className="h-14 bg-white rounded-b-2xl flex flex-row justify-center">
                    <button className="w-10 my-2 mx-5 border-2"></button>
                    <button className="w-10 my-2 mx-5 border-2"></button>
                  </div>
                  <video
                    id="ready-cam"
                    autoPlay
                    playsInline
                    className={myCam?"h-full rounded-t-2xl":"h-full rounded-t-2xl bg-slate-700"}
                  ></video>
                </div>
                <div className="h-1/4 w-5/6 flex flex-row justify-between items-center">
                  <button
                    className={
                      gotMediaStream
                        ? "px-5 h-14 bg-skyblue rounded-2xl font-extrabold text-xl"
                        : "px-5 h-14 bg-zinc-400 rounded-2xl font-extrabold text-xl"
                    }
                    disabled={!gotMediaStream}
                  >
                    알림보내기
                  </button>
                  <button
                    className={
                      gotMediaStream
                        ? "px-5 h-14 bg-skyblue rounded-2xl font-extrabold text-xl"
                        : "px-5 h-14 bg-zinc-400 rounded-2xl font-extrabold text-xl"
                    }
                    disabled={!gotMediaStream}
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    입장
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-3/12 flex flex-col justify-center mr-5">
        <div className="bg-pink h-3/4 m-2 rounded-2xl flex flex-col">
          <div className="bg-white mx-4 mt-4 mb-2 rounded-t-2xl h-16">
            <button className="w-[50%] h-full font-extrabold text-xl">
              체리톡
            </button>
            <button className="w-[50%] h-full font-extrabold text-xl">
              클립
            </button>
          </div>
          <div className="bg-white mx-4 mb-4 rounded-b-2xl h-full"></div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              console.log(message);
              setMessage("");
            }}
            className="mx-4 mb-4 rounded-2xl h-12 flex flex-row"
          >
            <input
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              value={message}
              className="bg-white w-full rounded-2xl"
            ></input>
            <button className=" border-2 ml-4 w-12"></button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Meeting;
