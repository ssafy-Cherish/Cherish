import ChattingBox from "./ChattingBox";
import ClipBox from "./ClipBox";

// 대본 박스 추가
import ScriptBox from "./GPT/ScriptBox";
import "./Meeting.css";

function RightWindow({
  meetingInfo,
  setMeetingInfo,
  chattingWindow,
  sendMessage,
  kakaoId,
  nickname,
  sendImg,
  clipWindow,
  scriptWindow
}) {
  // 항목이 3개가 되었기 때문에 switch 문으로 변경
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
        return <ClipBox meetingInfo={meetingInfo} clipWindow={clipWindow}/>;

      case 2: // 대본
        return <ScriptBox meetingInfo={meetingInfo} scriptWindow={scriptWindow}/>;
    }
  }

  return (
    <div className="bg-pink h-[75%] m-2 rounded-2xl flex flex-col justify-evenly relative">
      <div className="bg-white mx-4 rounded-t-2xl h-[10%]">
        <button
          className={`w-[33%] h-full font-extrabold text-xl ${
            meetingInfo.rightWindow == 0 ? "text-cherry" : ""
          }`}
          disabled={meetingInfo.rightWindow == 0}
          onClick={() => {
            setMeetingInfo((prevMeetingInfo) => {
              const newMeetingInfo = { ...prevMeetingInfo };
              newMeetingInfo.rightWindow = 0;
              return newMeetingInfo;
            });
          }}
        >
          채팅
        </button>
        <button
          className={`w-[33%] h-full font-extrabold text-xl ${
            meetingInfo.rightWindow == 1 ? "text-cherry" : ""
          }  ${meetingInfo.clipReceived && "blink-effect"}`}
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
        {/* 대본 기능 추가 */}
        <button
          className={`w-[33%] h-full font-extrabold text-xl ${
            meetingInfo.rightWindow == 2 ? "text-cherry" : ""
          } ${meetingInfo.showMessage && "blink-effect"}`}
          disabled={meetingInfo.rightWindow == 2}
          onClick={() => {
            setMeetingInfo((prevMeetingInfo) => {
              const newMeetingInfo = { ...prevMeetingInfo };
              newMeetingInfo.rightWindow = 2;
              return newMeetingInfo;
            });
          }}
        >
          체리톡
        </button>
        {/* {meetingInfo.showMessage && (
          <div className="absolute bottom-full right-12 translate-y-10">
            <div
              style={{
                backgroundColor: "#fcdeeb",
                whiteSpace: "pre-line",
                wordWrap: "break-word",
              }}
              className="py-2 pl-4 pr-4 rounded-t-xl rounded-bl-xl drop-shadow max-w-[90%]"
            >
              {meetingInfo.showMessageContent}
            </div>
          </div>
        )} */}
      </div>
      {/* switch 문으로 변경 */}
      {rightWindow()}
    </div>
  );
}

export default RightWindow;
