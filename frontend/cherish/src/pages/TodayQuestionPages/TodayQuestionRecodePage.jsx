import dayjs from "dayjs";
import TodayRecoding from "../../components/TodayQuestion/TodayRecoding";
import ModalRoute from "../../components/Common/ModalRoute";
import NextIcon from "../../assets/Common/NextIcon.svg";
import { useState } from "react";
import TodayQuestionBox from "../../components/TodayQuestion/TodayQuestionBox";
import useCoupleStore from "../../stores/useCoupleStore";
import { useQuery } from "@tanstack/react-query";
import { getAnsList } from "../../services/QuestionService";

export default function TodayQuestionRecodePage() {
  const [isQuestionBoxOpen, setIsQuestionBoxopen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isRecoding, setIsRecoding] = useState(false);
  const { question } = useCoupleStore();
  const date = dayjs();
  const year = date.get("y");
  const month = date.get("M") + 1;
  const day = date.get("D");
  const { coupleId } = useCoupleStore();
  const { data: ansList, isLoading } = useQuery({
    queryKey: ["ansList", coupleId],
    queryFn: () => getAnsList(coupleId),
  });

  const handleClickIsQuestionBoxOpen = () => {
    if (!isAnswered) {
      setIsQuestionBoxopen((pre) => !pre);
    } else {
      alert("상대방이 아직 답변을 작성하지 않았어요! 조금 기다릴까요?");
    }
  };

  const handleIsAnswered = () => {
    setIsAnswered((pre) => true);
  };

  const handleIsRecording = () => {
    setIsRecoding((pre) => !pre);
  };

  if (isLoading) {
    return <div>로딩 중</div>;
  }

  return (
    <ModalRoute
      modalcss="w-[49.5vw] h-[85vh] bg-pink rounded-[40px]"
      isX={true}
    >
      <p className="text-[1.8vw] ml-[4vw] mt-[2vw] text-text-black">
        {year}년 {month}월 {day}일
      </p>
      <div className="flex flex-col items-center justify-center mx-auto">
        <button
          onClick={handleClickIsQuestionBoxOpen}
          disabled={isRecoding}
          className="bg-white h-[3vw] w-[42vw] mt-[0.5vw] rounded-[35px] shadow-md leading-[3vw] grid grid-cols-10"
        >
          <p className="text-[1.3vw] col-span-9 text-text-black hover:text-[#888888]">
            {isQuestionBoxOpen ? question?.content : "오늘의 질문에 답변하기 "}
          </p>
          <div className="col-span-1 h-[2.5vw] my-auto">
            <img className="m-auto w-full h-full" src={NextIcon} alt="" />
          </div>
        </button>
        {isQuestionBoxOpen ? (
          <TodayRecoding
            handleIsRecording={handleIsRecording}
            handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen}
            handleIsAnswered={handleIsAnswered}
          />
        ) : (
          <TodayQuestionBox
            handleIsAnswered={handleIsAnswered}
            isAnswered={isAnswered}
            ansList={ansList}
            handleClickIsQuestionBoxOpen={handleClickIsQuestionBoxOpen}
          />
        )}
      </div>
    </ModalRoute>
  );
}
