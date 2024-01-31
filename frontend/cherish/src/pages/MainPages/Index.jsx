import MainBookmarkIcon from "../../assets/MainBookmarkIcon.svg";
import Carousel from "../../components/Main/Carousel";
import PotLv1 from "../../assets/PotLv1.svg";
import "./PotExp.css";
import HeartIcon from "../../assets/HeartIcon.svg";
import DiaryImg from "../../assets/DiaryImg.svg";
import CoupleImg1 from "../../assets/CoupleImg1.svg";
import MemoImg from "../../assets/MemoImg.svg";
import { Outlet, Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="mt-[4vw]">
      <div className="flex justify-between">
        <p className="text-[2.5vw]">
          우리 만난지 <span className="text-cherry">99</span>일 째!
        </p>
        <div className="flex relative ml-[5vw] w-[40vw] h-[7vw]">
          <div className="bg-pink w-[36vw] h-[5vw] rounded-[20px] flex justify-around items-center">
            <p className="text-[1.25vw]">오늘의 질문?</p>
            <p className="text-[1vw]">
              오늘의 질문이 들어갈 예정솰로살라솰라이에요!
            </p>
            <div className="bg-white w-[1.5vw] h-[1.5vw] rounded-full drop-shadow-inner"></div>
          </div>
          <div className="absolute z-10 ml-[34vw] mb-[5px]">
            <img src={MainBookmarkIcon} alt="" />
          </div>
        </div>
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
          <div id="PotState" className="col-span-2 flex flex-col items-center">
            <div id="PotImg">
              <img src={PotLv1} alt="PotImg" />
            </div>
            <p id="PotName" className="text-[1.2vw] text-cherry">
              체리 떡잎
            </p>
            <progress
              id="PotExp"
              className="PotExp h-2 w-[7vw] mt-5"
              max="100"
              value="70"
            />
          </div>
          <div
            id="PotDescrption"
            className="col-span-3 flex flex-col items-center justify-around"
          >
            <p id="PotCouple" className="text-[1.5vw]">
              알콩달콩 <span className="text-cherry">커플</span>
            </p>
            <div id="PotCoupleName" className="flex flex-row items-center">
              <p className="text-[1.2vw]">나희도</p>
              <div>
                <img src={HeartIcon} alt="HeartIcon" />
              </div>
              <p className="text-[1.2vw]">백이진</p>
            </div>
            <p className="text-[1.2vw]">D + 99</p>
            <button id="GoPot" className="text-[1.2vw]">
              경험치 기록 보기
            </button>
          </div>
        </Link>
        <div
          id="Diary"
          className="bg-skyblue col-span-2  flex flex-col items-center rounded-[20px] shadow-md"
        >
          <div className="mt-[1vw]">
            <img src={DiaryImg} alt="DiaryImg" />
          </div>
          <p className="mt-[1vw] text-[1.2vw]">다이어리</p>
        </div>
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
