import { useEffect, useRef, useState } from "react";
import ModalForSave from "../Common/ModalForSave";
import StartRecord from "../../assets/VideoIcon/StartRecord.svg";
import StopRecord from "../../assets/VideoIcon/StopRecord.svg";
import useCoupleStore from "../../stores/useCoupleStore";
import useUserStore from "../../stores/useUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postVideoSave } from "../../services/QuestionService";

const constraints = {
  audio: {
    echoCancellation: { exact: true },
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

export default function TodayRecoding({
  handleIsRecording,
  handleClickIsQuestionBoxOpen,
  handleIsAnswered,
}) {
  const [mediaStream, setMediaStream] = useState(null);
  const [recordedBlob, setRecordedblob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const videoOutput = useRef(null);
  const recodeOutput = useRef(null);
  const { question, coupleId } = useCoupleStore();
  const { kakaoId, nickname } = useUserStore();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: postVideoSave,
    onSuccess: (data) => {
      // 뮤테이션이 성공한 후 실행할 작업
      alert("저장했습니다! 상대방의 답변을 기다려주세요!");
      closeModal();
      queryClient.invalidateQueries(["ansList", coupleId]);
      handleClickIsQuestionBoxOpen();
      handleIsAnswered();
    },
    onError: (error) => {
      alert("저장에 실패했어요. 다시 시도해주실래요?");
    },
  });

  async function getMedia() {
    //
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setMediaStream(stream);
    console.log(mediaStream);
    videoOutput.current.srcObject = stream;
    videoOutput.current.onloadedmetadata = () => {
      // HTMLVideoElement로 카메라의 화면을 출력하기 시작
      videoOutput.current.play();
    };
  }

  // 녹화 시작 버튼 클릭 시 빌생하는 이벤트 핸들러 등록
  const startRecoding = () => {
    setIsRecording((pre) => true);
    let mediaData = [];

    // 1.MediaStream을 매개변수로 MediaRecorder 생성자를 호출
    mediaRecorder.current = new MediaRecorder(mediaStream, {
      mimeType: "video/webm; codecs=vp9, opus",
    });

    // 2. 전달받는 데이터를 처리하는 이벤트 핸들러 등록
    mediaRecorder.current.ondataavailable = function (event) {
      if (event.data && event.data.size > 0) {
        mediaData.push(event.data);
        console.log(mediaData);
      }
    };
    // 3. 녹화 중지 이벤트 핸들러 등록
    mediaRecorder.current.onstop = function () {
      const blob = new Blob(mediaData, { type: "video/webm" });
      const url = window.URL.createObjectURL(blob);
      setRecordedblob((pre) => blob);
      recodeOutput.current.src = url;
      recodeOutput.current.load();
      recodeOutput.current.oncanplaythrough = function () {
        // 로드 완료되면 실행
        recodeOutput.current.play();
      };
      recodeOutput.current.onended = function () {
        // 비디오 재생이 끝났을 때 URL 해제
        window.URL.revokeObjectURL(url);
      };
    };

    // 4. 녹화 시작
    mediaRecorder.current.start();
  };

  const stopRecoding = () => {
    setIsRecording((pre) => false);
    if (mediaRecorder.current) {
      // 5. 녹화 중지
      mediaRecorder.current.stop();
      mediaRecorder.current = null;
      setModalOpen((pre) => true);
    }
  };

  const closeModal = () => {
    setModalOpen((pre) => false);
  };

  const videoSave = () => {
    if (confirm("영상을 저장할까요?")) {
      const answerDto = {
        kakaoId,
        questionId: question.id,
        coupleId,
        nickname,
      };

      const formData = new FormData();
      formData.set("answerDto", JSON.stringify(answerDto));
      formData.set("answer", recordedBlob, "video.webm");
      mutate(formData);
    }
  };

  useEffect(() => {
    if (!mediaStream) {
      getMedia();
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  return (
    <>
      <div className="w-[35vw] mt-[2vw] flex flex-col items-center justify-center">
        <video
          className="rounded-t-[15px] w-full h-full skeleton"
          ref={videoOutput}
          id="video-output"
          autoPlay
          playsInline
        ></video>
        <div className="bg-pink rounded-b-[15px] shadow-md text-center py-[0.5vw] w-full">
          {isRecording ? (
            <button
              onClick={() => {
                handleIsRecording();
                stopRecoding();
              }}
              id="finish-btn"
            >
              <img src={StopRecord} alt="StopRecord" />
            </button>
          ) : (
            <button
              onClick={() => {
                handleIsRecording();
                startRecoding();
              }}
              id="start-btn"
            >
              <img src={StartRecord} alt="StartRecord" />
            </button>
          )}
        </div>
      </div>
      {modalOpen && (
        <ModalForSave
          closeModalfun={closeModal}
          modalcss="w-[40vw] h-[30vw] rounded-[20px] bg-pink"
        >
          <div className="flex flex-col items-center">
            <div className="bg-white w-[30vw] h-[4vw] text-center leading-[4vw] text-[1vw] rounded-[35px] mt-[2vw]">
              오늘의 질문란
            </div>
            <div className="w-[30vw] mt-[1.5vw]">
              <video
                ref={recodeOutput}
                preload="metadata"
                playsInline
                controls
                width="100%"
                height="100%"
                className="rounded-[20px]"
              ></video>
            </div>
            <div className="w-[13vw] flex flex-row justify-between mt-[1vw]">
              <button
                onClick={closeModal}
                className="w-[4vw] h-[2vw] bg-white border-[3px] border-cherry text-cherry rounded-[5px]"
              >
                취소
              </button>
              <button
                onClick={videoSave}
                className="w-[4vw] h-[2vw] bg-cherry border-[3px] border-cherry text-white rounded-[5px]"
              >
                저장
              </button>
            </div>
          </div>
        </ModalForSave>
      )}
    </>
  );
}
