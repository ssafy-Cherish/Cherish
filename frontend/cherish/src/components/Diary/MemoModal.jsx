/* eslint-disable react/prop-types */
import { useState } from "react";
import "../../components/Diary/DiaryDailyPage.css";
import Modal from "./Modal";

const MemoModal = ({ onClose, memo }) => {
  const [isWriting, setIsWriting] = useState();
  const [content, setContent] = useState(memo.content);

  function changeContent(event) {
    setContent(event.target.value);
  }

  function cancelContent() {
    setContent(memo.content);
    setIsWriting(false);
  }

  function saveContent() {
    // TODO : 업데이트 쿼리 날려야 함, 또는 memoId가 없다면 insert

    setIsWriting(false);
  }

  return (
    <Modal
      onClose={onClose}
      dialogCss="w-[30vw] h-[60vh] bg-skyblue p-5 rounded-2xl relative"
      isX={true}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-center max-w-full ">
          <div className="text-[2vw] italic">Memo</div>
        </div>
        <div className="divider  divider-start italic">Content</div>
        <div className="h-full max-h-full p-[1vw]">
          {isWriting ? (
            <textarea
              cols="30"
              rows="10"
              className="w-full h-full resize-none rounded-xl drop-shadow-xl p-[1vw] border-solid border-2 border-text-gray"
              value={content}
              onChange={changeContent}
            ></textarea>
          ) : (
            <div
              style={{
                backgroundColor: "#E0F4FF",
                whiteSpace: "pre-line",
                wordWrap: "break-word",
              }}
              className="rounded-xl drop-shadow-xl h-full p-[1vw] border-solid border-2 border-text-gray"
            >
              {memo.content}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-around">
          {isWriting ? (
            <>
              <div
                onClick={cancelContent}
                className="btn hover:bg-slate-600 hover:text-white text-black bg-beige w-[4vw] text-[0.9vw]"
              >
                취소
              </div>
              <div
                onClick={saveContent}
                className="btn bg-slate-600 text-white hover:text-black hover:bg-beige w-[4vw] text-[0.9vw]"
              >
                저장
              </div>
            </>
          ) : (
            <div
              onClick={() => setIsWriting(true)}
              className="btn bg-slate-600 text-white hover:text-black hover:bg-beige text-[0.9vw]"
            >
              <span>수정</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MemoModal;
