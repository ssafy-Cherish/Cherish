import { useState } from "react";
import DropDownIcon from "../../assets/DropDownIcon.svg";
import LockIcon from "../../assets/LockIcon.svg";
import test from "../../assets/test.png";
import Answer from "./Answer";

export default function Question({ reply }) {
  const [isOpened, setIsOpened] = useState(false);
  let questioncss = `w-[42vw] bg-white mt-[1vw] rounded-[15px] text-[1vw] shadow-md grid grid-cols-10 ${
    isOpened && reply ? "h-[25vw] flex flex-row" : ""
  }`;

  const handleClickQuestionButton = () => {
    if (reply) {
      setIsOpened((pre) => !pre);
    }
  };
  return (
    <>
      <div className={questioncss}>
        <div className="col-span-9 ml-[1vw] mt-[0.2vw] py-[0.5vw]">
          <p>20XX년 X월 X일</p>
          <p>질문들 솰라솰라 솰라</p>
        </div>
        <button
          onClick={handleClickQuestionButton}
          className="m-auto col-span-1 w-full h-full"
        >
          <img
            src={reply ? DropDownIcon : LockIcon}
            alt="DropDwonIcon"
            className="m-auto"
          />
        </button>
        {isOpened && reply ? <Answer /> : undefined}
      </div>

    </>
  );
}
