import dayjs from "dayjs";
import TodayRecoding from "../../components/TodayQuestion/TodayRecoding";
import ModalRoute from "../../components/Common/ModalRoute";
import NextIcon from "../../assets/NextIcon.svg";
import { useState } from "react";
import TodayQuestionBox from "../../components/TodayQuestion/TodayQuestionBox";

export default function TodayQuestionRecodePage() {
  const [isQuestionBoxOpen, setIsQuestionBoxopen ]= useState(false)
  const date = dayjs();
  const year = date.get("y");
  const month = date.get("M") + 1;
  const day = date.get("D");

  const handleClickIsQuestionBoxOpen = () => {
    setIsQuestionBoxopen((pre) => !pre)
  }

  return (
    <ModalRoute
      modalcss="w-[49.5vw] h-[85vh] bg-pink rounded-[40px]"
      isX={true}
    >
      <div className="flex flex-col items-center justify-center mt-[2vw] ml-[2.5vw]">
        <p className="text-[1.8vw]">
          {year}년 {month}월 {day}일
        </p>
        <button onClick={handleClickIsQuestionBoxOpen} className="bg-white h-[3vw] w-[42vw] mt-[1vw] rounded-[35px] text-[1.3vw] shadow-md text-center leading-[3vw]">
          오늘의 질문란
          <div className="float-right">
            <img src={NextIcon} alt="" />
          </div>
        </button>
        {isQuestionBoxOpen ? <TodayQuestionBox /> : <TodayRecoding />}
      </div>
    </ModalRoute>
  );
}
