import Carousel from "../../components/Main/Carousel";
import CoupleImg1 from "../../assets/Common/CoupleImg1.svg";
import MemoImg from "../../assets/MemoImg.svg";
import { Outlet, Link } from "react-router-dom";
import PotCard from "../../components/Main/PotCard";
import TodayQuestionCard from "../../components/Main/TodayQuestionCard";
import DiaryCard from "../../components/Main/DiaryCard";
import dayjs from "dayjs";
import useCoupleStore from "../../stores/useCoupleStore";
import MainMemo from "../../components/Main/MainMemo";
import { motion } from "framer-motion";

export default function Index() {
  const { anniversary } = useCoupleStore();
  const today = dayjs();
  const anni = dayjs(anniversary);
  const rs = today.diff(anni, "day", true);
  const dday = Math.floor(rs) + 1;

  return (
    <div className="mt-[4vw]">
      <div className="flex justify-between">
        <p className="text-[2.5vw] text-text-gray font-bold">
          우리 만난지 <span className="text-cherry">{dday}</span>일 째!
        </p>
        <Link to="today" id="today">
          <TodayQuestionCard />
        </Link>
      </div>
      <Carousel />
      <div
        id="LinkCradWrapper"
        className="mt-5 h-[17vw] grid grid-cols-9 gap-8"
      >
        <motion.div whileHover={{ scale: 1.1 }} className="col-span-3">
          <Link
            to="pot"
            id="Pot"
            className="h-full bg-pink grid grid-cols-5 rounded-[20px] shadow-md"
          >
            <PotCard dday={dday} />
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="col-span-2">
          <Link
            to="diary"
            id="Diary"
            className="h-full bg-skyblue flex flex-col items-center rounded-[20px] shadow-md"
          >
            <DiaryCard />
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="col-span-2">
          <Link
            to="cherrycall"
            id="CherryCall"
            className="h-full bg-beige flex flex-col items-center justify-around rounded-[20px] shadow-md"
          >
            <p className="text-[1.2vw] mt-[1vw] font-bold text-text-gray">
              <span className="text-cherry">체리콜</span>로 화분을 키워요!
            </p>
            <div className="grow flex justify-center items-center w-[70%]">
              <img src={CoupleImg1} alt="CoupleImg1" />
            </div>
            <p className="text-[1.2vw] mb-[0.5vw] text-text-black">체리콜</p>
          </Link>
        </motion.div>
        <div id="Memo" className="col-span-2">
          <MainMemo />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
