import MainBookmarkIcon from "../../assets/Main/MainBookmarkIcon.svg";

export default function TodayQuestionCard() {
  return (
    <>
      <div className="flex relative ml-[5vw] w-[40vw] h-[7vw]">
        <div className="bg-pink w-[36vw] h-[5vw] rounded-[20px] flex justify-around items-center">
          <p className="text-[1.25vw] font-bold text-text-gray">오늘의 질문?</p>
          <p className="text-[1vw] text-text-black">
            오늘의 질문이 들어갈 예정솰로살라솰라이에요!
          </p>
          <div className="bg-white w-[1.5vw] h-[1.5vw] rounded-full drop-shadow-inner"></div>
        </div>
        <div className="absolute ml-[34vw] mb-[5px]">
          <img src={MainBookmarkIcon} alt="" />
        </div>
      </div>
    </>
  );
}
