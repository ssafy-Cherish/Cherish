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
          className="w-[50%] h-full font-extrabold text-xl"
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
          className="w-[50%] h-full font-extrabold text-xl"
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
        // <div className="h-[80%] flex flex-col justify-between px-4">
        //   <div className="relative rounded-b-2xl h-[85%]">
        //     <div
        //       className="scroll-box bg-white rounded-b-2xl h-full overflow-y-scroll absolute w-full"
        //       ref={chattingWindow}
        //     >
        //       {meetingInfo.chattingHistory.map((elem, idx) => {
        //         if (elem.isLocal) {
        //           return (
        //             <div
        //               key={idx}
        //               className="flex flex-row justify-end pl-8 pr-4 pt-4 w-full"
        //             >
        //               <div
        //                 style={{
        //                   backgroundColor: "#FEF8EC",
        //                   whiteSpace: "pre-line",
        //                   wordWrap: "break-word",
        //                 }}
        //                 className="py-2 pl-4 pr-4 rounded-tl-xl rounded-b-xl drop-shadow max-w-[90%]"
        //               >
        //                 {elem.message}
        //               </div>
        //             </div>
        //           );
        //         } else {
        //           return (
        //             <div
        //               key={idx}
        //               className="flex flex-row justify-start pl-4 pr-8 pt-4 w-full"
        //             >
        //               <div
        //                 style={{
        //                   backgroundColor: "#E0F4FF",
        //                   whiteSpace: "pre-line",
        //                   wordWrap: "break-word",
        //                 }}
        //                 className="py-2 pl-4 pr-4 rounded-tr-xl rounded-b-xl drop-shadow max-w-[90%]"
        //               >
        //                 {elem.message}
        //               </div>
        //             </div>
        //           );
        //         }
        //       })}
        //     </div>
        //   </div>
        //   <form
        //     onSubmit={(event) => {
        //       event.preventDefault();
        //       if (event.target.childNodes[0].value.trim().length !== 0) {
        //         console.log(event.target.childNodes[0].value);
        //         sendMessage(
        //           JSON.stringify({
        //             cmd: "send chatting massage",
        //             data: event.target.childNodes[0].value,
        //           })
        //         );

        //         fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/meeting/chat`, {
        //           method: "post",
        //           headers: {
        //             Accept: "*/*", // 응답 데이터 타입
        //             "Content-Type": "application/json", // 콘텐츠 타입을 application/json으로 지정
        //           },
        //           body: JSON.stringify({
        //             kakaoId: kakaoId,
        //             nickname: nickname,
        //             meetingId: meetingInfo.meetingId,
        //             content: event.target.childNodes[0].value,
        //           }),
        //         }).catch((err) => {
        //           console.log(err);
        //         });

        //         setMeetingInfo((prevMeetingInfo) => {
        //           const newMeetingInfo = { ...prevMeetingInfo };
        //           newMeetingInfo.chattingHistory = [
        //             ...prevMeetingInfo.chattingHistory,
        //             {
        //               isLocal: true,
        //               message: event.target.childNodes[0].value,
        //             },
        //           ];
        //           return newMeetingInfo;
        //         });
        //       }
        //       event.target.childNodes[0].value = "";
        //     }}
        //     className="mx-4 rounded-2xl h-[10%] flex flex-row"
        //   >
        //     <textarea
        //       className="bg-white w-full rounded-2xl"
        //       onKeyUp={(event) => {
        //         if (event.key === "Enter") {
        //           if (!event.shiftKey) {
        //             if (event.target.value.trim().length !== 0) {
        //               event.preventDefault();
        //               console.log(event.target.value);
        //               const msg = event.target.value;

        //               sendMessage(
        //                 JSON.stringify({
        //                   cmd: "send chatting massage",
        //                   data: event.target.value,
        //                 })
        //               );

        //               fetch(
        //                 `${import.meta.env.VITE_APP_BACKEND_URL}/meeting/chat`,
        //                 {
        //                   method: "post",
        //                   headers: {
        //                     Accept: "*/*", // 응답 데이터 타입
        //                     "Content-Type": "application/json", // 콘텐츠 타입을 application/json으로 지정
        //                   },
        //                   body: JSON.stringify({
        //                     kakaoId: kakaoId,
        //                     nickname: nickname,
        //                     meetingId: meetingInfo.meetingId,
        //                     content: event.target.value,
        //                   }),
        //                 }
        //               ).catch((err) => {
        //                 console.log(err);
        //               });

        //               setMeetingInfo((prevMeetingInfo) => {
        //                 const newMeetingInfo = { ...prevMeetingInfo };
        //                 newMeetingInfo.chattingHistory = [
        //                   ...prevMeetingInfo.chattingHistory,
        //                   {
        //                     isLocal: true,
        //                     message: msg,
        //                   },
        //                 ];
        //                 return newMeetingInfo;
        //               });
        //             }
        //             event.target.value = "";
        //           }
        //         }
        //       }}
        //     ></textarea>
        //     <button className="ml-4 w-12 rounded-2xl flex flex-col justify-center items-center">
        //       <img src={sendImg} className="w-5/6 h-5/6 rounded-2xl" />
        //     </button>
        //   </form>
        // </div>
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
        <ClipBox meetingInfo={meetingInfo}/>
      )}
    </div>
  );
}

export default RightWindow;
