import dayjs from "dayjs";
import TodayRecoding from "../../components/TodayQuestion/TodayRecoding";
import ModalRoute from "../../components/Common/ModalRoute";
import NextIcon from "../../assets/Common/NextIcon.svg";
import { useState } from "react";
import TodayQuestionBox from "../../components/TodayQuestion/TodayQuestionBox";
import useCoupleStore from "../../stores/useCoupleStore";
import { useQuery } from "@tanstack/react-query";

export default function TodayQuestionRecodePage() {
	const [isQuestionBoxOpen, setIsQuestionBoxopen] = useState(false);
	const { question } = useCoupleStore();
	const date = dayjs();
	const year = date.get("y");
	const month = date.get("M") + 1;
	const day = date.get("D");

	const handleClickIsQuestionBoxOpen = () => {
		setIsQuestionBoxopen((pre) => !pre);
	};

  const handleClickIsQuestionBoxOpen = () => {
    setIsQuestionBoxopen((pre) => !pre);
  };

  return (
    <ModalRoute
      modalcss="w-[49.5vw] h-[85vh] bg-pink rounded-[40px]"
      isX={true}
    >
      <p className="text-[1.8vw] ml-[4vw] mt-[2vw]">
        {year}년 {month}월 {day}일
      </p>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={handleClickIsQuestionBoxOpen}
          className="bg-white h-[3vw] w-[42vw] mt-[0.5vw] rounded-[35px] text-[1.3vw] shadow-md text-center leading-[3vw]"
        >
          {isQuestionBoxOpen ? question.content : "오늘의 질문에 답변하기 "}
          <div className="float-right">
            <img src={NextIcon} alt="" />
          </div>
        </button>
        {isQuestionBoxOpen ? <TodayRecoding /> : <TodayQuestionBox handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen} />}
      </div>
    </ModalRoute>
  );
}
