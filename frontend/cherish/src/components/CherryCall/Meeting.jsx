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
import instruction from "./GPT/systemScript";

let record = [];
let recordOption = {
  mimeType: "video/webm; codecs=vp9,opus",
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 2500000,
};
let firstSpeak = true;
let lastTime = null;
let meetingId2 = null;

function Meeting() {
  const { kakaoId, nickname, userId } = userStore((state) => state);
  const { user1, user2, coupleId, userInfos } = coupleStore();

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

    connect: {
      conn: null,
      peerConnection: null,
      dataChannel: null,
      offerState: 0,
      prevOfferState: 0,
    },

    chattingHistory: [],

    clipHistory: [],

    // 0:채팅, 1:클립, 2:대본
    rightWindow: 0,
    // 대본 저장 배열
    scriptHistory: [],
    // 말풍선과 반짝임 효과
    showMessage: false,
    showMessageContent: "",

    // 반짝임 효과
    clipReceived: false,

    init: false,

    meetingId: null,

    isModalOpen: true,
  });
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);

      // 말한 내용을 script 객체로 생성
      const script = makeScriptAndSend(result);

      // 키워드가 인식되면 저장 그렇지 않다면 단순히 녹화만 재시작
      const keyword = getKeyword(result);
      if (keyword !== null) {
        recordStopAndStart(meetingInfo, true, script, keyword);
      } else recordStopAndStart(meetingInfo, false);

      // const nowTime = new Date();
      // if (lastTime == null || nowTime-lastTime > 20000) {
      //   lastTime = nowTime;
      //   useGPT(script);
      // }
      useGPT(script);
    },
  });
  function getKeyword(result) {
    if (
      result.includes("안녕") ||
      result.includes("반가워") ||
      result.includes("잘자") ||
      result.includes("하이") ||
      result.includes("바이") ||
      result.includes("오하요")
    )
      return "인사";
    else if (
      result.includes("멋있") ||
      result.includes("예쁘") ||
      result.includes("예뻐") ||
      result.includes("잘했") ||
      result.includes("최고") ||
      result.includes("대박") ||
      result.includes("잘생겼") ||
      result.includes("귀엽") ||
    )
      return "칭찬";
    else if (
      result.includes("고마워") ||
      result.includes("사랑해") ||
      result.includes("좋아해") ||
      result.includes("귀여워") ||
      result.includes("보고싶어") ||
      result.includes("심쿵") ||
      result.includes("자기야") ||
      result.includes("여보") ||
      result.includes("애기야")
    )
      return "애정표현";
    else if (
      result.includes("잘하고있어") ||
      result.includes("화이팅") ||
      result.includes("파이팅") ||
      result.includes("힘내") ||
      result.includes("기운내") ||
      result.includes("응원할게")
    )
      return "응원";

    return null;
  }

  // 스크립트 생성 후 전송
  function makeScriptAndSend(result) {
    // 스크립트 생성 후 상대방에게 전송
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
  // gpt 사용
  function useGPT(script) {
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      const scriptHistory = newMeetingInfo.scriptHistory;
      scriptHistory.push(script);

      // 본인이 한 말 직전에 상대방이 한 말일 경우에만 작동
      let partnerScript =
        scriptHistory.length >= 2 &&
        scriptHistory[scriptHistory.length - 2].isLocal == 1
          ? scriptHistory[scriptHistory.length - 2]
          : null;
      if (partnerScript !== null) {
        console.log("use gpt");

        const myIndex = userId == userInfos[0].id ? 0 : 1;
        const partnerIndex = userId == userInfos[0].id ? 1 : 0;

        const messages = [
          {
            role: "system",
            content: instruction,
          },
          {
            role: "user",
            content:
              `${userInfos[partnerIndex].nickname} : ${partnerScript.message}. \n` +
              `${userInfos[myIndex].nickname} : ${script.message}.`,
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
            console.log("gpt return");
            console.log(data);

            // gpt를 이용한 영상저장이 필요없으므로 주석처리
            // const output = data.choices[0].message.content.split("\n");
            // output[0] = output[0].split(":");
            // output[1] = output[1].split(":");

            const output = data.choices[0].message.content.split(":");

            console.log(output);

            // gpt를 이용한 영상저장이 필요없으므로 주석처리
            // recordStopAndStart(
            //   newMeetingInfo,
            //   JSON.parse(output[0][0]),
            //   partnerScript,
            //   output[0][1]
            // );

            // gpt를 이용한 영상저장이 필요하다면 output[0]을 output[1][0]로 변경 필요
            if (JSON.parse(output[0]) == true) {
              // gpt 제안문 대본에 추가하는 기능 구현
              setMeetingInfo((prevMeetingInfo) => {
                const newMeetingInfo2 = { ...prevMeetingInfo };
                console.log("gpt 대본 추가");
                var gptScript = {
                  message: output[1],
                  isLocal: 2,
                  time: new Date(),
                  lastIndex: scriptHistory.length,
                };
                playGPTScript(gptScript);
                setMeetingInfo((prevMeetingInfo) => {
                  const newMeetingInfo = { ...prevMeetingInfo };
                  newMeetingInfo.showMessage = true;
                  return newMeetingInfo;
                });
                setTimeout(() => {
                  setMeetingInfo((prevMeetingInfo) => {
                    const newMeetingInfo = { ...prevMeetingInfo };
                    newMeetingInfo.showMessage = false;
                    return newMeetingInfo;
                  });
                }, 3000);

                sendMessage(
                  JSON.stringify({
                    cmd: "gptScript",
                    data: gptScript,
                  })
                );
                newMeetingInfo2.scriptHistory.splice(
                  scriptHistory.length,
                  0,
                  gptScript
                );
                return newMeetingInfo2;
              });
            }
          })
          .catch((error) => {
            console.error(error); // 오류 확인
            recordStopAndStart(newMeetingInfo, false);
          });
      }
      // gpt를 이용한 영상저장이 필요없으므로 주석처리
      // else recordStopAndStart(newMeetingInfo, false);

      return newMeetingInfo;
    });
  }
  // TTS
  function playGPTScript(gptScript) {
    return;
    fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_APP_GPT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: gptScript.message,
        voice: "nova",
      }),
    })
      .then((response) => response.blob()) // 응답을 Blob 객체로 변환
      .then((blob) => {
        const url = URL.createObjectURL(blob); // Blob 객체로부터 URL 생성
        const audio = new Audio(url); // URL을 사용하여 오디오 객체 생성
        audio.addEventListener("ended", function () {
          setMeetingInfo((prevMeetingInfo) => {
            const newMeetingInfo = { ...prevMeetingInfo };
            newMeetingInfo.showMessage = false;
            newMeetingInfo.showMessageContent = "";
            return newMeetingInfo;
          });
        });
        audio.volume = 0; // 0에서 1사이 설정가능
        audio.play(); // 오디오 재생
        setMeetingInfo((prevMeetingInfo) => {
          const newMeetingInfo = { ...prevMeetingInfo };
          newMeetingInfo.showMessage = true;
          newMeetingInfo.showMessageContent = gptScript.message;
          return newMeetingInfo;
        });
      })
      .catch((error) => console.error("오류 발생:", error));
  }
  //////

  const readyCam = useRef();

  const chattingWindow = useRef();

  const clipWindow = useRef();

  const scriptWindow = useRef();

  const localCam = useRef();

  const remoteCam = useRef();

  const camContainer = useRef();

  const localCamContainer = useRef();

  //////
  const getLocalMediaStream = function () {
    const constraints = {
      video: {
        frameRate: 24,
        width: 320,
        height: 320,
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
      if (
        meetingInfo.video.local.videoOn !== on ||
        !readyCam.current.srcObject
      ) {
        readyCam.current.srcObject = on
          ? meetingInfo.stream.localMediaStream
          : new MediaStream();
      }
      readyCam.current.volume = volume;
      localCam.current.volume = 0;
    } else {
      if (
        meetingInfo.video.local.videoOn !== on ||
        !localCam?.current.srcObject
      ) {
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

  const updateRemoteVideo = function (on, volume, volumeFactor, force) {
    if (remoteCam.current) {
      if (meetingInfo.video.remote.videoOn !== on || force) {
        remoteCam.current.srcObject = on
          ? meetingInfo.stream.remoteMediaStream
          : new MediaStream();
      }
      if (
        meetingInfo.video.remote.volume != volume ||
        meetingInfo.video.remote.volumeFactor != volumeFactor ||
        force
      ) {
        remoteCam.current.volume = volume * volumeFactor;
      }
    }

    console.log("remoteCam.current.volume : ", remoteCam.current.volume);

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
      var content = JSON.parse(msg.data);
      var data = content.data;
      switch (content.event) {
        // when somebody wants to call us
        case "access":
          console.log(data.meetingId);
          handleAccess(data.meetingId);
          break;
        case "request loading":
          console.log("get request loading");
          handleRequestLoading();
          break;

        case "response loading":
          console.log("get response loading");
          handleResponseLoading();
          break;

        case "offer":
          handleOffer(data);
          break;
        case "answer":
          handleAnswer(data);
          break;

        case "request prev state":
          console.log("get request prev state");
          handleRequestPrevState();
          break;

        // when a remote peer sends an ice candidate to us
        case "candidate":
          handleCandidate(data);
          break;

        case "getClipURL":
          handleNewClip(data);
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
        // {
        // 	url: "stun:stun2.1.google.com:19302",
        // },
        // { url: "stun:stun.l.google.com:19302" },
        { url: "stun:13.124.129.79:3478" },
        {
          urls: "turn:13.124.129.79?transport=tcp",
          credential: "1234",
          username: "cherish",
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

    peerConnection.oniceconnectionstatechange = function (event) {
      console.log("oniceconnectionstatechange");
      console.log(event);
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
          updateRemoteVideo(
            msg.data.videoOn,
            msg.data.volume,
            meetingInfo.video.remote.volumeFactor,
            true
          );
          break;

        case "send chatting massage":
          handleRemoteChatting(msg.data);
          break;

        // 상대방으로 부터 멘트를 받았을때 자신의 대본배열에 상대방의 멘트를 추가
        case "script":
          msg.data.time = new Date(msg.data.time);
          setMeetingInfo((prevMeetingInfo) => {
            console.log("got script");
            const newMeetingInfo = { ...prevMeetingInfo };
            newMeetingInfo.scriptHistory.push(msg.data);
            return newMeetingInfo;
          });
          break;

        // GPT의 멘트를 받았을 때 그 멘트를 생성시킨 대화바로 뒤에 GPT의 멘트를 추가
        case "gptScript":
          msg.data.time = new Date(msg.data.time);
          playGPTScript(msg.data);
          setMeetingInfo((prevMeetingInfo) => {
            console.log("got gptScript");
            const newMeetingInfo = { ...prevMeetingInfo };
            newMeetingInfo.scriptHistory.splice(
              msg.data.lastIndex,
              0,
              msg.data
            );
            newMeetingInfo.showMessage = true;
            return newMeetingInfo;
          });
          setTimeout(() => {
            setMeetingInfo((prevMeetingInfo) => {
              const newMeetingInfo = { ...prevMeetingInfo };
              newMeetingInfo.showMessage = false;
              return newMeetingInfo;
            });
          }, 3000);
          break;

        default:
          break;
      }
    };

    dataChannel.onclose = function () {
      updateRemoteVideo(false, 0, 0, true);
      stop();
      peerConnection.close();
      console.log("data channel is closed");
      setMeetingInfo((prevMeetingInfo) => {
        const newMeetingInfo = { ...prevMeetingInfo };

        newMeetingInfo.stream.remoteMediaStream.getTracks().forEach((track) => {
          newMeetingInfo.stream.remoteMediaStream.removeTrack(track);
        });

        newMeetingInfo.video.remote.videoOn = false;
        newMeetingInfo.video.remote.volume = 0;

        newMeetingInfo.connect.prevOfferState = 0;
        newMeetingInfo.connect.offerState = 0;
        return newMeetingInfo;
      });

      initialize();
      meetingInfo.record = [];
    };

    peerConnection.ondatachannel = function (event) {
      console.log("ondatachannel");
      meetingInfo.connect.dataChannel = event.channel;

      // changePeerConnectionConnected(peerConnection.connectionState === 'connected');
    };

    peerConnection.ontrack = function (event) {
      console.log("ontrack");
      meetingInfo.stream.remoteMediaStream.addTrack(event.track);

      if (meetingInfo.stream.remoteMediaStream.getTracks().length === 2) {
        console.log("ontrack record start");
        updateLocalVideo(
          meetingInfo.video.local.videoOn,
          meetingInfo.video.local.volume,
          1
        );
        recordStopAndStart(meetingInfo, false);
        setMeetingInfo((prevMeetingInfo) => {
          const newMeetingInfo = { ...prevMeetingInfo };
          newMeetingInfo.connect.prevOfferState =
            prevMeetingInfo.connect.offerState;
          newMeetingInfo.connect.offerState = 3;
          return newMeetingInfo;
        });
      }

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
    console.log("createOffer");
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
      newMeetingInfo.connect.prevOfferState =
        prevMeetingInfo.connect.offerState;
      newMeetingInfo.connect.offerState = 2;
      return newMeetingInfo;
    });
  };

  const handleAccess = function (mId) {
    console.log("handleAccess");
    meetingId2 = mId;
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.connect.prevOfferState =
        prevMeetingInfo.connect.offerState;
      newMeetingInfo.connect.offerState = 1;
      newMeetingInfo.meetingId = mId;
      return newMeetingInfo;
    });
  };

  const handleRequestLoading = function () {
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.connect.prevOfferState =
        prevMeetingInfo.connect.offerState;
      newMeetingInfo.connect.offerState = 2;
      return newMeetingInfo;
    });
    send({
      event: "response loading",
    });
  };

  const handleResponseLoading = function () {
    createOffer();
  };

  const handleOffer = function (offer) {
    console.log("handleOffer");
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
    console.log("handleAnswer");
    meetingInfo.connect.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    send({
      event: "request prev state",
    });
  };

  const handleRequestPrevState = function () {
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      if (prevMeetingInfo.connect.offerState !== 3) {
        newMeetingInfo.connect.offerState =
          prevMeetingInfo.connect.prevOfferState;
      }
      return newMeetingInfo;
    });
  };

  const handleCandidate = function (candidate) {
    console.log("handleCandidate");
    meetingInfo.connect.peerConnection.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  };

  const send = function (message) {
    meetingInfo.connect.conn.send(JSON.stringify(message));
  };

  const sendMessage = function (msg) {
    if (meetingInfo.connect.dataChannel.readyState == "open")
      meetingInfo.connect.dataChannel.send(msg);
  };

  let intervalId = null;
  // 처음 시작할 때와 자신의 발언이 끝날때마다 녹화를 다시 시작
  // 이전 대화가 저장할만 하다면 저장 작업도 수행
  function recordStopAndStart(newMeetingInfo, save, script, keyword) {
    if (record.length > 0) {
      if (save == true) saveAndSendClip(newMeetingInfo, script, keyword);

      // 모든 녹화 중지
      for (let i = 0; i < record.length; i++) {
        record[i].mediaRecorder[0].stop();
        record[i].mediaRecorder[1].stop();
      }
      clearInterval(intervalId);
    }

    // record 초기화
    record = [];

    // 녹화 시작과 일정 주기마다 녹화 추가 생성
    // 주기 5초로 조정 렉 너무 걸림
    newRecordPushAndRemove();
    intervalId = setInterval(newRecordPushAndRemove, 5000);
  }
  // 클립 저장 후 전송
  function saveAndSendClip(newMeetingInfo, script, keyword) {
    // 저장할 대화의 소요시간을 대략적으로 계산
    // 문자 3개당 1초가 소요된다고 가정 (조정 가능)
    // 미리초 단위
    const talkLength = (script.message.length / 3) * 1000;

    // 가장 일찍 녹화를 시작한 시점 즉 이전에 내가 말했던 시점부터
    // 내가 현재 말한 시점까지 가장 대화길이에 알맞는 구간을 선택
    for (let i = 0; i < record.length; i++) {
      if (
        i == record.length - 1 ||
        script.time - record[i + 1].startTime < talkLength
      ) {
        const selectedRecord = record[i];
        // 선택된 녹화본은 바로 멈추지 말고 일정시간 이후에 멈추기 위해
        // 배열에서 제거 시킨 뒤 일정시간뒤에 따로 녹화를 중시 시킨다.
        record.splice(i, 1);

        setTimeout(() => {
          const blobLocal = new Blob(selectedRecord.recordedChunks[0], {
            mimeType: recordOption.mimeType,
          });
          const blobRemote = new Blob(selectedRecord.recordedChunks[1], {
            mimeType: recordOption.mimeType,
          });

          let formData = new FormData();
          formData.set("meeting_id", newMeetingInfo.meetingId);
          formData.set("keyword", keyword);
          formData.set("couple_id", coupleId);
          formData.set(
            "clip1",
            user1 === userId ? blobLocal : blobRemote,
            "clip1.webm"
          );
          formData.set(
            "clip2",
            user1 === userId ? blobRemote : blobLocal,
            "clip2.webm"
          );
          console.log(formData);

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

          selectedRecord.mediaRecorder[0].stop();
          selectedRecord.mediaRecorder[1].stop();
        }, 3000);

        break;
      }
    }
  }
  // 녹화 추가 밎 제거
  function newRecordPushAndRemove() {
    if (meetingInfo.connect.peerConnection.connectionState !== "connected")
      return;

    // 10초 * 3 즉 30초 까지의 영상만 저장 (길이 조정 가능)
    if (record.length >= 3) {
      record[0].mediaRecorder[0].stop();
      record[0].mediaRecorder[1].stop();
      record.shift();
    }
    console.log("record size : " + record.length);

    record.push(makeNewRecord());

    // 청크 추가
    const last = record.length - 1;
    const chunks = record[last].recordedChunks;
    record[last].mediaRecorder[0].ondataavailable = function (event) {
      if (event.data.size > 0) chunks[0].push(event.data);
    };
    record[last].mediaRecorder[1].ondataavailable = function (event) {
      if (event.data.size > 0) chunks[1].push(event.data);
    };
  }
  // 새로운 record 생성
  function makeNewRecord() {
    const local = new MediaRecorder(
      meetingInfo.stream.localMediaStream,
      recordOption
    );
    const remote = new MediaRecorder(
      meetingInfo.stream.remoteMediaStream,
      recordOption
    );
    local.start(500);
    remote.start(500);

    return {
      mediaRecorder: [local, remote],

      recordedChunks: [[], []],

      startTime: new Date(),
    };
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
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.clipHistory.push(message);
      newMeetingInfo.clipReceived = true;
      return newMeetingInfo;
    });
    setTimeout(() => {
      setMeetingInfo((prevMeetingInfo) => {
        const newMeetingInfo = { ...prevMeetingInfo };
        newMeetingInfo.clipReceived = false;
        return newMeetingInfo;
      });
    }, 3000);
  }

  //////

  console.log(meetingInfo);

  if (!meetingInfo.init) {
    getLocalMediaStream();
    setMeetingInfo((prevMeetingInfo) => {
      const newMeetingInfo = { ...prevMeetingInfo };
      newMeetingInfo.init = true;
      return newMeetingInfo;
    });
  }

  useEffect(() => {
    if (meetingInfo.chattingHistory.length && meetingInfo.rightWindow === 0) {
      chattingWindow.current.childNodes[
        meetingInfo.chattingHistory.length - 1
      ].scrollIntoView({
        block: "end",
      });
    }
  }, [meetingInfo.chattingHistory.length, meetingInfo.rightWindow]);

  useEffect(() => {
    if (meetingInfo.clipHistory.length && meetingInfo.rightWindow === 1) {
      clipWindow.current.childNodes[
        meetingInfo.clipHistory.length - 1
      ].scrollIntoView({
        block: "end",
      });
    }
  }, [meetingInfo.clipHistory.length, meetingInfo.rightWindow]);

  useEffect(() => {
    if (meetingInfo.scriptHistory.length && meetingInfo.rightWindow === 2) {
      scriptWindow.current.childNodes[
        meetingInfo.scriptHistory.length - 1
      ].scrollIntoView({
        block: "end",
      });
    }
  }, [meetingInfo.scriptHistory.length, meetingInfo.rightWindow]);

  useEffect(() => {
    return () => {
      console.log("Leave");
      meetingInfo?.connect?.dataChannel?.close();
      setMeetingInfo((prevMeetingInfo) => {
        const newMeetingInfo = { ...prevMeetingInfo };
        newMeetingInfo.init = false;
        return newMeetingInfo;
      });

      meetingInfo.stream.localMediaStream.getTracks().forEach((track) => {
        track.stop();
        meetingInfo.stream.localMediaStream.removeTrack(track);
      });

      stop();

      meetingInfo?.connect?.dataChannel?.close();
      meetingInfo?.connect?.peerConnection?.close();
      meetingInfo?.connect?.conn?.close();

      console.log("meetingId2 : " + meetingId2);
      // 유저 한 명만 종료됐음을 전송
      if (meetingId2 !== null && user1 === userId) {
        console.log("미팅 종료 알림");
        fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/meeting/${meetingId2}`, {
          method: "PUT",
          headers: {
            Accept: "*/*",
          },
        })
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  }, []);

  window.onbeforeunload = (event) => {
    event.preventDefault();
    console.log("unload", event);
  };

  return (
    <div className="h-full w-full flex flex-row contents-center">
      <div className="w-9/12 flex flex-col justify-center">
        <LeftWindow
          meetingInfo={meetingInfo}
          send={send}
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
          stop={stop}
        />
      </div>
      <div className="w-3/12 flex flex-col justify-center mr-5">
        <RightWindow
          meetingInfo={meetingInfo}
          setMeetingInfo={setMeetingInfo}
          chattingWindow={chattingWindow}
          clipWindow={clipWindow}
          scriptWindow={scriptWindow}
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
