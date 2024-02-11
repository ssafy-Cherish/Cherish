import { useState } from "react";
import DropdownIcon from "../../assets/Common/DropdownIcon.svg";
import LockIcon from "../../assets/Common/LockIcon.svg";
import Answer from "./Answer";

export default function Question({ reply, handleClickIsQuestionBoxOpen }) {
  const [isOpened, setIsOpened] = useState(false);
  let questioncss = `transition-[height] duration-500 w-[42vw] bg-white mt-[1vw] rounded-[15px] text-[1vw] shadow-md ${
    isOpened && reply ? "h-[25vw] flex flex-col overflow-y-auto" : "h-[4.2vw]"
  }`;

  const handleClickQuestionButton = () => {
    if (reply) {
      setIsOpened((pre) => !pre);
    }
  };
  const handleBackAnswer = () => {
    if (confirm('오늘의 답변을 작성하지 않았어요! 작성하러 갈까요?')) {
      handleClickIsQuestionBoxOpen()
    }
  }
  return (
    <>
      <div id='question' className={questioncss}>
        <div className="grid grid-cols-10">
          <div className="col-span-9 ml-[1vw] mt-[0.2vw] py-[0.5vw]">
            <p>20XX년 X월 X일</p>
            <p>질문들 솰라솰라 솰라</p>
          </div>
          <button
            onClick={reply ? handleClickQuestionButton : handleBackAnswer}
            className="m-auto col-span-1 w-full h-full"
          >
            <img
              src={reply ? DropdownIcon : LockIcon}
              alt="DropdownIcon"
              className="m-auto"
            />
          </button>
        </div>
        {isOpened && reply ? <Answer /> : undefined}
      </div>
    </>
  );
}
