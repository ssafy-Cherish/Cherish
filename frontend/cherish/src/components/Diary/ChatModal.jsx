/* eslint-disable react/prop-types */
import { Fragment } from "react";
import "../../components/Diary/DiaryDailyPage.css";
import Modal from "./Modal";

const ChatModal = ({ chats, onClose, myId }) => {
  return (
    <Modal onClose={onClose} dialogCss="w-[30vw] h-[60vh] bg-pink p-5 rounded-2xl" isX={true}>
      <div className="relative rounded-b-2xl h-full">
        <div className="bg-white rounded-2xl h-full overflow-y-auto absolute w-full p-5 rmscroll">
          {chats.map((chat, idx) => {
            return (
              <Fragment key={idx}>
                {myId === chat.kakaoId ? (
                  <div key={idx} className="flex flex-row justify-end pl-8 pr-4 pt-4 ">
                    <div
                      style={{
                        backgroundColor: "#FEF8EC",
                        whiteSpace: "pre-line",
                        wordWrap: "break-word",
                      }}
                      className="py-2 pl-4 pr-4 rounded-tl-xl rounded-b-xl drop-shadow max-w-[80%]"
                    >
                      {chat.content}
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="flex flex-row justify-start pl-4 pr-8 pt-4">
                    <div
                      style={{
                        backgroundColor: "#E0F4FF",
                        whiteSpace: "pre-line",
                        wordWrap: "break-word",
                      }}
                      className="py-2 pl-4 pr-4 rounded-tr-xl rounded-b-xl drop-shadow max-w-[80%]"
                    >
                      {chat.content}
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
