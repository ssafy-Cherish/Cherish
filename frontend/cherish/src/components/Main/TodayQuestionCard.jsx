import MainBookmarkIcon from "../../assets/Main/MainBookmarkIcon.svg";
import useCoupleStore from "../../stores/useCoupleStore";



export default function TodayQuestionCard() {
  const {question} = useCoupleStore()
  return (
    <>
      <div
        className="flex relative ml-[5vw] w-[40vw] h-[7vw]"
      >
        <div className="bg-pink w-[36vw] h-[5vw] rounded-[20px] flex items-center">
          <p className="text-[1.25vw] font-bold text-text-gray ml-[2vw]">오늘의 질문?</p>
          <p className="text-[1vw] text-text-black ml-[2vw]">
          {question.content}
          </p>

        </div>
        <div className="absolute left-[80%] -top-[20%]">
          <img src={MainBookmarkIcon} alt="" />
        </div>
      </div>
    </>
  );
}
