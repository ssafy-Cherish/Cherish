import { useRef, useState, useEffect } from "react";
import sendImg from "../../assets/SendIcon.svg";
////////

function Meeting() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [meetingInfo, setMeetingInfo] = useState({
    stream: {
      localMediaStream: new MediaStream(),
      remoteMediaStream: new MediaStream(),
    },

    video: {
      local: {
        videoOn: false,
        volume: 0,
      },
      remote: {
        videoOn: false,
        volume: 0,
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

      nowIdx: 0,
    },

    connect: {
      conn: null,
      peerConnection: null,
      dataChannel: null,
    },

    chattingHistory: [],

    clipHistory: [],

    rightWindowIsChatting: true,
  });

  //////

  const readyCam = useRef();

  const chattingWindow = useRef();

  //////
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
        meetingInfo.stream.localMediaStream.addTrack(track);
      });
      updateLocalVideo(true, 0.5);
    });
  };

  const updateLocalVideo = function (on, volume) {
    readyCam.current.srcObject = on
      ? meetingInfo.stream.localMediaStream
      : null;
    readyCam.current.volume = volume;
    const res = { ...meetingInfo };
    res.video.local.videoOn = on;
    res.video.local.volume = volume;
    setMeetingInfo(res);
  };

  const setConnection = function () {
    const conn = new WebSocket("ws://192.168.100.58:8080/socket");

    conn.onopen = function () {
      console.log("Connected to the signaling server");
      initialize();
      send({
        event: "access",
        data: {
          coupleId: 0,
        },
      });
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

    conn.onclose = function () {
      send({
        event: "exit",
        data: {
          coupleId: 0,
        },
      });
    };

    const nextMeetingInfo = { ...meetingInfo };
    nextMeetingInfo.connect.conn = conn;
    setMeetingInfo(nextMeetingInfo);
  };

  const initialize = function () {
    const configuration = null;

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
        // case "request peer cam state":
        //   sendMessage(
        //     JSON.stringify({
        //       cmd: "responce peer cam state",
        //       data: camstate,
        //     })
        //   );
        //   break;

        // case "responce peer cam state":
        //   remoteStream = msg.data ? remoteMediaStream : null;
        //   document.getElementById("peer").srcObject = remoteStream;
        //   break;

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
      initialize();
      console.log("data channel is closed");
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

        recordStart();
      }
      sendMessage(
        JSON.stringify({
          cmd: "request peer cam state",
        })
      );
    };

    const nextMeetingInfo = { ...meetingInfo };
    nextMeetingInfo.connect.peerConnection = peerConnection;
    nextMeetingInfo.connect.dataChannel = dataChannel;
    setMeetingInfo(nextMeetingInfo);
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
        meetingInfo.record.mediaRecorder[idx][0].stop();
      }, 10000);
    };
    meetingInfo.record.mediaRecorder[idx][1].onstart = function () {
      meetingInfo.record.recordedChunks[idx][1] = [];

      setTimeout(() => {
        meetingInfo.record.mediaRecorder[idx][1].stop();
      }, 10000);
    };

    meetingInfo.record.mediaRecorder[idx][0].onstop = function () {
      if (meetingInfo.record.recordFlag[idx][0] === true) {
        meetingInfo.record.recordFlag[idx][0] = false;
        let blob = new Blob(meetingInfo.record.recordedChunks[idx][0], {
          mimeType: "video/webm; codecs=vp9",
        });
        meetingInfo.record.mediaRecorder[idx][0].start(1000);
        let url = URL.createObjectURL(blob);
        console.log(url);

        const localv = document.getElementById("record");
        localv.src = url;
        localv.load();
        localv.oncanplaythrough = function () {
          // 로드 완료되면 실행
          localv.play();
        };
      } else {
        meetingInfo.record.mediaRecorder[idx][0].start(1000);
      }
    };
    meetingInfo.record.mediaRecorder[idx][1].onstop = function () {
      if (meetingInfo.record.recordFlag[idx][1] === true) {
        meetingInfo.record.recordFlag[idx][1] = false;
        let blob = new Blob(meetingInfo.record.recordedChunks[idx][1], {
          mimeType: "video/webm; codecs=vp9",
        });
        meetingInfo.record.mediaRecorder[idx][1].start(1000);
        let url = URL.createObjectURL(blob);
        console.log(url);

        const remotev = document.getElementById("recordpeer");
        remotev.src = url;
        remotev.load();
        remotev.oncanplaythrough = function () {
          // 로드 완료되면 실행
          remotev.play();
        };
      } else {
        meetingInfo.record.mediaRecorder[idx][1].start(1000);
      }
    };
  };

  function recordStart() {
    meetingInfo.record.mediaRecorder[0][0].start(1000);
    meetingInfo.record.mediaRecorder[0][1].start(1000);
    setTimeout(() => {
      meetingInfo.record.mediaRecorder[1][0].start(1000);
      meetingInfo.record.mediaRecorder[1][1].start(1000);
    }, 5000);
  }

  //////

  console.log(meetingInfo);

  useEffect(() => {
    getLocalMediaStream();
  }, []);

  useEffect(() => {
    if (meetingInfo.chattingHistory.length) {
      chattingWindow.current.childNodes[
        meetingInfo.chattingHistory.length - 1
      ].scrollIntoView({
        block: "end",
      });
    }
  }, [meetingInfo.chattingHistory.length]);

  return (
    <div className="h-full w-full flex flex-row contents-center">
      <div className="w-9/12 flex flex-col justify-center">
        <div className="h-3/4 m-2 rounded-2xl flex flex-col-reverse">
          <div className="h-14 bg-pink rounded-b-2xl flex flex-row justify-between">
            <div className="border-2 m-2 w-1/6"></div>
            <button className="border-2 m-2 w-14 rounded-2xl"></button>
          </div>
          {!isModalOpen && (
            <div className="h-full w-full">
              <video
                src=""
                className="h-full bg-slate-700 rounded-t-2xl"
              ></video>
            </div>
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
                        const targetVolume =
                          meetingInfo.video.local.volume == 0 ? 0.5 : 0;
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
                  <div className="h-full rounded-t-2xl bg-slate-700 flex justify-center">
                    <video
                      id="ready-cam"
                      ref={readyCam}
                      autoPlay
                      playsInline
                    ></video>
                  </div>
                </div>
                <div className="h-1/4 w-5/6 flex flex-row justify-between items-center">
                  <button
                    className={
                      meetingInfo.stream.localMediaStream.getTracks().length !==
                      0
                        ? "px-5 h-14 bg-skyblue rounded-2xl font-extrabold text-xl"
                        : "px-5 h-14 bg-zinc-400 rounded-2xl font-extrabold text-xl"
                    }
                    disabled={
                      meetingInfo.stream.localMediaStream.getTracks().length ===
                      0
                    }
                  >
                    알림보내기
                  </button>
                  <button
                    className={
                      meetingInfo.stream.localMediaStream.getTracks().length !==
                      0
                        ? "px-5 h-14 bg-skyblue rounded-2xl font-extrabold text-xl"
                        : "px-5 h-14 bg-zinc-400 rounded-2xl font-extrabold text-xl"
                    }
                    disabled={
                      meetingInfo.stream.localMediaStream.getTracks().length ===
                      0
                    }
                    onClick={() => {
                      setIsModalOpen(false);
                      setConnection();
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
              className="w-[50%] h-full font-extrabold text-xl"
              disabled={meetingInfo.rightWindowIsChatting}
              onClick={() => {
                const nextMeetingInfo = { ...meetingInfo };
                nextMeetingInfo.rightWindowIsChatting =
                  !nextMeetingInfo.rightWindowIsChatting;
                setMeetingInfo(nextMeetingInfo);
              }}
            >
              체리톡
            </button>
            <button
              className="w-[50%] h-full font-extrabold text-xl"
              disabled={!meetingInfo.rightWindowIsChatting}
              onClick={() => {
                const nextMeetingInfo = { ...meetingInfo };
                nextMeetingInfo.rightWindowIsChatting =
                  !nextMeetingInfo.rightWindowIsChatting;
                setMeetingInfo(nextMeetingInfo);
              }}
            >
              클립
            </button>
          </div>
          {meetingInfo.rightWindowIsChatting ? (
            <div className="h-[80%] flex flex-col justify-between px-4">
              <div className="relative rounded-b-2xl h-[85%]">
                <div
                  className="bg-white rounded-b-2xl h-full overflow-y-scroll absolute w-full"
                  ref={chattingWindow}
                >
                  {meetingInfo.chattingHistory.map((elem, idx) => {
                    if (elem.isLocal) {
                      return (
                        <div
                          key={idx}
                          className="flex flex-row justify-end pl-8 pr-4 pt-4 "
                        >
                          <div
                            style={{
                              backgroundColor: "#FEF8EC",
                              whiteSpace: "pre-line",
                            }}
                            className="py-2 pl-4 pr-4 rounded-tl-xl rounded-b-xl drop-shadow"
                          >
                            {elem.message}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={idx}
                          className="flex flex-row justify-start pl-4 pr-8 pt-4"
                        >
                          <div
                            style={{
                              backgroundColor: "#E0F4FF",
                              whiteSpace: "pre-line",
                            }}
                            className="py-2 pl-4 pr-4 rounded-tr-xl rounded-b-xl drop-shadow"
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
                    const newChattingHistory = [
                      ...meetingInfo.chattingHistory,
                      {
                        isLocal: true,
                        message: event.target.childNodes[0].value,
                      },
                    ];
                    const newMeetingInfo = { ...meetingInfo };
                    newMeetingInfo.chattingHistory = newChattingHistory;
                    setMeetingInfo(newMeetingInfo);
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
                          const newChattingHistory = [
                            ...meetingInfo.chattingHistory,
                            {
                              isLocal: true,
                              message: event.target.value,
                            },
                          ];
                          const newMeetingInfo = { ...meetingInfo };
                          newMeetingInfo.chattingHistory = newChattingHistory;
                          setMeetingInfo(newMeetingInfo);
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
          ) : (
            <div className="h-[80%] flex flex-col justify-between">
              <div className="bg-white mx-4 rounded-b-2xl h-[100%] overflow-y-scroll"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Meeting;
