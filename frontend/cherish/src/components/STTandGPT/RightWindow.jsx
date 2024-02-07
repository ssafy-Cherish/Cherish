// 이승준이 수정한 파일

import ChattingBox from "./ChattingBox";
import ClipBox from "./ClipBox";

// 이승준이 추가한 코드
import ScriptBox from "./ScriptBox";

function RightWindow({
  meetingInfo,
  setMeetingInfo,
  chattingWindow,
  sendMessage,
  kakaoId,
  nickname,
  sendImg,
}) {

  // 이승준이 추가한 코드
  function rightWindow() {
    switch (meetingInfo.rightWindow) {
      case 0: // 채팅
        return (
          <ChattingBox
            meetingInfo={meetingInfo}
            setMeetingInfo={setMeetingInfo}
            chattingWindow={chattingWindow}
            sendMessage={sendMessage}
            kakaoId={kakaoId}
            nickname={nickname}
            sendImg={sendImg}
          />
        );

      case 1: // 클립
        return (
          <ClipBox meetingInfo={meetingInfo} />
        );

      case 2: // 대본
        return (
          <ScriptBox
            meetingInfo={meetingInfo}
          />
        );
    }
  }

  return (
    <div className="bg-pink h-[75%] m-2 rounded-2xl flex flex-col justify-evenly">
      <div className="bg-white mx-4 rounded-t-2xl h-[10%]">
        {/* {이승준이 수정한 코드} */}
        <button
          className="w-[50%] h-full font-extrabold text-xl"
          disabled={meetingInfo.rightWindow == 0}
          onClick={() => {
            setMeetingInfo((prevMeetingInfo) => {
              const newMeetingInfo = { ...prevMeetingInfo };
              newMeetingInfo.rightWindow = 0;
              return newMeetingInfo;
            });
          }}
        >
          체리톡
        </button>
        {/* {이승준이 수정한 코드} */}
        <button
          className="w-[50%] h-full font-extrabold text-xl"
          disabled={meetingInfo.rightWindow == 1}
          onClick={() => {
            setMeetingInfo((prevMeetingInfo) => {
              const newMeetingInfo = { ...prevMeetingInfo };
              newMeetingInfo.rightWindow = 1;
              return newMeetingInfo;
            });
          }}
        >
          클립
        </button>
        {/* {이승준이 추가한 코드} */}
        <button
          className="w-[33%] h-full font-extrabold text-xl"
          disabled={meetingInfo.rightWindow == 2}
          onClick={() => {
            setMeetingInfo((prevMeetingInfo) => {
              const newMeetingInfo = { ...prevMeetingInfo };
              newMeetingInfo.rightWindow = 2;
              return newMeetingInfo;
            });
          }}
        >
          대본
        </button>
      </div>
      {/* {이승준이 수정한 코드} */}
      {rightWindow()}
    </div>
  );
}

export default RightWindow;
