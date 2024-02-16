import { useEffect, useState } from "react";
import DropdownIcon from "../../assets/Common/DropdownIcon.svg";
import LockIcon from "../../assets/Common/LockIcon.svg";
import Answer from "./Answer";
import dayjs from "dayjs";
import { motion } from "framer-motion";

export default function Question({
  reply,
  handleClickIsQuestionBoxOpen,
  answer,
  handleIsAnswered,
}) {
  let date = null;
  if (reply === 0) {
    const day = dayjs();
    date = day.format("YYYY년 M월 D일");
  } else if (reply === 1) {
    const day = dayjs(answer[0].created_at);
    date = day.format("YYYY년 M월 D일");
  } else {
    const day1 = dayjs(answer[0].created_at);
    const day2 = dayjs(answer[1].created_at);
    const day = day1.isAfter(day2) ? day1 : day2;
    date = day.format("YYYY년 M월 D일");
  }

  useEffect(() => {
    if (reply === 1) {
      handleIsAnswered();
    }
  }, [reply]);

  const [isOpened, setIsOpened] = useState(false);
  let questioncss = `transition-[height] duration-500 w-[42vw] bg-white mt-[1vw] rounded-[15px] text-[1vw] shadow-md ${
    isOpened && reply
      ? "h-[25vw] flex flex-col overflow-y-auto"
      : "h-[4.2vw] hover:bg-[#EFEFEF]"
  }`;

  const handleClickQuestionButton = () => {
    if (reply === 2) {
      setIsOpened((pre) => !pre);
    }
  };
  const handleBackAnswer = () => {
    if (reply === 0) {
      if (confirm("오늘의 답변을 작성하지 않았어요! 작성하러 갈까요?")) {
        handleClickIsQuestionBoxOpen();
      }
    } else if (reply === 1) {
      alert("상대방이 아직 답변을 작성하지 않았어요! 조금 기다릴까요?");
    }
  };
  return (
    <>
      <motion.div id="question" className={questioncss}>
        <div className="grid grid-cols-10">
          <div className="col-span-9 ml-[1vw] mt-[0.2vw] py-[0.5vw] text-text-black">
            <p>{date}</p>
            <p>{answer[0].content}</p>
          </div>
          <button
            onClick={reply === 2 ? handleClickQuestionButton : handleBackAnswer}
            className="m-auto col-span-1 w-full h-full"
          >
            <img
              src={reply === 2 ? DropdownIcon : LockIcon}
              alt="DropdownIcon"
              className={"m-auto " + (isOpened && reply === 2 && "rotate-180")}
            />
          </button>
        </div>
        {isOpened && reply === 2 ? <Answer answer={answer} /> : undefined}
      </motion.div>
    </>
  );
}
