import Carousel from "../../components/Main/Carousel";
import CoupleImg1 from "../../assets/CoupleImg1.svg";
import MemoImg from "../../assets/MemoImg.svg";
import { Outlet, Link } from "react-router-dom";
import PotCard from "../../components/Main/PotCard";
import TodayQuestionCard from "../../components/Main/TodayQuestionCard";
import DiaryCard from "../../components/Main/DiaryCard";

export default function Index() {
  return (
    <div className="mt-[4vw]">
      <div className="flex justify-between">
        <p className="text-[2.5vw]">
          우리 만난지 <span className="text-cherry">99</span>일 째!
        </p>
        <Link to="today" id="today">
          <TodayQuestionCard />
        </Link>
      </div>
      <Carousel />
      <div
        id="LinkCradWrapper"
        className="mt-5 h-[17vw] grid grid-cols-9 gap-5"
      >
        <Link
          to="pot"
          id="Pot"
          className="bg-pink col-span-3 grid grid-cols-5 rounded-[20px] shadow-md"
        >
          <PotCard />
        </Link>
        <Link
          to="diary"
          id="Diary"
          className="bg-skyblue col-span-2  flex flex-col items-center rounded-[20px] shadow-md"
        >
          <DiaryCard />
        </Link>
        <div
          id="CherryCall"
          className="bg-beige col-span-2 flex flex-col items-center justify-around rounded-[20px] shadow-md"
        >
          <p className="text-[1.2vw] mt-[1vw]">
            <span className="text-cherry">체리콜</span>로 화분을 키워요!
          </p>
          <div>
            <img src={CoupleImg1} alt="CoupleImg1" />
          </div>
          <p className="text-[1.2vw] mb-[1.8vw]">체리콜</p>
        </div>
        <div id="Memo" className="col-span-2 relative">
          <div className="w-[17vw]">
            <div className="absolute mt-[4.5vw] ml-[4.5vw]">
              <p className="text-[1vw] text-center">
                <span>Memo</span>
                <br />
                <br /> 세줄세줄세줄세줄
                <br />
                세줄세줄세줄세줄
                <br />
                세줄세줄세줄세줄
              </p>
            </div>
            <img className="w-full" src={MemoImg} alt="MemoImg" />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
