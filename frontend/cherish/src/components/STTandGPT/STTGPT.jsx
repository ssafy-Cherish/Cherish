import { useRef, useState, useEffect } from "react";
import sendImg from "../../assets/SendIcon.svg";
import { motion } from "framer-motion";
import "../CherryCall/Meeting.css";
import { useBeforeUnload } from "react-router-dom";
import { useSpeechRecognition } from "react-speech-kit";
////////

function STTGPT() {
  const [isModalOpen, setIsModalOpen] = useState(true);

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
        mimeType: "video/webm; codecs=vp9",
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
      },

      recogString: "",

      canRecog: true,

      nowIdx: 0,

      tmpRecord: [],
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

    // STTGPT용으로 이승준이 추가함
    rightWindow: 0,
    scriptHistory: [],
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
            newMeetingInfo.record.recordFlag[prevMeetingInfo.record.nowIdx][0] = true;
            newMeetingInfo.record.recordFlag[prevMeetingInfo.record.nowIdx][1] = true;
          }
        }
        console.log(result);
        newMeetingInfo.scriptHistory.push({
          message: result,
          isLocal: true,
          time: new Date(),
        });
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

  const getLocalMediaStream = function () {
    console.log("get cam mic");
    const constraints = {
      video: {
        frameRate: {
          ideal: 60,
          max: 80,
        },
        width: 500,
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
        meetingInfo.stream.localMediaStream.addTrack(track);
      });
      updateLocalVideo(true, 1);
    });
  };

  const updateLocalVideo = function (on, volume) {
    if (meetingInfo.dataChannel?.readyState === "open") {
      JSON.stringify({
        cmd: "responce peer cam state",
        data: {
          videoOn: meetingInfo.video.local.videoOn,
          volume: meetingInfo.video.local.volume,
        },
      });
    }

    if (readyCam.current) {
      readyCam.current.srcObject = on ? meetingInfo.stream.localMediaStream : new MediaStream();
      readyCam.current.volume = volume;
    }

    if (localCam.current) {
      localCam.current.srcObject = on ? meetingInfo.stream.localMediaStream : new MediaStream();
      localCam.current.volume = volume;
    }

    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.video.local.videoOn = on;
      newMeetingInfo.video.local.volume = volume;
      return newMeetingInfo;
    });
  };

  const updateRemoteVideo = function (on, volume) {
    if (remoteCam.current) {
      remoteCam.current.srcObject = on ? meetingInfo.stream.remoteMediaStream : new MediaStream();
      remoteCam.current.volume = volume;
    }

    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.video.remote.videoOn = on;
      newMeetingInfo.video.remote.volume = volume;
      return newMeetingInfo;
    });
  };

  const setConnection = function () {
    const conn = new WebSocket(import.meta.env.VITE_APP_SOCKET_URL);

    conn.onopen = function () {
      console.log("Connected to the signaling server");
      initialize();
      send({
        event: "access",
        data: JSON.stringify({
          coupleId: 1,
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
          handleAccess();
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

    conn.onclose = function () {
      send({
        event: "exit",
        data: {
          coupleId: 1,
        },
      });
    };

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
              cmd: "responce peer cam state",
              data: {
                videoOn: meetingInfo.video.local.videoOn,
                volume: meetingInfo.video.local.volume,
              },
            })
          );
          break;

        case "responce peer cam state":
          updateRemoteVideo(msg.data.videoOn, msg.data.volume);
          break;

        case "send chatting massage":
          handleRemoteChatting(msg.data);
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

        updateRemoteVideo(newMeetingInfo.video.remote.videoOn, newMeetingInfo.video.remote.volume);
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
        updateLocalVideo(meetingInfo.video.local.videoOn, meetingInfo.video.local.volume);
        recordStart();
      }
      sendMessage(
        JSON.stringify({
          cmd: "request peer cam state",
        })
      );
      setMeetingInfo((prevMeetingInfo) => {
        const newMeetingInfo = { ...prevMeetingInfo };
        newMeetingInfo.record.canRecog = true;
        return newMeetingInfo;
      });
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

  const handleAccess = function () {
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.connect.offerReady = true;
      return newMeetingInfo;
    });
  };

  const handleOffer = function (offer) {
    meetingInfo.connect.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

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
    meetingInfo.connect.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
  };

  const handleCandidate = function (candidate) {
    meetingInfo.connect.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const send = function (message) {
    meetingInfo.connect.conn.send(JSON.stringify(message));
  };

  const sendMessage = function (msg) {
    meetingInfo.connect.dataChannel.send(msg);
  };

  const setMediaRecorder = function (idx, local, remote) {
    meetingInfo.record.mediaRecorder[idx][0] = new MediaRecorder(local, meetingInfo.record.option);
    meetingInfo.record.mediaRecorder[idx][1] = new MediaRecorder(remote, meetingInfo.record.option);
    meetingInfo.record.mediaRecorder[idx][0].ondataavailable = function (event) {
      if (event.data.size > 0) {
        meetingInfo.record.recordedChunks[idx][0].push(event.data);
      }
    };
    meetingInfo.record.mediaRecorder[idx][1].ondataavailable = function (event) {
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
        if (meetingInfo.connect.peerConnection.connectionState === "connected") {
          meetingInfo.record.mediaRecorder[idx][0].stop();
        }
      }, 10000);
    };
    meetingInfo.record.mediaRecorder[idx][1].onstart = function () {
      meetingInfo.record.recordedChunks[idx][1] = [];

      setTimeout(() => {
        if (meetingInfo.connect.peerConnection.connectionState === "connected") {
          meetingInfo.record.mediaRecorder[idx][1].stop();
        }
      }, 10000);
    };

    meetingInfo.record.mediaRecorder[idx][0].onstop = function () {
      console.log(idx);
      if (meetingInfo.record.recordFlag[idx][0] === true) {
        meetingInfo.record.recordFlag[idx][0] = false;
        const blob = new Blob(meetingInfo.record.recordedChunks[idx][0], {
          mimeType: "video/webm; codecs=vp9",
        });
        if (meetingInfo.connect.peerConnection.connectionState === "connected") {
          meetingInfo.record.mediaRecorder[idx][0].start(1000);
        }
        let url = URL.createObjectURL(blob);
        console.log(url);
        setMeetingInfo((prevMeetingInfo) => {
          const newMeetingInfo = { ...prevMeetingInfo };
          newMeetingInfo.record.tmpRecord.push(url);
          if (newMeetingInfo.record.tmpRecord.length === 2) {
            newMeetingInfo.clipHistory.push(newMeetingInfo.record.tmpRecord);
            newMeetingInfo.record.tmpRecord = [];
          }
          return newMeetingInfo;
        });
      } else {
        if (meetingInfo.connect.peerConnection.connectionState === "connected") {
          meetingInfo.record.mediaRecorder[idx][0].start(1000);
        }
      }
    };
    meetingInfo.record.mediaRecorder[idx][1].onstop = function () {
      if (meetingInfo.record.recordFlag[idx][1] === true) {
        meetingInfo.record.recordFlag[idx][1] = false;
        let blob = new Blob(meetingInfo.record.recordedChunks[idx][1], {
          mimeType: "video/webm; codecs=vp9",
        });
        if (meetingInfo.connect.peerConnection.connectionState === "connected") {
          meetingInfo.record.mediaRecorder[idx][1].start(1000);
        }
        let url = URL.createObjectURL(blob);
        console.log(url);

        setMeetingInfo((prevMeetingInfo) => {
          const newMeetingInfo = { ...prevMeetingInfo };
          newMeetingInfo.record.tmpRecord.push(url);
          if (newMeetingInfo.record.tmpRecord.length === 2) {
            newMeetingInfo.clipHistory.push(newMeetingInfo.record.tmpRecord);
            newMeetingInfo.record.tmpRecord = [];
          }
          return newMeetingInfo;
        });
      } else {
        if (meetingInfo.record.mediaRecorder[idx][1]) {
          if (meetingInfo.connect.peerConnection.connectionState === "connected") {
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
        chattingHistory: [...prevMeetingInfo.chattingHistory, { isLocal: false, message: message }],
      };
      return newMeetingInfo;
    });
  }

  console.log("여기 어디지");
  console.log(meetingInfo, listening);

  if (!meetingInfo.init) {
    getLocalMediaStream();
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.init = true;
      return newMeetingInfo;
    });
  }

  useEffect(() => {
    if (meetingInfo.chattingHistory.length) {
      chattingWindow.current.childNodes[meetingInfo.chattingHistory.length - 1].scrollIntoView({
        block: "end",
      });
    }
  }, [meetingInfo.chattingHistory.length]);

  useEffect(() => {
    updateLocalVideo(meetingInfo.video.local.videoOn, meetingInfo.video.local.volume);
  }, [isModalOpen]);

  useBeforeUnload(() => {
    meetingInfo.connect.dataChannel.close();
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.init = false;
      return newMeetingInfo;
    });
  });

  function rightWindow() {
    switch (meetingInfo.rightWindow) {
      case 0: // 채팅
        return (
          <div className="h-[80%] flex flex-col justify-between px-4">
            <div className="relative rounded-b-2xl h-[85%]">
              <div
                className="scroll-box bg-white rounded-b-2xl h-full overflow-y-scroll absolute w-full"
                ref={chattingWindow}
              >
                {meetingInfo.chattingHistory.map((elem, idx) => {
                  if (elem.isLocal) {
                    return (
                      <div key={idx} className="flex flex-row justify-end pl-8 pr-4 pt-4 w-full">
                        <div
                          style={{
                            backgroundColor: "#FEF8EC",
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                          }}
                          className="py-2 pl-4 pr-4 rounded-tl-xl rounded-b-xl drop-shadow max-w-[90%]"
                        >
                          {elem.message}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={idx} className="flex flex-row justify-start pl-4 pr-8 pt-4 w-full">
                        <div
                          style={{
                            backgroundColor: "#E0F4FF",
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                          }}
                          className="py-2 pl-4 pr-4 rounded-tr-xl rounded-b-xl drop-shadow max-w-[90%]"
                        >
                          {elem.message}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (event.target.childNodes[0].value.trim().length !== 0) {
                  console.log(event.target.childNodes[0].value);
                  sendMessage(
                    JSON.stringify({
                      cmd: "send chatting massage",
                      data: event.target.childNodes[0].value,
                    })
                  );

                  setMeetingInfo((prevMeetingInfo) => {
                    const newMeetingInfo = { ...prevMeetingInfo };
                    newMeetingInfo.chattingHistory = [
                      ...prevMeetingInfo.chattingHistory,
                      {
                        isLocal: true,
                        message: event.target.childNodes[0].value,
                      },
                    ];
                    return newMeetingInfo;
                  });
                }
                event.target.childNodes[0].value = "";
              }}
              className="mx-4 rounded-2xl h-[10%] flex flex-row"
            >
              <textarea
                className="bg-white w-full rounded-2xl"
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    if (!event.shiftKey) {
                      if (event.target.value.trim().length !== 0) {
                        event.preventDefault();
                        console.log(event.target.value);
                        const msg = event.target.value;

                        sendMessage(
                          JSON.stringify({
                            cmd: "send chatting massage",
                            data: event.target.value,
                          })
                        );

                        setMeetingInfo((prevMeetingInfo) => {
                          const newMeetingInfo = { ...prevMeetingInfo };
                          newMeetingInfo.chattingHistory = [
                            ...prevMeetingInfo.chattingHistory,
                            {
                              isLocal: true,
                              message: msg,
                            },
                          ];
                          return newMeetingInfo;
                        });
                      }
                      event.target.value = "";
                    }
                  }
                }}
              ></textarea>
              <button className="ml-4 w-12 rounded-2xl flex flex-col justify-center items-center">
                <img src={sendImg} className="w-5/6 h-5/6 rounded-2xl" />
              </button>
            </form>
          </div>
        );

      case 1: // 클립
        return (
          <div className="h-[80%] flex flex-col justify-between">
            <div className="scroll-box bg-white mx-4 rounded-2xl h-[100%] overflow-y-scroll py-[5%]">
              {meetingInfo.clipHistory.map((clip, idx) => {
                return (
                  <div key={idx} className="flex flex-col items-center h-[20%]">
                    <div className="flex flex-row justify-evenly">
                      <div className="w-[50%]">
                        <video
                          src={clip[0]}
                          onClick={(event) => {
                            event.preventDefault();
                            event.target.play();
                          }}
                        ></video>
                      </div>
                      <div className="w-[50%]">
                        <video
                          src={clip[1]}
                          onClick={(event) => {
                            event.preventDefault();
                            event.target.play();
                          }}
                        ></video>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2: // 대본
        return (
          <div className="h-[80%] flex flex-col justify-between px-4">
            <div className="relative rounded-b-2xl h-[85%]">
              <div className="scroll-box bg-white rounded-b-2xl h-full overflow-y-scroll absolute w-full">
                {meetingInfo.scriptHistory.map((elem, idx) => {
                  if (elem.isLocal) {
                    return (
                      <div key={idx} className="flex flex-row justify-end pl-8 pr-4 pt-4 w-full">
                        <div
                          style={{
                            backgroundColor: "#FEF8EC",
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                          }}
                          className="py-2 pl-4 pr-4 rounded-tl-xl rounded-b-xl drop-shadow max-w-[90%]"
                        >
                          {elem.message}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={idx} className="flex flex-row justify-start pl-4 pr-8 pt-4 w-full">
                        <div
                          style={{
                            backgroundColor: "#E0F4FF",
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                          }}
                          className="py-2 pl-4 pr-4 rounded-tr-xl rounded-b-xl drop-shadow max-w-[90%]"
                        >
                          {elem.message}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="grid grid-cols-12 gap-5 h-full">
      <div className="col-span-12 mx-5 h-screen">
        <div className="flex flex-row contents-center h-full">
          <div className="w-9/12 flex flex-col justify-center">
            <div className="h-3/4 m-2 rounded-2xl flex flex-col-reverse">
              <div className="h-14 bg-pink rounded-b-2xl flex flex-row justify-between">
                <div className="border-2 m-2 w-1/6"></div>
                <button
                  className="border-2 m-2 w-14 rounded-2xl"
                  disabled={!meetingInfo.connect.offerReady}
                  onClick={() => {
                    createOffer();
                  }}
                >
                  통화
                </button>
              </div>
              {!isModalOpen && (
                <motion.div
                  className="h-full w-full relative flex flex-col-reverse items-center bg-slate-700 rounded-t-2xl z-50"
                  ref={camContainer}
                >
                  <video
                    className="h-full bg-slate-700 absolute rounded-t-2xl"
                    id="remoteCam"
                    ref={remoteCam}
                    autoPlay
                    playsInline
                  ></video>
                  {meetingInfo.video.local.videoOn && (
                    <motion.div
                      className="h-[30%] w-[30%] z-100 relative left-[30%] bottom-[5%] rounded-2xl bg-pink flex flex-col justify-center items-center"
                      drag
                      dragConstraints={camContainer}
                      ref={localCamContainer}
                      dragMomentum={false}
                    >
                      <video
                        ref={localCam}
                        autoPlay
                        playsInline
                        className="h-[90%] w-[90%] absolute "
                      ></video>
                    </motion.div>
                  )}
                </motion.div>
              )}
              {isModalOpen && (
                <div className="h-full bg-slate-700 flex flex-col justify-center items-center rounded-t-2xl">
                  <div className="h-5/6 w-1/2 mt-5 rounded-2xl bg-pink flex flex-col justify-center items-center">
                    <div className="h-1/3 w-full flex flex-col justify-center text-center font-extrabold text-xl">
                      체리콜을 시작할까요?
                    </div>
                    <div className="h-2/3 w-5/6  flex flex-col-reverse justify-center">
                      <div className="h-14 bg-white rounded-b-2xl flex flex-row justify-center">
                        <button
                          className="w-10 my-2 mx-5 border-2"
                          onClick={() => {
                            const targetVolume = meetingInfo.video.local.volume == 0 ? 0.5 : 0;
                            const targetOn = meetingInfo.video.local.videoOn;
                            updateLocalVideo(targetOn, targetVolume);
                          }}
                        ></button>
                        <button
                          className="w-10 my-2 mx-5 border-2"
                          onClick={() => {
                            const targetVolume = meetingInfo.video.local.volume;
                            const targetOn = !meetingInfo.video.local.videoOn;
                            updateLocalVideo(targetOn, targetVolume);
                          }}
                        ></button>
                      </div>

                      <div className="h-full rounded-t-2xl bg-slate-700 flex justify-center relative">
                        <video
                          id="ready-cam"
                          ref={readyCam}
                          autoPlay
                          playsInline
                          className="absolute h-full w-full"
                        ></video>
                      </div>
                    </div>
                    <div className="h-1/4 w-5/6 flex flex-row justify-between items-center">
                      <button
                        className={
                          meetingInfo.stream.localMediaStream.getTracks().length !== 0
                            ? "px-5 h-14 bg-skyblue rounded-2xl font-extrabold text-xl"
                            : "px-5 h-14 bg-zinc-400 rounded-2xl font-extrabold text-xl"
                        }
                        disabled={meetingInfo.stream.localMediaStream.getTracks().length === 0}
                        onClick={(event) => {
                          event.preventDefault();
                          meetingInfo.stream.localMediaStream.getTracks().forEach((track) => {
                            track.stop();
                          });
                        }}
                      >
                        알림보내기
                      </button>
                      <button
                        className={
                          meetingInfo.stream.localMediaStream.getTracks().length !== 0
                            ? "px-5 h-14 bg-skyblue rounded-2xl font-extrabold text-xl"
                            : "px-5 h-14 bg-zinc-400 rounded-2xl font-extrabold text-xl"
                        }
                        disabled={meetingInfo.stream.localMediaStream.getTracks().length === 0}
                        onClick={() => {
                          setConnection();

                          setIsModalOpen(false);
                          console.log("웹스피치 시작");
                          listen({ interimResults: false, lang: "ko-KR" });
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
            <div className="bg-pink h-[75%] m-2 rounded-2xl flex flex-col justify-evenly">
              <div className="bg-white mx-4 rounded-t-2xl h-[10%]">
                <button
                  className="w-[33%] h-full font-extrabold text-xl"
                  disabled={meetingInfo.rightWindow == 0}
                  onClick={() => {
                    setMeetingInfo((prevMeetingInfo) => {
                      const newMeetingInfo = { ...prevMeetingInfo };
                      newMeetingInfo.rightWindowIsChatting = !newMeetingInfo.rightWindowIsChatting;
                      newMeetingInfo.rightWindow = 0;
                      return newMeetingInfo;
                    });
                  }}
                >
                  체리톡
                </button>
                <button
                  className="w-[33%] h-full font-extrabold text-xl"
                  disabled={meetingInfo.rightWindow == 1}
                  onClick={() => {
                    setMeetingInfo((prevMeetingInfo) => {
                      const newMeetingInfo = { ...prevMeetingInfo };
                      newMeetingInfo.rightWindowIsChatting = !newMeetingInfo.rightWindowIsChatting;
                      newMeetingInfo.rightWindow = 1;
                      return newMeetingInfo;
                    });
                  }}
                >
                  클립
                </button>
                <button
                  className="w-[33%] h-full font-extrabold text-xl"
                  disabled={meetingInfo.rightWindow == 2}
                  onClick={() => {
                    setMeetingInfo((prevMeetingInfo) => {
                      const newMeetingInfo = { ...prevMeetingInfo };
                      newMeetingInfo.rightWindowIsChatting = !newMeetingInfo.rightWindowIsChatting;
                      newMeetingInfo.rightWindow = 2;
                      return newMeetingInfo;
                    });
                  }}
                >
                  대본
                </button>
              </div>
              {rightWindow()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default STTGPT;
