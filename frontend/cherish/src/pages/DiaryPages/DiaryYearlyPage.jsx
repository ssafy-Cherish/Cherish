import Modal from "../../components/Common/Modal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useAnimate } from "framer-motion";
import yearlyImg from "../../assets/diary/DiaryYearlyPage.svg";

import Month1 from "../../assets/diary/Month/Month1.svg";
import Month2 from "../../assets/diary/Month/Month2.svg";
import Month3 from "../../assets/diary/Month/Month3.svg";
import Month4 from "../../assets/diary/Month/Month4.svg";
import Month5 from "../../assets/diary/Month/Month5.svg";
import Month6 from "../../assets/diary/Month/Month6.svg";
import Month7 from "../../assets/diary/Month/Month7.svg";
import Month8 from "../../assets/diary/Month/Month8.svg";
import Month9 from "../../assets/diary/Month/Month9.svg";
import Month10 from "../../assets/diary/Month/Month10.svg";
import Month11 from "../../assets/diary/Month/Month11.svg";
import Month12 from "../../assets/diary/Month/Month12.svg";

const MonthArr = [
  Month1,
  Month2,
  Month3,
  Month4,
  Month5,
  Month6,
  Month7,
  Month8,
  Month9,
  Month10,
  Month11,
  Month12,
];

const DiaryYearlyPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scope, animate] = useAnimate();
  let year = searchParams.get("year");
  if (!year) year = new Date().getFullYear();

  function moveYear(move) {
    animate("#year", { y: [0, -5, 5, 0] }, { duration: 0.2 });
    animate("#month", { opacity: [1, 0, 1] });
    year = +year + move;
    searchParams.set("year", year);
    setSearchParams(searchParams, { replace: true });
  }

  function moveToMonth(month) {
    navigate({ pathname: "/diary/month", search: `?year=${year}&month=${month}` });
  }

  return (
    <Modal z={1} modalcss="h-[90vh] w-[70vw]" isX={false} nav="/">
      <div
        className="flex flex-col  absolute h-[40vw] ml-[12vw] mt-[2vw] w-[45vw] items-center"
        ref={scope}
      >
        <div className="text-[2vw] text-red-400 mb-[2vw] ">
          <button onClick={() => moveYear(-1)}>&lt;</button>
          <div id="year" className="inline-block text-[2vw]">
            &nbsp;{year}&nbsp;
          </div>
          <button onClick={() => moveYear(1)}>&gt;</button>
        </div>
        <div className="grid grid-rows-4 grid-cols-3 w-[35vw] h-[40vw]">
          {MonthArr.map((src, i) => (
            <div key={src} className="col-span-1 row-span-1 w-[8vw]">
              <motion.img
                id="month"
                src={src}
                alt={src}
                whileHover={{ scale: 1.2 }}
                className="ml-[2vw] w-full h-full hover:cursor-pointer"
                onClick={() => moveToMonth(i + 1)}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <img className="w-full" src={yearlyImg} alt="" />
      </div>
    </Modal>
  );
};

export default DiaryYearlyPage;
