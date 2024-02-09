// 이승준이 수정한 파일

import { useRef, useState, useEffect } from "react";
import sendImg from "../../assets/SendIcon.svg";
import "./Meeting.css";
import { useBeforeUnload } from "react-router-dom";
import { useSpeechRecognition } from "react-speech-kit";
import userStore from "../../stores/useUserStore";
import coupleStore from "../../stores/useCoupleStore";
import LeftWindow from "./LeftWindow";
import RightWindow from "./RightWindow";

function STTGPT() {
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

    // 이승준이 수정한 변수 0:채팅, 1:클립, 2:대본
    rightWindow: 0,
    scriptHistory: [],

    init: false,

    meetingId: null,

    isModalOpen: true,
  });

  // 이승준이 수정한 함수
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log("speech recog success");
      console.log(result);

      var script = makeScriptAndSend(result);

      setMeetingInfo((prevMeetingInfo) => {
        console.log("setMeetingInfo in speech");

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

        useGPT(newMeetingInfo, script);

        return newMeetingInfo;
      });
    },
  });

  // 이승준이 추가한 함수
  function makeScriptAndSend(result) {
    var script = {
      message: result,
      isLocal: 1, // 0이면 자신 1이면 상대방 2이면 gpt
      time: new Date(),
    };
    sendMessage(
      JSON.stringify({
        cmd: "script",
        data: script,
      })
    );
    script.isLocal = 0;

    return script;
  }
  // 이승준이 추가한 함수
  function useGPT(newMeetingInfo, script) {
    newMeetingInfo.scriptHistory.push(script);

    // 한 번의 대화가 완성 됐다면 gpt 이용 조건 완료
    if (
      newMeetingInfo.scriptHistory.length == 2 &&
      newMeetingInfo.scriptHistory[newMeetingInfo.scriptHistory.length - 2].isLocal == 1
    ) {
      console.log("use gpt");
      const lastIndex = newMeetingInfo.scriptHistory.length;

      const messages = [
        {
          role: "system",
          content:
            "You are a helpful assistant who suggests interesting topics between a couple to excites their relationship. \n" +
            "And the the topics you answer have to be short like only 1 sentence. \n" +
            "You also have to return `true` if you have some interesting topics about this conversation or `false` if it's not.\n" +
            "You also have to return whether the conversation that you've got is worth to save or not by returning `true` if it's worth to save or `false` if it's not.\n" +
            "You must answer in Korean. \n" +
            "So you have to follow the answer template like below. \n" +
            "```\n" +
            "true or false depends on if it's worth to save\n" +
            "true or false depends on if you have interesting topics\n" +
            "1 sentence of interesting topics about the conversation that you've got.\n" +
            "```\n" +
            "So the answer must be only 2 lines of true or false and 1 sentence.\n" +
            "You must answer in Korean.",
        },
        {
          role: "user",
          content:
            // `A : ${newMeetingInfo.scriptHistory[newMeetingInfo.scriptHistory.length - 2].message}. \n` +
            // `B : ${script.message}.` },
            `A : 저녁 뭐 먹을까?. \n` + `B : 글쎄 좀 새로운거 없나? 한 번 생각해보자.`,
        },
      ];
      console.log(messages);

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", // HTTP 메소드를 POST로 설정
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_APP_GPT_API_KEY}`, // API 키를 포함한 인증 헤더
          "Content-Type": "application/json", // 콘텐츠 타입을 application/json으로 지정
        },
        body: JSON.stringify({
          // 요청 바디에 JSON 데이터를 문자열로 변환하여 전달
          model: "gpt-3.5-turbo",
          temperature: 0.5,
          n: 1,
          messages: messages,
        }),
      })
        .then((response) => response.json()) // 응답을 JSON으로 변환
        .then((data) => {
          console.log(data);
          const output = data.choices[0].message.content.split("\n");
          console.log(output);
          output[0] = JSON.parse(output[0]);
          console.log(output[0]);
          if (output[0] == true) {
            // 클립 저장 로직 구현
          }
          output[1] = JSON.parse(output[1]);
          console.log(output[1]);
          if (output[1] == true) {
            // gpt 제안문 대본에 추가하는 기능 구현
            setMeetingInfo((prevMeetingInfo) => {
              console.log("gpt 대본 추가");
              const newMeetingInfo = { ...prevMeetingInfo };
              var gptScript = {
                message: output[2],
                isLocal: 2,
                time: new Date(),
                lastIndex: lastIndex,
              };
              sendMessage(
                JSON.stringify({
                  cmd: "gptScript",
                  data: gptScript,
                })
              );
              newMeetingInfo.scriptHistory.splice(lastIndex, 0, gptScript);
              return newMeetingInfo;
            });
          }
        })
        .catch((error) => {
          console.error(error); // 오류 처리
        });
    }
  }

  const readyCam = useRef();

  const chattingWindow = useRef();

  const localCam = useRef();

  const remoteCam = useRef();

  const camContainer = useRef();

  const localCamContainer = useRef();

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
      localCam.current.volume = 0;
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
    const conn = new WebSocket(`${import.meta.env.VITE_APP_SOCKET_URL}`);

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

  // 이승준이 수정한 코드
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

        case "send new clip":
          handleNewClip(msg.data);
          break;

        // 이승준이 추가한 코드
        case "script":
          setMeetingInfo((prevMeetingInfo) => {
            console.log("got script");
            const newMeetingInfo = { ...prevMeetingInfo };
            newMeetingInfo.scriptHistory.push(msg.data);
            return newMeetingInfo;
          });
          break;

        // 이승준이 추가한 코드
        case "gptScript":
          setMeetingInfo((prevMeetingInfo) => {
            console.log("got gptScript");
            const newMeetingInfo = { ...prevMeetingInfo };
            newMeetingInfo.scriptHistory.splice(msg.data.lastIndex, 0, msg.data);
            return newMeetingInfo;
          });
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

  const handleAccess = function (meetingId) {
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.connect.offerReady = true;
      newMeetingInfo.meetingId = meetingId;
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
          mimeType: "video/webm; codecs=vp9,opus",
        });
        if (meetingInfo.connect.peerConnection.connectionState === "connected") {
          meetingInfo.record.mediaRecorder[idx][0].start(1000);
        }

        setMeetingInfo((prevMeetingInfo) => {
          const newMeetingInfo = { ...prevMeetingInfo };
          newMeetingInfo.record.tmpRecord[user1 === userId ? 0 : 1] = blob;

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
          mimeType: "video/webm; codecs=vp9,opus",
        });
        if (meetingInfo.connect.peerConnection.connectionState === "connected") {
          meetingInfo.record.mediaRecorder[idx][1].start(1000);
        }
        setMeetingInfo((prevMeetingInfo) => {
          const newMeetingInfo = { ...prevMeetingInfo };
          newMeetingInfo.record.tmpRecord[user1 === userId ? 1 : 0] = blob;

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

  function handleNewClip(message) {
    const blob = message;
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.clipHistory.push(blob);
      return newMeetingInfo;
    });
  }

  if (!meetingInfo.init) {
    // getLocalMediaStream();
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
    if (meetingInfo.chattingHistory.length) {
      chattingWindow.current.childNodes[meetingInfo.chattingHistory.length - 1].scrollIntoView({
        block: "end",
      });
    }
  }, [meetingInfo.chattingHistory.length]);

  useEffect(() => {
    updateLocalVideo(meetingInfo.video.local.videoOn, meetingInfo.video.local.volume);
  }, [meetingInfo.isModalOpen]);

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
    <div className="grid grid-cols-12 gap-5 h-full">
      <div className="col-span-12 mx-5 h-screen">
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
      </div>
    </div>
  );
}

export default STTGPT;
