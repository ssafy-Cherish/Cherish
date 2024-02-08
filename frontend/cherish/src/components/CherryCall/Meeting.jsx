import { useRef, useState, useEffect } from "react";
import sendImg from "../../assets/SendIcon.svg";
import "./Meeting.css";
import { useBeforeUnload } from "react-router-dom";
import { useSpeechRecognition } from "react-speech-kit";
////////
import userStore from "../../stores/useUserStore";
import coupleStore from "../../stores/useCoupleStore";
////////
import LeftWindow from "./LeftWindow";
import RightWindow from "./RightWindow";

function Meeting() {
  const { kakaoId, nickname, userId } = userStore((state) => state);
  const { user1, user2, coupleId } = coupleStore();

  const [meetingInfo, setMeetingInfo] = useState({
    stream: {
      localMediaStream: new MediaStream(),
      remoteMediaStream: new MediaStream(),
    },

    video: {
      local: {
        videoOn: false,
        volume: 0.0,
      },
      remote: {
        videoOn: false,
        volume: 0.0,
        volumeFactor: 1.0,
      },
    },

    record: {
      mediaRecorder: [
        [null, null],
        [null, null],
      ],

      recordedChunks: [
        [[], []],
        [[], []],
      ],

      recordFlag: [
        [false, false],
        [false, false],
      ],

      option: {
        mimeType: "video/webm; codecs=vp9,opus",
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
      },

      recogString: "",

      canRecog: true,

      nowIdx: 0,

      tmpRecord: [null, null],
    },

    connect: {
      conn: null,
      peerConnection: null,
      dataChannel: null,
      offerReady: false,
    },

    chattingHistory: [],

    clipHistory: [],

    rightWindowIsChatting: true,

    init: false,

    meetingId: null,

    isModalOpen: true,
  });

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);
      setMeetingInfo((prevMeetingInfo) => {
        const newMeetingInfo = { ...prevMeetingInfo };
        if (prevMeetingInfo.record.recogString != result) {
          newMeetingInfo.record.recogString = result;
          const arr = result.split(" ");
          if (
            prevMeetingInfo.video.local.videoOn &&
            prevMeetingInfo.video.local.volume != 0 &&
            prevMeetingInfo.video.remote.videoOn &&
            prevMeetingInfo.video.remote.volume != 0 &&
            prevMeetingInfo.record.canRecog &&
            arr[arr.length - 1] === "안녕"
          ) {
            newMeetingInfo.record.canRecog = false;
            console.log("record Trigered");
            setTimeout(() => {
              setMeetingInfo((tmpMeetingInfo) => {
                const newTmpMeetingInfo = { ...tmpMeetingInfo };
                newTmpMeetingInfo.record.canRecog = true;
                return newTmpMeetingInfo;
              });
            }, 1500);
            newMeetingInfo.record.recordFlag[
              prevMeetingInfo.record.nowIdx
            ][0] = true;
            newMeetingInfo.record.recordFlag[
              prevMeetingInfo.record.nowIdx
            ][1] = true;
          }
        }
        return newMeetingInfo;
      });
    },
  });
  //////

  const readyCam = useRef();

  const chattingWindow = useRef();

  const localCam = useRef();

  const remoteCam = useRef();

  const camContainer = useRef();

  const localCamContainer = useRef();

  //////
  const getLocalMediaStream = function () {
    const constraints = {
      video: {
        frameRate: {
          ideal: 60,
          max: 80,
        },
        width: { ideal: 640 },
        height: { ideal: 720 },
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
        meetingInfo.stream.localMediaStream.addTrack(track);
      });
      updateLocalVideo(true, 1, 0);
    });
  };

  const updateLocalVideo = function (on, volume, target) {
    if (meetingInfo.connect?.peerConnection?.connectionState === "connected") {
      sendMessage(
        JSON.stringify({
          cmd: "response peer cam state",
          data: {
            videoOn: on,
            volume: volume,
          },
        })
      );
    }

    if (target === 0) {
      if (meetingInfo.video.local.videoOn !== on || !readyCam.current.srcObject) {
        readyCam.current.srcObject = on
          ? meetingInfo.stream.localMediaStream
          : new MediaStream();
      }
      readyCam.current.volume = volume;
      localCam.current.volume = 0;
    } else {
      if (meetingInfo.video.local.videoOn !== on || !localCam.current.srcObject) {
        localCam.current.srcObject = on
          ? meetingInfo.stream.localMediaStream
          : new MediaStream();
      }
      readyCam.current.volume = 0;
      localCam.current.volume = 0;
    }

    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.video.local.videoOn = on;
      newMeetingInfo.video.local.volume = volume;
      return newMeetingInfo;
    });
  };

  const updateRemoteVideo = function (on, volume, volumeFactor) {
    if (remoteCam.current) {
      if (meetingInfo.video.remote.videoOn !== on) {
        remoteCam.current.srcObject = on
          ? meetingInfo.stream.remoteMediaStream
          : new MediaStream();
      }
      if (meetingInfo.video.remote.volume != volume || meetingInfo.video.remote.volumeFactor != volumeFactor) {
        remoteCam.current.volume = volume*volumeFactor;
      }
    }

    console.log(volumeFactor)

    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.video.remote.videoOn = on;
      newMeetingInfo.video.remote.volume = volume;
      newMeetingInfo.video.remote.volumeFactor = volumeFactor;
      return newMeetingInfo;
    });
  };

  const setConnection = function () {
    const conn = new WebSocket(`${import.meta.env.VITE_APP_SOCKET_URL}`);

    conn.onopen = function () {
      console.log("Connected to the signaling server");
      initialize();
      send({
        event: "access",
        data: JSON.stringify({
          coupleId: coupleId,
        }),
      });
    };

    conn.onmessage = function (msg) {
      console.log("Got message", msg.data);
      var content = JSON.parse(msg.data);
      var data = content.data;
      switch (content.event) {
        // when somebody wants to call us
        case "access":
          console.log(data.meetingId);
          handleAccess(data.meetingId);
          break;
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

    // conn.onclose = function () {
    // 	send({
    // 		event: 'exit',
    // 		data: {
    // 			coupleId: 1,
    // 		},
    // 	});
    // };

    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.connect.conn = conn;
      return newMeetingInfo;
    });
  };

  const initialize = function () {
    const configuration = {
      iceServers: [
        {
          url: "stun:stun2.1.google.com:19302",
        },
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);

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
    const dataChannel = peerConnection.createDataChannel("dataChannel", {
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
              cmd: "response peer cam state",
              data: {
                videoOn: meetingInfo.video.local.videoOn,
                volume: meetingInfo.video.local.volume,
              },
            })
          );
          break;

        case "response peer cam state":
          updateRemoteVideo(msg.data.videoOn, msg.data.volume, meetingInfo.video.remote.volumeFactor);
          break;

        case "send chatting massage":
          handleRemoteChatting(msg.data);
          break;

        case "send new clip":
          handleNewClip(msg.data);
          break;

        default:
          break;
      }
    };

    dataChannel.onclose = function () {
      peerConnection.close();
      console.log("data channel is closed");
      setMeetingInfo((prevMeetingInfo) => {
        const newMeetingInfo = { ...prevMeetingInfo };
        newMeetingInfo.record.mediaRecorder = [
          [null, null],
          [null, null],
        ];
        newMeetingInfo.record.recordedChunks = [
          [[], []],
          [[], []],
        ];
        newMeetingInfo.record.recordFlag = [
          [false, false],
          [false, false],
        ];

        newMeetingInfo.stream.remoteMediaStream.getTracks().forEach((track) => {
          newMeetingInfo.stream.remoteMediaStream.removeTrack(track);
        });

        newMeetingInfo.video.remote.videoOn = false;
        newMeetingInfo.video.remote.volume = 0;

        updateRemoteVideo(
          newMeetingInfo.video.remote.videoOn,
          newMeetingInfo.video.remote.volume
        );
        newMeetingInfo.connect.offerReady = false;
        return newMeetingInfo;
      });
      initialize();
    };

    peerConnection.ondatachannel = function (event) {
      meetingInfo.connect.dataChannel = event.channel;

      // changePeerConnectionConnected(peerConnection.connectionState === 'connected');
    };

    peerConnection.ontrack = function (event) {
      console.log("ontrack");
      meetingInfo.stream.remoteMediaStream.addTrack(event.track);

      if (meetingInfo.stream.remoteMediaStream.getTracks().length === 2) {
        setMediaRecorder(
          0,
          meetingInfo.stream.localMediaStream,
          meetingInfo.stream.remoteMediaStream
        );
        setMediaRecorder(
          1,
          meetingInfo.stream.localMediaStream,
          meetingInfo.stream.remoteMediaStream
        );
        updateLocalVideo(
          meetingInfo.video.local.videoOn,
          meetingInfo.video.local.volume,
          1
        );
        recordStart();
      }
      
      setMeetingInfo((prevMeetingInfo) => {
        const newMeetingInfo = { ...prevMeetingInfo };
        newMeetingInfo.record.canRecog = true;
        return newMeetingInfo;
      });

      sendMessage(
        JSON.stringify({
          cmd: "request peer cam state",
        })
      );
    };

    peerConnection.onconnectionstatechange = function () {};

    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.connect.peerConnection = peerConnection;
      newMeetingInfo.connect.dataChannel = dataChannel;
      return newMeetingInfo;
    });
  };

  const createOffer = function () {
    meetingInfo.connect.peerConnection.createOffer(
      function (offer) {
        meetingInfo.connect.peerConnection.setLocalDescription(offer);

        send({
          event: "offer",
          data: offer,
        });
      },
      function () {
        alert("Error creating an offer");
      }
    );
    if (meetingInfo.connect.peerConnection.getSenders().length === 0) {
      meetingInfo.stream.localMediaStream.getTracks().forEach((track) => {
        meetingInfo.connect.peerConnection.addTrack(track);
      });
    }
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.connect.offerReady = false;
      return newMeetingInfo;
    });
  };

  const handleAccess = function (meetingId) {
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.connect.offerReady = true;
      newMeetingInfo.meetingId = meetingId;
      return newMeetingInfo;
    });
  };

  const handleOffer = function (offer) {
    meetingInfo.connect.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    // create and send an answer to an offer
    meetingInfo.connect.peerConnection.createAnswer(
      function (answer) {
        meetingInfo.connect.peerConnection.setLocalDescription(answer);
        send({
          event: "answer",
          data: answer,
        });
      },
      function () {
        alert("Error creating an answer");
      }
    );
    if (meetingInfo.connect.peerConnection.getSenders().length === 0) {
      meetingInfo.stream.localMediaStream.getTracks().forEach((track) => {
        meetingInfo.connect.peerConnection.addTrack(track);
      });
    }
    //   peerConnection.addStream(mediaStream);
  };

  const handleAnswer = function (answer) {
    meetingInfo.connect.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    console.log("connection established successfully!!");
  };

  const handleCandidate = function (candidate) {
    meetingInfo.connect.peerConnection.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  };

  const send = function (message) {
    meetingInfo.connect.conn.send(JSON.stringify(message));
  };

  const sendMessage = function (msg) {
    meetingInfo.connect.dataChannel.send(msg);
  };

  const setMediaRecorder = function (idx, local, remote) {
    meetingInfo.record.mediaRecorder[idx][0] = new MediaRecorder(
      local,
      meetingInfo.record.option
    );
    meetingInfo.record.mediaRecorder[idx][1] = new MediaRecorder(
      remote,
      meetingInfo.record.option
    );
    meetingInfo.record.mediaRecorder[idx][0].ondataavailable = function (
      event
    ) {
      if (event.data.size > 0) {
        meetingInfo.record.recordedChunks[idx][0].push(event.data);
      }
    };
    meetingInfo.record.mediaRecorder[idx][1].ondataavailable = function (
      event
    ) {
      if (event.data.size > 0) {
        meetingInfo.record.recordedChunks[idx][1].push(event.data);
      }
    };

    meetingInfo.record.mediaRecorder[idx][0].onstart = function () {
      meetingInfo.record.recordedChunks[idx][0] = [];

      setTimeout(() => {
        meetingInfo.record.nowIdx = idx;
      }, 1000);

      setTimeout(() => {
        if (
          meetingInfo.connect.peerConnection.connectionState === "connected"
        ) {
          meetingInfo.record.mediaRecorder[idx][0].stop();
        }
      }, 10000);
    };
    meetingInfo.record.mediaRecorder[idx][1].onstart = function () {
      meetingInfo.record.recordedChunks[idx][1] = [];

      setTimeout(() => {
        if (
          meetingInfo.connect.peerConnection.connectionState === "connected"
        ) {
          meetingInfo.record.mediaRecorder[idx][1].stop();
        }
      }, 10000);
    };

    meetingInfo.record.mediaRecorder[idx][0].onstop = function () {
      console.log(idx);
      if (meetingInfo.record.recordFlag[idx][0] === true) {
        meetingInfo.record.recordFlag[idx][0] = false;
        const blob = new Blob(meetingInfo.record.recordedChunks[idx][0], {
          mimeType: "video/webm; codecs=vp9,opus",
        });
        if (
          meetingInfo.connect.peerConnection.connectionState === "connected"
        ) {
          meetingInfo.record.mediaRecorder[idx][0].start(1000);
        }

        setMeetingInfo((prevMeetingInfo) => {
          const newMeetingInfo = { ...prevMeetingInfo };
          newMeetingInfo.record.tmpRecord[user1 === userId ? 0 : 1] = blob;

          return newMeetingInfo;
        });
      } else {
        if (
          meetingInfo.connect.peerConnection.connectionState === "connected"
        ) {
          meetingInfo.record.mediaRecorder[idx][0].start(1000);
        }
      }
    };
    meetingInfo.record.mediaRecorder[idx][1].onstop = function () {
      if (meetingInfo.record.recordFlag[idx][1] === true) {
        meetingInfo.record.recordFlag[idx][1] = false;
        let blob = new Blob(meetingInfo.record.recordedChunks[idx][1], {
          mimeType: "video/webm; codecs=vp9,opus",
        });
        if (
          meetingInfo.connect.peerConnection.connectionState === "connected"
        ) {
          meetingInfo.record.mediaRecorder[idx][1].start(1000);
        }
        setMeetingInfo((prevMeetingInfo) => {
          const newMeetingInfo = { ...prevMeetingInfo };
          newMeetingInfo.record.tmpRecord[user1 === userId ? 1 : 0] = blob;

          return newMeetingInfo;
        });
      } else {
        if (meetingInfo.record.mediaRecorder[idx][1]) {
          if (
            meetingInfo.connect.peerConnection.connectionState === "connected"
          ) {
            meetingInfo.record.mediaRecorder[idx][1]?.start(1000);
          }
        }
      }
    };
  };

  function recordStart() {
    if (meetingInfo.connect.peerConnection.connectionState === "connected") {
      meetingInfo.record.mediaRecorder[0][0].start(1000);
      meetingInfo.record.mediaRecorder[0][1].start(1000);
    }
    setTimeout(() => {
      if (meetingInfo.connect.peerConnection.connectionState === "connected") {
        meetingInfo.record.mediaRecorder[1][0].start(1000);
        meetingInfo.record.mediaRecorder[1][1].start(1000);
      }
    }, 5000);
  }

  function handleRemoteChatting(message) {
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = {
        ...prevMeetingInfo,
        chattingHistory: [
          ...prevMeetingInfo.chattingHistory,
          { isLocal: false, message: message },
        ],
      };
      return newMeetingInfo;
    });
  }

  function handleNewClip(message) {
    const blob = message;
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.clipHistory.push(blob);
      return newMeetingInfo;
    });
  }

  //////

  

  

  if (!meetingInfo.init) {
    getLocalMediaStream();
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.init = true;
      return newMeetingInfo;
    });
  }

  if (meetingInfo.record.tmpRecord[0] && meetingInfo.record.tmpRecord[1]) {
    let formData = new FormData();
    formData.set("meeting_id", meetingInfo.meetingId);
    formData.set("keyword", "안녕");
    formData.set("couple_id", coupleId);
    formData.set("clip1", meetingInfo.record.tmpRecord[0], "clip1.webm");
    formData.set("clip2", meetingInfo.record.tmpRecord[1], "clip2.webm");

    fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/clip`, {
      method: "post",
      headers: {
        Accept: "*/*",
      },
      body: formData,
    })
      .then((response) => {
        // sendMessage(
        //   JSON.stringify({
        //     cmd: "send new clip",
        //     data: response.body,
        //   })
        // );
        // setMeetingInfo((prevMeetingInfo) => {
        //   const newMeetingInfo = { ...prevMeetingInfo };
        //   newMeetingInfo.clipHistory.push(
        //     new Blob(response.body, {
        //       mimeType: "video/webm; codecs=vp9,opus",
        //     })
        //   );
        //   return newMeetingInfo;
        // });
      })
      .catch((err) => {
        console.log(err);
      });

    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.record.tmpRecord = [null, null];
      return newMeetingInfo;
    });
  }

  useEffect(() => {
    if (
      meetingInfo.chattingHistory.length &&
      meetingInfo.rightWindowIsChatting
    ) {
      chattingWindow.current.childNodes[
        meetingInfo.chattingHistory.length - 1
      ].scrollIntoView({
        block: "end",
      });
    }
  }, [meetingInfo.chattingHistory.length, meetingInfo.rightWindowIsChatting]);

  // useEffect(() => {
  //   updateLocalVideo(
  //     meetingInfo.video.local.videoOn,
  //     meetingInfo.video.local.volume,
  //   );
  // }, [meetingInfo.isModalOpen]);

  useBeforeUnload(() => {
    meetingInfo.connect.dataChannel.close();
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.init = false;
      return newMeetingInfo;
    });
    stop();
  });

  return (
    <div className="h-full w-full flex flex-row contents-center">
      <div className="w-9/12 flex flex-col justify-center">
        <LeftWindow
          meetingInfo={meetingInfo}
          createOffer={createOffer}
          updateLocalVideo={updateLocalVideo}
          readyCam={readyCam}
          setConnection={setConnection}
          setMeetingInfo={setMeetingInfo}
          listen={listen}
          camContainer={camContainer}
          remoteCam={remoteCam}
          localCamContainer={localCamContainer}
          localCam={localCam}
          sendMessage={sendMessage}
          updateRemoteVideo={updateRemoteVideo}
        />
      </div>
      <div className="w-3/12 flex flex-col justify-center mr-5">
        <RightWindow
          meetingInfo={meetingInfo}
          setMeetingInfo={setMeetingInfo}
          chattingWindow={chattingWindow}
          sendMessage={sendMessage}
          kakaoId={kakaoId}
          nickname={nickname}
          sendImg={sendImg}
        />
      </div>
    </div>
  );
}

export default Meeting;
