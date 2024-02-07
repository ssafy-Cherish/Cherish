import ChattingBox from "./ChattingBox";
import ClipBox from "./ClipBox";

function RightWindow({
  meetingInfo,
  setMeetingInfo,
  chattingWindow,
  sendMessage,
  kakaoId,
  nickname,
  sendImg,
}) {
  return (
    <div className="bg-pink h-[75%] m-2 rounded-2xl flex flex-col justify-evenly">
      <div className="bg-white mx-4 rounded-t-2xl h-[10%]">
        <button
          className={`w-[50%] h-full font-extrabold text-xl ${
            meetingInfo.rightWindowIsChatting ? "text-cherry" : ""
          }`}
          disabled={meetingInfo.rightWindowIsChatting}
          onClick={() => {
            setMeetingInfo((prevMeetingInfo) => {
              const newMeetingInfo = { ...prevMeetingInfo };
              newMeetingInfo.rightWindowIsChatting =
                !newMeetingInfo.rightWindowIsChatting;
              return newMeetingInfo;
            });
          }}
        >
          체리톡
        </button>
        <button
          className={`w-[50%] h-full font-extrabold text-xl ${
            meetingInfo.rightWindowIsChatting ? "" : "text-cherry"
          }`}
          disabled={!meetingInfo.rightWindowIsChatting}
          onClick={() => {
            setMeetingInfo((prevMeetingInfo) => {
              const newMeetingInfo = { ...prevMeetingInfo };
              newMeetingInfo.rightWindowIsChatting =
                !newMeetingInfo.rightWindowIsChatting;
              return newMeetingInfo;
            });
          }}
        >
          클립
        </button>
      </div>
      {meetingInfo.rightWindowIsChatting ? (
        <ChattingBox
          meetingInfo={meetingInfo}
          setMeetingInfo={setMeetingInfo}
          chattingWindow={chattingWindow}
          sendMessage={sendMessage}
          kakaoId={kakaoId}
          nickname={nickname}
          sendImg={sendImg}
        />
      ) : (
        <ClipBox meetingInfo={meetingInfo} />
      )}
    </div>
  );
}

export default RightWindow;
